const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const Accessory = require('../models/Accessory');
const User = require('../models/User');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

// Helper pour obtenir le modèle selon le type
const getModel = (itemType) => {
  switch (itemType) {
    case 'card': return Card;
    case 'deck': return Deck;
    case 'accessory': return Accessory;
    default: throw new Error('Type d\'article invalide');
  }
};

// ==================== ROUTES PUBLIQUES/UTILISATEUR ====================

// POST /api/orders - Créer une nouvelle commande
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      items,
      customerInfo,
      shippingAddress,
      billingAddress,
      useSameAddress,
      promoCode,
      paymentMethod
    } = req.body;
    
    // Validation des items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }
    
    // Vérifier le stock et calculer les prix
    const processedItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const Model = getModel(item.itemType);
      const product = await Model.findById(item.itemId);
      
      if (!product) {
        return res.status(404).json({ 
          error: `Article introuvable: ${item.itemId}` 
        });
      }
      
      if (!product.isAvailable(item.quantity)) {
        return res.status(400).json({ 
          error: `Stock insuffisant pour ${product.name || product.nameFR}` 
        });
      }
      
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      
      processedItems.push({
        itemType: item.itemType,
        item: product._id,
        itemModel: item.itemType === 'card' ? 'Card' : 
                   item.itemType === 'deck' ? 'Deck' : 'Accessory',
        name: product.name || product.nameFR,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
        snapshot: product.toObject()
      });
    }
    
    // Calculer les frais de port
    let shippingCost = 0;
    if (subtotal < 50) {
      shippingCost = 4.99;
    } else if (subtotal < 100) {
      shippingCost = 2.99;
    }
    // Gratuit à partir de 100€
    
    // Appliquer le code promo (TODO: implémenter la validation)
    let discount = 0;
    let promoData = null;
    if (promoCode) {
      // TODO: Valider le code promo
      // Pour l'instant, on le stocke juste
      promoData = {
        code: promoCode,
        discountAmount: 0,
        discountType: 'fixed'
      };
    }
    
    // Calculer la TVA (20%)
    const taxBase = subtotal - discount + shippingCost;
    const tax = parseFloat((taxBase * 0.20).toFixed(2));
    const total = parseFloat((taxBase + tax).toFixed(2));
    
    // Créer la commande
    const orderData = {
      user: req.user ? req.user._id : undefined,
      isGuestOrder: !req.user,
      customerInfo,
      items: processedItems,
      shippingAddress,
      billingAddress,
      useSameAddress: useSameAddress !== false,
      pricing: {
        subtotal,
        shippingCost,
        discount,
        tax,
        total
      },
      promoCode: promoData,
      payment: {
        method: paymentMethod || 'stripe'
      },
      status: 'pending'
    };
    
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({
      message: 'Commande créée avec succès',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.pricing.total,
        itemCount: order.items.length,
        createdAt: order.createdAt
      },
      orderId: order._id,
      orderNumber: order.orderNumber
    });
    
  } catch (error) {
    console.error('Erreur create order:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/my-orders - Commandes de l'utilisateur connecté
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.item');
    
    const total = await Order.countDocuments({ user: req.user._id });
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur get my orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id - Détails d'une commande
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.item')
      .populate('user', 'email pseudo');
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    // Vérifier les permissions
    if (order.user && req.user) {
      if (order.user._id.toString() !== req.user._id.toString() && 
          !req.user.hasPermission('admin')) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }
    
    res.json({ order });
    
  } catch (error) {
    console.error('Erreur get order:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/number/:orderNumber - Suivi de commande par numéro
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const { email } = req.query;
    
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.item');
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    // Pour les commandes invités, vérifier l'email
    if (order.isGuestOrder && (!email || email !== order.customerInfo.email)) {
      return res.status(403).json({ 
        error: 'Email requis pour accéder à cette commande' 
      });
    }
    
    res.json({ order });
    
  } catch (error) {
    console.error('Erreur track order:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/cancel - Annuler une commande
router.put('/:id/cancel', optionalAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    // Vérifier les permissions
    if (order.user && req.user) {
      if (order.user.toString() !== req.user._id.toString() && 
          !req.user.hasPermission('admin')) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }
    
    await order.cancel(reason || 'Annulation client');
    
    // TODO: Restaurer le stock des produits
    
    res.json({
      message: 'Commande annulée avec succès',
      order
    });
    
  } catch (error) {
    console.error('Erreur cancel order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES ADMIN ====================

// GET /api/orders - Liste de toutes les commandes (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    
    if (req.query.status) filters.status = req.query.status;
    if (req.query.paymentStatus) filters['payment.status'] = req.query.paymentStatus;
    
    if (req.query.search) {
      filters.$or = [
        { orderNumber: new RegExp(req.query.search, 'i') },
        { 'customerInfo.email': new RegExp(req.query.search, 'i') },
        { 'customerInfo.firstName': new RegExp(req.query.search, 'i') },
        { 'customerInfo.lastName': new RegExp(req.query.search, 'i') }
      ];
    }
    
    if (req.query.startDate || req.query.endDate) {
      filters.createdAt = {};
      if (req.query.startDate) filters.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filters.createdAt.$lte = new Date(req.query.endDate);
    }
    
    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'email pseudo')
      .populate('items.item');
    
    const total = await Order.countDocuments(filters);
    
    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur list orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/status - Mettre à jour le statut (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    order.status = status;
    
    if (note) {
      order.statusHistory.push({
        status,
        date: new Date(),
        note,
        updatedBy: req.user._id
      });
    }
    
    await order.save();
    
    res.json({
      message: 'Statut mis à jour',
      order
    });
    
  } catch (error) {
    console.error('Erreur update status:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/shipping - Ajouter les infos de livraison (admin)
router.put('/:id/shipping', authenticate, requireAdmin, async (req, res) => {
  try {
    const { carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    await order.markAsShipped({
      carrier,
      trackingNumber,
      trackingUrl,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined
    });
    
    res.json({
      message: 'Informations de livraison ajoutées',
      order
    });
    
  } catch (error) {
    console.error('Erreur add shipping info:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/delivered - Marquer comme livrée (admin)
router.put('/:id/delivered', authenticate, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    order.status = 'delivered';
    order.shipping.deliveredAt = new Date();
    
    await order.save();
    
    // TODO: Envoyer email de confirmation de livraison
    
    res.json({
      message: 'Commande marquée comme livrée',
      order
    });
    
  } catch (error) {
    console.error('Erreur mark delivered:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/notes - Ajouter des notes internes (admin)
router.put('/:id/notes', authenticate, requireAdmin, async (req, res) => {
  try {
    const { internalNotes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { internalNotes },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    res.json({
      message: 'Notes mises à jour',
      order
    });
    
  } catch (error) {
    console.error('Erreur update notes:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/stats/dashboard - Statistiques du dashboard (admin)
router.get('/stats/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Commandes du jour
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Commandes du mois
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    // Chiffre d'affaires du mois
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ]);
    
    // Commandes en attente
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'processing'] }
    });
    
    // Commandes par statut
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Produits les plus vendus
    const topProducts = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      todayOrders,
      monthOrders,
      monthRevenue: monthRevenue[0]?.total || 0,
      pendingOrders,
      ordersByStatus,
      topProducts
    });
    
  } catch (error) {
    console.error('Erreur get dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/orders/:id - Supprimer une commande (admin, seulement si annulée)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    
    if (order.status !== 'cancelled') {
      return res.status(400).json({ 
        error: 'Seules les commandes annulées peuvent être supprimées' 
      });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Commande supprimée' });
    
  } catch (error) {
    console.error('Erreur delete order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
