const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Order = require('../models/Order');
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const Accessory = require('../models/Accessory');
const User = require('../models/User');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { getModel } = require('../utils.js');

// ==================== STRIPE ====================

// POST /api/payment/create-intent - Créer une intention de paiement Stripe
router.post('/create-intent', optionalAuth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Vérifier que la commande appartient à l'utilisateur ou est une guest order
    if (order.user && req.user) {
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    // Vérifier le stock de la commande
    let available = true;
    for (let item of order.items) {
      const Model = getModel(item.itemType);
      const product = await Model.findById(item.item);

      if (!await product.isAvailable(item.quantity)) {
        available = false;
      }
    }

    if (!available) {
      return res.status(400).json({ error: 'Certains articles ne sont plus disponibles' });
    }

    // TODO: Intégrer le vrai SDK Stripe
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(order.pricing.total * 100), // en centimes
    //   currency: 'eur',
    //   metadata: {
    //     orderId: order._id.toString(),
    //     orderNumber: order.orderNumber
    //   }
    // });

    // MOCK pour le moment
    const paymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      amount: Math.round(order.pricing.total * 100),
      currency: 'eur'
    };

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.pricing.total
    });

    if (order.status != 'locked') {
      await order.unstock();
      await order.lock(paymentIntent.id);
    }
  } catch (error) {
    console.error('Erreur create payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/confirm - Confirmer un paiement
router.post('/confirm', optionalAuth, async (req, res) => {
  try {
    const { orderId, paymentIntentId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Marquer la commande comme payée + envoi du mail
    await order.unstock();
    await order.markAsPaid(paymentIntentId);

    // Mettre à jour les stats de l'utilisateur si connecté
    if (order.user) {
      const user = await User.findById(order.user);
      if (user) {
        await user.updateStatsAfterOrder(order.pricing.total);
      }
    }

    res.json({
      message: 'Paiement confirmé avec succès',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.pricing.total
      }
    });

  } catch (error) {
    console.error('Erreur confirm payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/webhook - Webhook Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    let paymentIntent;
    const sig = req.headers['stripe-signature'];

    // Vérifier la signature Stripe
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Traiter l'événement
    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object;
        const paidOrder = await Order.findById(paymentIntent.metadata.orderId);
        if (!paidOrder) {
          return res.json(500, {error: "Commande introuvable"});
        }

        // Marquer la commande comme payée
        await paidOrder.markAsPaid(paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        paymentIntent = event.data.object;
        const failedOrder = await Order.findById(paymentIntent.metadata.orderId);

        if (!failedOrder) {
          return res.json(500, {error: "Commande introuvable"});
        }

        // Remettre en stock
        await failedOrder.restock();

        // Gérer l'échec du paiement
        await failedOrder.markPaymentAsFailed(paymentIntent.id);

        break;
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(400).json({ error: error.message });
  }
});

// ==================== PAYPAL ====================

// POST /api/payment/paypal/create - Créer un paiement PayPal
router.post('/paypal/create', optionalAuth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Vérifier le stock de la commande
    if (order.checkUnavailable().length) {
      return res.status(400).json({ error: 'Certains articles ne sont plus disponibles' });
    }

    // TODO: Intégrer le vrai SDK PayPal
    // const paypal = require('@paypal/checkout-server-sdk');
    // const request = new paypal.orders.OrdersCreateRequest();
    // request.prefer("return=representation");
    // request.requestBody({
    //   intent: 'CAPTURE',
    //   purchase_units: [{
    //     amount: {
    //       currency_code: 'EUR',
    //       value: order.pricing.total.toFixed(2)
    //     }
    //   }]
    // });

    // MOCK pour le moment
    const mockPayPalOrder = {
      id: `PAYPAL_${Date.now()}`,
      status: 'CREATED',
      links: [
        {
          rel: 'approve',
          href: `https://www.paypal.com/checkoutnow?token=MOCK_${Date.now()}`
        }
      ]
    };

    res.json({
      paypalOrderId: mockPayPalOrder.id,
      approvalUrl: mockPayPalOrder.links[0].href
    });

    await order.unstock();
  } catch (error) {
    console.error('Erreur create PayPal payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payment/paypal/capture - Capturer un paiement PayPal
router.post('/paypal/capture', optionalAuth, async (req, res) => {
  try {
    const { orderId, paypalOrderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // TODO: Capturer le paiement PayPal
    // const paypal = require('@paypal/checkout-server-sdk');
    // const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    // const capture = await paypalClient.execute(request);

    // Marquer la commande comme payée
    await order.markAsPaid(paypalOrderId);

    // Déduire le stock
    await order.unstock();

    res.json({
      message: 'Paiement PayPal confirmé',
      order: {
        orderNumber: order.orderNumber,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Erreur capture PayPal payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REMBOURSEMENTS ====================

// POST /api/payment/:orderId/refund - Rembourser une commande (admin)
router.post('/:orderId/refund', authenticate, requireAdmin, async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    if (order.payment.status !== 'completed') {
      return res.status(400).json({
        error: 'La commande n\'a pas été payée'
      });
    }

    const refundAmount = amount || order.pricing.total;

    await order.refund(refundAmount);

    await order.save();

    res.json({
      message: 'Remboursement effectué',
      refundAmount,
      order
    });

  } catch (error) {
    console.error('Erreur refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== HISTORIQUE & STATS ====================

// GET /api/payment/history - Historique des paiements de l'utilisateur
router.get('/history', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      'payment.status': { $in: ['completed', 'refunded'] }
    })
      .sort({ 'payment.paidAt': -1 })
      .select('orderNumber payment pricing createdAt');

    res.json({ payments: orders });

  } catch (error) {
    console.error('Erreur get payment history:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/payment/stats - Statistiques de paiement (admin)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filters = {
      'payment.status': 'completed'
    };

    if (startDate || endDate) {
      filters['payment.paidAt'] = {};
      if (startDate) filters['payment.paidAt'].$gte = new Date(startDate);
      if (endDate) filters['payment.paidAt'].$lte = new Date(endDate);
    }

    // Chiffre d'affaires total
    const totalRevenue = await Order.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Chiffre d'affaires par méthode de paiement
    const revenueByMethod = await Order.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$payment.method',
          total: { $sum: '$pricing.total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Remboursements
    const refunds = await Order.aggregate([
      {
        $match: {
          'payment.status': 'refunded'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.refundAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalRevenue: totalRevenue[0] || { total: 0, count: 0 },
      revenueByMethod,
      refunds: refunds[0] || { total: 0, count: 0 }
    });

  } catch (error) {
    console.error('Erreur get payment stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
