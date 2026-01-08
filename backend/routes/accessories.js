const express = require('express');
const router = express.Router();
const Accessory = require('../models/Accessory');
const { authenticate, requireEditor, optionalAuth } = require('../middleware/auth');

// ==================== ROUTES PUBLIQUES ====================

// GET /api/accessories - Liste de tous les accessoires avec filtres
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }
    if (req.query.category) filters.category = req.query.category;
    if (req.query.subCategory) filters.subCategory = req.query.subCategory;
    if (req.query.availability) filters.availability = req.query.availability;
    if (req.query.customizable === 'true') filters.isCustomizable = true;
    if (req.query.recommended === 'true') filters.isRecommended = true;
    if (req.query.new === 'true') filters.isNew = true;
    if (req.query.featured === 'true') filters.isFeatured = true;
    
    if (req.query.brand) filters['specifications.brand'] = req.query.brand;
    if (req.query.color) filters['specifications.color'] = req.query.color;
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'price-asc') sort = { price: 1 };
    else if (req.query.sortBy === 'price-desc') sort = { price: -1 };
    else if (req.query.sortBy === 'popularity') sort = { salesCount: -1 };
    else if (req.query.sortBy === 'rating') sort = { 'rating.average': -1 };
    else if (req.query.sortBy === 'newest') sort = { createdAt: -1 };
    else if (req.query.sortBy === 'name') sort = { name: 1 };
    
    const accessories = await Accessory.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Accessory.countDocuments(filters);
    
    res.json({
      accessories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur get accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/categories/list - Liste des catégories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Accessory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          subCategories: { $addToSet: '$subCategory' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ categories });
    
  } catch (error) {
    console.error('Erreur get categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/featured/list - Accessoires mis en avant
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const accessories = await Accessory.find({ isFeatured: true })
      .sort({ salesCount: -1 })
      .limit(limit);
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get featured accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/recommended/list - Accessoires recommandés
router.get('/recommended/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const accessories = await Accessory.find({ isRecommended: true })
      .sort({ 'rating.average': -1 })
      .limit(limit);
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get recommended accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/new/list - Nouveaux accessoires
router.get('/new/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const accessories = await Accessory.find({ isNew: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get new accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/popular/list - Accessoires populaires
router.get('/popular/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const accessories = await Accessory.find()
      .sort({ salesCount: -1, viewCount: -1 })
      .limit(limit);
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get popular accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/customizable/list - Accessoires personnalisables
router.get('/customizable/list', async (req, res) => {
  try {
    const accessories = await Accessory.find({ isCustomizable: true })
      .sort({ category: 1, name: 1 });
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get customizable accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/category/:category - Accessoires par catégorie
router.get('/category/:category', async (req, res) => {
  try {
    const accessories = await Accessory.find({ category: req.params.category })
      .sort({ subCategory: 1, name: 1 });
    
    res.json({ accessories });
    
  } catch (error) {
    console.error('Erreur get accessories by category:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/slug/:slug - Obtenir un accessoire par slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const accessory = await Accessory.findOne({ slug: req.params.slug })
      .populate('relatedProducts')
      .populate('compatibleDecks');
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    // Incrémenter le compteur de vues
    accessory.viewCount += 1;
    await accessory.save();
    
    res.json({ accessory });
    
  } catch (error) {
    console.error('Erreur get accessory by slug:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/:id - Détails d'un accessoire
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
      .populate('relatedProducts')
      .populate('compatibleDecks');
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    accessory.viewCount += 1;
    await accessory.save();
    
    res.json({ accessory });
    
  } catch (error) {
    console.error('Erreur get accessory:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/accessories/:id/related - Produits similaires
router.get('/:id/related', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id);
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    // Trouver des produits similaires (même catégorie)
    const related = await Accessory.find({
      _id: { $ne: accessory._id },
      category: accessory.category
    })
      .limit(6)
      .sort({ salesCount: -1 });
    
    res.json({ related });
    
  } catch (error) {
    console.error('Erreur get related accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/accessories/:id/rate - Noter un accessoire
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Note invalide (1-5)' });
    }
    
    const accessory = await Accessory.findById(req.params.id);
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    // Recalculer la moyenne
    const totalRatings = accessory.rating.count;
    const currentTotal = accessory.rating.average * totalRatings;
    const newTotal = currentTotal + rating;
    
    accessory.rating.count += 1;
    accessory.rating.average = newTotal / accessory.rating.count;
    
    await accessory.save();
    
    res.json({
      message: 'Note enregistrée',
      rating: accessory.rating
    });
    
  } catch (error) {
    console.error('Erreur rate accessory:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROUTES ÉDITEUR/ADMIN ====================

// POST /api/accessories - Créer un accessoire
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const accessory = new Accessory(req.body);
    await accessory.save();
    
    res.status(201).json({
      message: 'Accessoire créé avec succès',
      accessory
    });
    
  } catch (error) {
    console.error('Erreur create accessory:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/accessories/batch/create - Créer plusieurs accessoires
router.post('/batch/create', authenticate, requireEditor, async (req, res) => {
  try {
    const { accessories } = req.body;
    
    if (!accessories || !Array.isArray(accessories)) {
      return res.status(400).json({ error: 'Liste d\'accessoires requise' });
    }
    
    const createdAccessories = await Accessory.insertMany(accessories);
    
    res.status(201).json({
      message: `${createdAccessories.length} accessoires créés avec succès`,
      accessories: createdAccessories
    });
    
  } catch (error) {
    console.error('Erreur batch create accessories:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/accessories/:id - Mettre à jour un accessoire
router.put('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    res.json({
      message: 'Accessoire mis à jour',
      accessory
    });
    
  } catch (error) {
    console.error('Erreur update accessory:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/accessories/:id/stock - Mettre à jour le stock
router.put('/:id/stock', authenticate, requireEditor, async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    
    const accessory = await Accessory.findById(req.params.id);
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    await accessory.updateStock(quantity, operation || 'set');
    
    res.json({
      message: 'Stock mis à jour',
      accessory
    });
    
  } catch (error) {
    console.error('Erreur update stock:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/accessories/:id/price - Mettre à jour le prix
router.put('/:id/price', authenticate, requireEditor, async (req, res) => {
  try {
    const { price } = req.body;
    
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    );
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    res.json({
      message: 'Prix mis à jour',
      accessory
    });
    
  } catch (error) {
    console.error('Erreur update price:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/accessories/:id/featured - Mettre en avant
router.put('/:id/featured', authenticate, requireEditor, async (req, res) => {
  try {
    const { isFeatured } = req.body;
    
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true }
    );
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    res.json({
      message: `Accessoire ${isFeatured ? 'mis en avant' : 'retiré de la mise en avant'}`,
      accessory
    });
    
  } catch (error) {
    console.error('Erreur toggle featured:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/accessories/:id - Supprimer un accessoire
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndDelete(req.params.id);
    
    if (!accessory) {
      return res.status(404).json({ error: 'Accessoire introuvable' });
    }
    
    res.json({ message: 'Accessoire supprimé' });
    
  } catch (error) {
    console.error('Erreur delete accessory:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
