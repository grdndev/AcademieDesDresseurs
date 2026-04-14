#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== E2E: start docker-compose"
docker-compose up -d

# wait for API health
echo "== Waiting for API health (http://localhost:5001/health)"
for i in {1..30}; do
  if curl -sS http://localhost:5001/health >/dev/null 2>&1; then
    echo "API healthy"
    break
  fi
  echo "  waiting... ($i)"
  sleep 2
done

# ensure jq present
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required on host to run this script. Install jq and retry." >&2
  exit 2
fi

# ensure sample data exists by running container-side seed script (idempotent)
echo "== Seeding sample data inside api container (if script exists)"
# try common locations depending on image WORKDIR/copy layout
docker-compose exec -T api sh -lc '
  if [ -f /app/backend/scripts/seed-sample-container.js ]; then
    echo "found seed script in /app/backend/scripts";
    node /app/backend/scripts/seed-sample-container.js;
  elif [ -f /app/scripts/seed-sample-container.js ]; then
    echo "found seed script in /app/scripts";
    node /app/scripts/seed-sample-container.js;
  else
    echo "no seed script found, skipping";
  fi
' || true

# fetch one card and one accessory to use in order
CARD_ID=$(curl -sS "http://localhost:5001/api/cards?limit=1" | jq -r '.cards[0]._id')
ACCESSORY_ID=$(curl -sS "http://localhost:5001/api/accessories?limit=1" | jq -r '.accessories[0]._id')

if [[ -z "$CARD_ID" || "$CARD_ID" == "null" ]]; then
  echo "No card found to create order" >&2
  exit 3
fi
if [[ -z "$ACCESSORY_ID" || "$ACCESSORY_ID" == "null" ]]; then
  echo "No accessory found to create order" >&2
  exit 3
fi

echo "Using CARD_ID=$CARD_ID ACCESSORY_ID=$ACCESSORY_ID"

# Build order payload (guest) using a portable heredoc
ORDER_PAYLOAD=$(cat <<'JSON'
{
  "customerInfo": {"email":"test+e2e@example.com","firstName":"E2E","lastName":"Tester"},
  "shippingAddress": {"street":"1 Test St","city":"Paris","zipCode":"75001","country":"France"},
  "billingAddress": {"street":"1 Test St","city":"Paris","zipCode":"75001","country":"France"},
  "items": []
}
JSON
)

# insert items into payload using jq
ORDER_PAYLOAD=$(jq --arg cardId "$CARD_ID" --arg accId "$ACCESSORY_ID" '.items = [
  {"itemType":"card","itemId":$cardId,"quantity":1},
  {"itemType":"accessory","itemId":$accId,"quantity":2}
]' <<< "$ORDER_PAYLOAD")

 echo "== Creating order (guest)"
CREATE_RES=$(curl -sS -X POST http://localhost:5001/api/orders -H 'Content-Type: application/json' -d "$ORDER_PAYLOAD")
ORDER_ID=$(jq -r '.order._id // .orderId // .orderId' <<< "$CREATE_RES")

if [[ -z "$ORDER_ID" || "$ORDER_ID" == "null" ]]; then
  echo "Order creation failed: $CREATE_RES" >&2
  exit 4
fi

echo "Order created: $ORDER_ID"

# capture pre-stock levels
CARD_PRE_STOCK=$(curl -sS "http://localhost:5001/api/cards/$CARD_ID" | jq -r '.card.stock')
ACC_PRE_STOCK=$(curl -sS "http://localhost:5001/api/accessories/$ACCESSORY_ID" | jq -r '.accessory.stock')

echo "Pre-stock: card=$CARD_PRE_STOCK accessory=$ACC_PRE_STOCK"

# confirm payment via API (real app flow endpoint)
echo "== Confirming payment via API"
PAYMENT_RES=$(curl -sS -X POST http://localhost:5001/api/payment/confirm \
  -H 'Content-Type: application/json' \
  -d "{\"orderId\":\"$ORDER_ID\",\"paymentIntentId\":\"E2E_TX\"}")

if [[ "$(jq -r '.message // empty' <<< "$PAYMENT_RES")" == "" ]]; then
  echo "payment confirm failed: $PAYMENT_RES" >&2
  exit 5
fi

echo "Payment response: $PAYMENT_RES"

# fetch results
ORDER_RES=$(curl -sS "http://localhost:5001/api/orders/$ORDER_ID")
CARD_POST_STOCK=$(curl -sS "http://localhost:5001/api/cards/$CARD_ID" | jq -r '.card.stock')
ACC_POST_STOCK=$(curl -sS "http://localhost:5001/api/accessories/$ACCESSORY_ID" | jq -r '.accessory.stock')

PAYMENT_STATUS=$(jq -r '.order.payment.status' <<< "$ORDER_RES")
ORDER_STATUS=$(jq -r '.order.status' <<< "$ORDER_RES")

# evaluate
echo "Post-stock: card=$CARD_POST_STOCK accessory=$ACC_POST_STOCK"

echo "Order status: $ORDER_STATUS, payment.status: $PAYMENT_STATUS"

PASS=true
if [[ "$PAYMENT_STATUS" != "completed" ]]; then
  echo "FAIL: payment not completed" >&2
  PASS=false
fi
if [[ "$ORDER_STATUS" != "confirmed" ]]; then
  echo "FAIL: order not confirmed" >&2
  PASS=false
fi

# expected deltas
if [[ $((CARD_POST_STOCK)) -ne $((CARD_PRE_STOCK - 1)) ]]; then
  echo "FAIL: card stock did not decrement by 1 (pre=$CARD_PRE_STOCK post=$CARD_POST_STOCK)" >&2
  PASS=false
fi
if [[ $((ACC_POST_STOCK)) -ne $((ACC_PRE_STOCK - 2)) ]]; then
  echo "FAIL: accessory stock did not decrement by 2 (pre=$ACC_PRE_STOCK post=$ACC_POST_STOCK)" >&2
  PASS=false
fi

if [[ "$PASS" = true ]]; then
  echo "E2E PASSED: order processed and stock decremented as expected"
  exit 0
else
  echo "E2E FAILED" >&2
  exit 6
fi
