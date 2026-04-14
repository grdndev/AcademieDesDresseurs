#!/usr/bin/env bash
# Run simple smoke checks from inside the frontend container using docker-compose
set -euo pipefail

echo "Running smoke checks from frontend container (api:5001)..."

docker compose exec -T frontend sh -c '\
  for ep in /health /api/cards /api/decks /api/accessories /api/cards/popular/list /api/cards/new/list; do \
    echo "==> $ep"; \
    curl -sS -w "\nHTTP_STATUS:%{http_code}\n" http://api:5001$ep || true; \
    echo; \
  done'
