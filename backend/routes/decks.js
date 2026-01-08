const express = require('express');
const router = express.Router();
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');

// ==================== ROUTES PUBLIQUES ====================

// GET /api/decks - Liste de tous les decks avec filtres
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const filters = {};
    
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }
    if (req.query.category) filters.category = req.query.category;
    if (req.query.format) filters.format = req.query.format;
    if (req.query.archetype) filters.archetype = new RegExp(req.query.archetype, 'i');
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    if (req.query.strategy) filters.strategy = req.query.strategy;
    if (req.query.availability) filters.availability = req.query.availability;
    
    if (req.query.official === 'true') {
      filters.isOfficial = true;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'price-asc') sort = { price: 1 };
    else if (req.query.sortBy === 'price-desc') sort = { price: -1 };
    else if (req.query.sortBy === 'popularity') sort = { viewCount: -1 };
    else if (req.query.sortBy === 'rating') sort = { 'rating.average': -1 };
    else if (req.query.sortBy === 'newest') sort = { createdAt: -1 };
    else if (req.query.sortBy === 'name') sort = { name: 1 };
    
    const decks = await Deck.find(filters)
      .populate('cards.card', 'nameFR nameEN images price')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Deck.countDocuments(filters);
    
    res.json({
      decks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur get decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/featured/list - Decks mis en avant
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const decks = await Deck.find({ isOfficial: true })
      .sort({ purchaseCount: -1, 'rating.average': -1 })
      .limit(limit)
      .populate('cards.card', 'nameFR images');
    
    res.json({ decks });
    
  } catch (error) {
    console.error('Erreur get featured decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/popular/list - Decks populaires
router.get('/popular/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const decks = await Deck.find({ isPublic: true })
      .sort({ viewCount: -1, favoriteCount: -1 })
      .limit(limit);
    
    res.json({ decks });
    
  } catch (error) {
    console.error('Erreur get popular decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/competitive/list - Decks compétitifs
router.get('/competitive/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const decks = await Deck.find({ 
      category: 'competitive',
      isPublic: true
    })
      .sort({ 'rating.average': -1, winRate: -1 })
      .limit(limit);
    
    res.json({ decks });
    
  } catch (error) {
    console.error('Erreur get competitive decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/budget/list - Decks budget
router.get('/budget/list', async (req, res) => {
  try {
    const maxPrice = parseFloat(req.query.maxPrice) || 50;
    const limit = parseInt(req.query.limit) || 10;
    
    const decks = await Deck.find({ 
      category: 'budget',
      price: { $lte: maxPrice },
      isPublic: true
    })
      .sort({ price: 1, 'rating.average': -1 })
      .limit(limit);
    
    res.json({ decks });
    
  } catch (error) {
    console.error('Erreur get budget decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/slug/:slug - Obtenir un deck par son slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const filters = { slug: req.params.slug };
    
    // Si pas connecté, afficher uniquement les decks publics
    if (!req.user) {
      filters.isPublic = true;
    } else {
      // Si connecté, afficher aussi ses propres decks privés
      filters.$or = [
        { isPublic: true },
        { createdBy: req.user._id }
      ];
    }
    
    const deck = await Deck.findOne(filters)
      .populate('cards.card')
      .populate('createdBy', 'pseudo avatar')
      .populate('recommendedAccessories');
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    // Incrémenter le compteur de vues
    deck.viewCount += 1;
    await deck.save();
    
    res.json({ deck });
    
  } catch (error) {
    console.error('Erreur get deck by slug:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/:id - Obtenir un deck par ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const filters = { _id: req.params.id };
    
    if (!req.user) {
      filters.isPublic = true;
    } else {
      filters.$or = [
        { isPublic: true },
        { createdBy: req.user._id }
      ];
    }
    
    const deck = await Deck.findOne(filters)
      .populate('cards.card')
      .populate('createdBy', 'pseudo avatar')
      .populate('recommendedAccessories');
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    deck.viewCount += 1;
    await deck.save();
    
    res.json({ deck });
    
  } catch (error) {
    console.error('Erreur get deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/:id/availability - Vérifier la disponibilité complète
router.get('/:id/availability', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    const availability = await deck.checkAvailability();
    
    res.json({
      deckId: deck._id,
      deckName: deck.name,
      fullyAvailable: availability.fullyAvailable,
      cards: availability.unavailableCards.length > 0 
        ? availability.unavailableCards 
        : deck.cards
    });
    
  } catch (error) {
    console.error('Erreur check availability:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/decks/:id/export - Exporter la liste de cartes (format Limitless)
router.get('/:id/export', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    const list = await deck.getFormattedList();
    
    res.json({
      deckName: deck.name,
      format: deck.format,
      totalCards: deck.getTotalCards(),
      list
    });
    
  } catch (error) {
    console.error('Erreur export deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/decks/:id/rate - Noter un deck
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Note invalide (1-5)' });
    }
    
    const deck = await Deck.findById(req.params.id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    // Recalculer la moyenne
    const totalRatings = deck.rating.count;
    const currentTotal = deck.rating.average * totalRatings;
    const newTotal = currentTotal + rating;
    
    deck.rating.count += 1;
    deck.rating.average = newTotal / deck.rating.count;
    
    await deck.save();
    
    res.json({
      message: 'Note enregistrée',
      rating: deck.rating
    });
    
  } catch (error) {
    console.error('Erreur rate deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES UTILISATEUR ====================

// POST /api/decks/custom - Créer un deck personnalisé
router.post('/custom', authenticate, async (req, res) => {
  try {
    const deckData = {
      ...req.body,
      createdBy: req.user._id,
      isOfficial: false
    };
    
    const deck = new Deck(deckData);
    await deck.save();
    
    res.status(201).json({
      message: 'Deck personnalisé créé avec succès',
      deck
    });
    
  } catch (error) {
    console.error('Erreur create custom deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/decks/custom/:id - Modifier un deck personnalisé
router.put('/custom/:id', authenticate, async (req, res) => {
  try {
    const deck = await Deck.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable ou non autorisé' });
    }
    
    Object.assign(deck, req.body);
    await deck.save();
    
    res.json({
      message: 'Deck mis à jour',
      deck
    });
    
  } catch (error) {
    console.error('Erreur update custom deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/decks/custom/:id - Supprimer un deck personnalisé
router.delete('/custom/:id', authenticate, async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable ou non autorisé' });
    }
    
    res.json({ message: 'Deck supprimé' });
    
  } catch (error) {
    console.error('Erreur delete custom deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES ÉDITEUR/ADMIN ====================

// POST /api/decks - Créer un deck officiel
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const deckData = {
      ...req.body,
      isOfficial: true,
      createdBy: req.user._id
    };
    
    const deck = new Deck(deckData);
    await deck.save();
    
    res.status(201).json({
      message: 'Deck officiel créé avec succès',
      deck
    });
    
  } catch (error) {
    console.error('Erreur create deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/decks/:id - Mettre à jour un deck
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const deck = await Deck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    res.json({
      message: 'Deck mis à jour',
      deck
    });
    
  } catch (error) {
    console.error('Erreur update deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/decks/:id/stock - Mettre à jour le stock
router.put('/:id/stock', authenticate, requireEditor, async (req, res) => {
  try {
    const { stock } = req.body;
    
    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    deck.stock = stock;
    
    if (stock === 0) deck.availability = 'out-of-stock';
    else if (stock <= 5) deck.availability = 'low-stock';
    else deck.availability = 'available';
    
    await deck.save();
    
    res.json({
      message: 'Stock mis à jour',
      deck
    });
    
  } catch (error) {
    console.error('Erreur update stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/decks/:id/price - Mettre à jour le prix
router.put('/:id/price', authenticate, requireEditor, async (req, res) => {
  try {
    const { price } = req.body;
    
    const deck = await Deck.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    );
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    res.json({
      message: 'Prix mis à jour',
      deck
    });
    
  } catch (error) {
    console.error('Erreur update price:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/decks/:id - Supprimer un deck
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck introuvable' });
    }
    
    res.json({ message: 'Deck supprimé' });
    
  } catch (error) {
    console.error('Erreur delete deck:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
