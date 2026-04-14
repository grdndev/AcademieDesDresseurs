#!/usr/bin/env node
// Usage (container): ORDER_ID=<id> TX=<tx> node /app/simulate-payment.js
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env.docker' });

// Robustly require the Order model: try several likely relative paths so the
// script can be executed from different working directories (repo vs container).
const path = require('path');
function tryRequire(relPaths) {
  for (const p of relPaths) {
    try {
      return require(p);
    } catch (e) {
      // continue
    }
  }
  throw new Error('Could not require Order model from any known path');
}

const Order = tryRequire([
  path.join(__dirname, '..', 'models', 'Order'),      // backend/scripts -> backend/models
  path.join(__dirname, '..', '..', 'models', 'Order'), // backend/scripts -> models
  path.join(process.cwd(), 'models', 'Order'),         // /app/scripts -> /app/models
  './models/Order',                                   // fallback
]);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/express_api_db';

async function main() {
  const orderId = process.env.ORDER_ID || process.argv[2];
  const tx = process.env.TX || process.argv[3] || `SIM_TX_${Date.now()}`;
  if (!orderId) {
    console.error('Missing ORDER_ID (env) or argv[2]');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo:', MONGO_URI);

  const order = await Order.findById(orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    process.exit(2);
  }

  console.log('Order found:', order.orderNumber, 'current status:', order.status);

  // Mark as paid
  await order.markAsPaid(tx);
  console.log('Order marked as paid. status:', order.status, 'payment.status:', order.payment.status, 'transactionId:', order.payment.transactionId);

  // Decrement stock (unstock)
  await order.unstock();
  console.log('Stock decremented for order items.');

  // Re-fetch order to show latest
  const updated = await Order.findById(orderId);
  console.log('Updated order status:', updated.status);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
