const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');

// ==================== ROUTES PUBLIQUES ====================

// GET /api/cards - Liste de toutes les cartes avec filtres
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const filters = {};

    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }
    if (req.query.type) filters.type = req.query.type;
    if (req.query.rarity) filters.rarity = req.query.rarity;
    if (req.query.setCode) filters.setCode = req.query.setCode.toUpperCase();
    if (req.query.pokemonType) filters.pokemonType = req.query.pokemonType;
    if (req.query.availability) filters.availability = req.query.availability;
    if (req.query.language) filters.language = req.query.language.toUpperCase();
    if (req.query.format) filters.format = req.query.format;

    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'price-asc') sort = { price: 1 };
    else if (req.query.sortBy === 'price-desc') sort = { price: -1 };
    else if (req.query.sortBy === 'popularity') sort = { popularity: -1 };
    else if (req.query.sortBy === 'newest') sort = { createdAt: -1 };
    else if (req.query.sortBy === 'name') sort = { nameFR: 1 };

    const cards = await Card.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    for (const card of cards) {
      await card.checkImage();
    }

    const total = await Card.countDocuments(filters);

    res.json({
      cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur get cards:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/search/advanced - Recherche avancée pour Deck-to-Stock Builder
router.get('/search/advanced', async (req, res) => {
  try {
    const { name, setCode, cardNumber, language } = req.query;

    const filters = {};

    if (name) {
      filters.$or = [
        { nameFR: new RegExp(name, 'i') },
        { nameEN: new RegExp(name, 'i') }
      ];
    }
    if (setCode) filters.setCode = setCode.toUpperCase();
    if (cardNumber) filters.cardNumber = cardNumber;
    if (language) filters.language = language.toUpperCase();

    const cards = await Card.find(filters).limit(50);

    res.json({
      cards,
      count: cards.length
    });

  } catch (error) {
    console.error('Erreur advanced search:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/sets/list - Liste de tous les sets
router.get('/sets/list', async (req, res) => {
  try {
    const sets = await Card.aggregate([
      {
        $group: {
          _id: '$setCode',
          setName: { $first: '$setName' },
          count: { $sum: 1 },
          releaseDate: { $first: '$releaseDate' }
        }
      },
      { $sort: { releaseDate: -1 } }
    ]);

    res.json({ sets });

  } catch (error) {
    console.error('Erreur get sets:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/popular/list - Cartes populaires
router.get('/popular/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const cards = await Card.find()
      .sort({ popularity: -1, viewCount: -1 })
      .limit(limit);

    res.json({ cards });

  } catch (error) {
    console.error('Erreur get popular cards:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/new/list - Nouvelles cartes
router.get('/new/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const cards = await Card.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ cards });

  } catch (error) {
    console.error('Erreur get new cards:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/:id - Détails d'une carte
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' });
    }

    // Incrémenter le compteur de vues
    card.viewCount += 1;
    await card.save();

    res.json({ card });

  } catch (error) {
    console.error('Erreur get card:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cards/set/:setCode - Toutes les cartes d'un set
router.get('/set/:setCode', async (req, res) => {
  try {
    const cards = await Card.find({ setCode: req.params.setCode.toUpperCase() })
      .sort({ cardNumber: 1 });

    res.json({ cards });

  } catch (error) {
    console.error('Erreur get set cards:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cards/batch-check - Vérifier disponibilité multiple (Deck-to-Stock Builder)
router.post('/batch-check', async (req, res) => {
  try {
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Liste de cartes requise' });
    }

    const results = [];
    let totalCost = 0;
    let totalFound = 0;
    let totalAvailable = 0;

    for (const item of cards) {
      const { name, setCode, cardNumber, quantity } = item;
      const filters = {};

      if (name != null) {
        filters.$or = [
          { nameFR: new RegExp(name, 'i') },
          { nameEN: new RegExp(name, 'i') }
        ];
      }
      if (setCode != null) filters.setCode = setCode.toUpperCase();
      if (cardNumber != null) filters.cardNumber = cardNumber;

      const card = await Card.findOne(filters);

      if (!card) {
        results.push({
          name,
          setCode,
          cardNumber,
          found: false,
          requested: quantity,
          available: false,
          message: 'Carte introuvable'
        });
        continue;
      }

      totalFound++;
      const isAvailable = card.isAvailable(quantity);
      const adjustedQuantity = Math.min(quantity, card.stock);

      if (isAvailable) {
        totalAvailable++;
        totalCost += card.price * adjustedQuantity;
      }

      results.push({
        setCode,
        cardNumber,
        found: true,
        card,
        requested: quantity,
        available: isAvailable,
        adjustedQuantity,
        stock: card.stock,
        price: card.price,
        subtotal: card.price * adjustedQuantity,
        message: isAvailable
          ? 'Disponible'
          : `Stock insuffisant (${card.stock} disponible${card.stock > 1 ? 's' : ''})`
      });
    }

    res.json({
      results,
      summary: {
        totalRequested: cards.length,
        totalFound,
        totalAvailable,
        totalCost: parseFloat(totalCost.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Erreur batch check:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES ÉDITEUR/ADMIN ====================

// POST /api/cards - Créer une carte
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const card = new Card(req.body);
    await card.save();

    await card.checkImage();

    res.status(201).json({
      message: 'Carte créée avec succès',
      card
    });

  } catch (error) {
    console.error('Erreur create card:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cards/batch/create - Créer plusieurs cartes
router.post('/batch/create', authenticate, requireEditor, async (req, res) => {
  try {
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Liste de cartes requise' });
    }

    const createdCards = await Card.insertMany(cards);

    for (const card of createdCards) {
      await card.checkImage();
    }

    res.status(201).json({
      message: `${createdCards.length} cartes créées avec succès`,
      cards: createdCards
    });

  } catch (error) {
    console.error('Erreur batch create:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cards/:id - Mettre à jour une carte
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' });
    }

    res.json({
      message: 'Carte mise à jour avec succès',
      card
    });

  } catch (error) {
    console.error('Erreur update card:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cards/:id/stock - Mettre à jour le stock
router.put('/:id/stock', authenticate, requireEditor, async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' });
    }

    await card.updateStock(quantity, operation || 'set');

    res.json({
      message: 'Stock mis à jour',
      card
    });

  } catch (error) {
    console.error('Erreur update stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cards/:id/price - Mettre à jour le prix
router.put('/:id/price', authenticate, requireEditor, async (req, res) => {
  try {
    const { price } = req.body;

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' });
    }

    res.json({
      message: 'Prix mis à jour',
      card
    });

  } catch (error) {
    console.error('Erreur update price:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cards/:id - Supprimer une carte
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Carte introuvable' });
    }

    res.json({ message: 'Carte supprimée avec succès' });

  } catch (error) {
    console.error('Erreur delete card:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
