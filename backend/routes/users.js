const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ==================== AUTHENTIFICATION ====================

// POST /api/users/register - Créer un compte
router.post('/register', async (req, res) => {
  try {
    const { email, password, pseudo, firstName, lastName } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [{ email }, { pseudo }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? 'Cet email est déjà utilisé' 
          : 'Ce pseudo est déjà utilisé' 
      });
    }
    
    // Créer le nouvel utilisateur
    const user = new User({
      email,
      password,
      pseudo,
      firstName,
      lastName
    });
    
    await user.save();
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: user.toPublicProfile(),
      token
    });
    
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/login - Se connecter
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(403).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
    }
    
    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Connexion réussie',
      user: user.toPublicProfile(),
      token
    });
    
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/logout - Se déconnecter
router.post('/logout', authenticate, async (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

// ==================== PROFIL ====================

// GET /api/users/me - Obtenir son profil
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDecks.deck')
      .populate('wishlist.cards.card')
      .populate('wishlist.decks.deck')
      .populate('wishlist.accessories.accessory')
      .select('-password');
    
    res.json({ user });
    
  } catch (error) {
    console.error('Erreur get profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/me - Mettre à jour son profil
router.put('/me', authenticate, async (req, res) => {
  try {
    const allowedUpdates = ['pseudo', 'firstName', 'lastName', 'phone', 'address', 'avatar'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ 
      message: 'Profil mis à jour avec succès',
      user 
    });
    
  } catch (error) {
    console.error('Erreur update profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/me/password - Changer son mot de passe
router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mots de passe requis' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
    
    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Mot de passe modifié avec succès' });
    
  } catch (error) {
    console.error('Erreur change password:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/me/preferences - Mettre à jour ses préférences
router.put('/me/preferences', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (req.body.language) user.preferences.language = req.body.language;
    if (req.body.favoriteFormat) user.preferences.favoriteFormat = req.body.favoriteFormat;
    if (req.body.budget) user.preferences.budget = req.body.budget;
    if (req.body.playStyle) user.preferences.playStyle = req.body.playStyle;
    if (req.body.notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...req.body.notifications
      };
    }
    
    await user.save();
    
    res.json({ 
      message: 'Préférences mises à jour',
      preferences: user.preferences 
    });
    
  } catch (error) {
    console.error('Erreur update preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== DECKS SAUVEGARDÉS ====================

// GET /api/users/me/decks - Obtenir ses decks sauvegardés
router.get('/me/decks', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedDecks.deck',
        populate: { path: 'cards.card' }
      });
    
    res.json({ savedDecks: user.savedDecks });
    
  } catch (error) {
    console.error('Erreur get saved decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/me/decks - Sauvegarder un deck
router.post('/me/decks', authenticate, async (req, res) => {
  try {
    const { deckId, name, isCustom } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Vérifier si déjà sauvegardé
    const alreadySaved = user.savedDecks.some(
      saved => saved.deck.toString() === deckId
    );
    
    if (alreadySaved) {
      return res.status(400).json({ error: 'Deck déjà sauvegardé' });
    }
    
    user.savedDecks.push({
      deck: deckId,
      name: name || 'Mon Deck',
      isCustom: isCustom || false
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Deck sauvegardé',
      savedDecks: user.savedDecks 
    });
    
  } catch (error) {
    console.error('Erreur save deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/me/decks/:deckId - Supprimer un deck sauvegardé
router.delete('/me/decks/:deckId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.savedDecks = user.savedDecks.filter(
      saved => saved.deck.toString() !== req.params.deckId
    );
    
    await user.save();
    
    res.json({ message: 'Deck retiré des favoris' });
    
  } catch (error) {
    console.error('Erreur remove saved deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== WISHLIST ====================

// GET /api/users/me/wishlist - Obtenir sa wishlist
router.get('/me/wishlist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist.cards.card')
      .populate('wishlist.decks.deck')
      .populate('wishlist.accessories.accessory');
    
    res.json({ wishlist: user.wishlist });
    
  } catch (error) {
    console.error('Erreur get wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/me/wishlist/:type - Ajouter à la wishlist
router.post('/me/wishlist/:type', authenticate, async (req, res) => {
  try {
    const { type } = req.params; // cards, decks, accessories
    const { itemId, notifyOnRestock } = req.body;
    
    if (!['cards', 'decks', 'accessories'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }
    
    const user = await User.findById(req.user._id);
    const wishlistType = user.wishlist[type];
    
    // Vérifier si déjà dans la wishlist
    const fieldName = type === 'accessories' ? 'accessory' : type.slice(0, -1); // cards->card, decks->deck
    const alreadyInWishlist = wishlistType.some(
      item => item[fieldName].toString() === itemId
    );
    
    if (alreadyInWishlist) {
      return res.status(400).json({ error: 'Déjà dans la wishlist' });
    }
    
    // Ajouter à la wishlist
    const newItem = { [fieldName]: itemId };
    if (type === 'cards' && notifyOnRestock !== undefined) {
      newItem.notifyOnRestock = notifyOnRestock;
    }
    
    wishlistType.push(newItem);
    await user.save();
    
    res.status(201).json({ 
      message: 'Ajouté à la wishlist',
      wishlist: user.wishlist 
    });
    
  } catch (error) {
    console.error('Erreur add to wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/me/wishlist/:type/:itemId - Retirer de la wishlist
router.delete('/me/wishlist/:type/:itemId', authenticate, async (req, res) => {
  try {
    const { type, itemId } = req.params;
    
    if (!['cards', 'decks', 'accessories'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }
    
    const user = await User.findById(req.user._id);
    const fieldName = type === 'accessories' ? 'accessory' : type.slice(0, -1);
    
    user.wishlist[type] = user.wishlist[type].filter(
      item => item[fieldName].toString() !== itemId
    );
    
    await user.save();
    
    res.json({ message: 'Retiré de la wishlist' });
    
  } catch (error) {
    console.error('Erreur remove from wishlist:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== COMMANDES ====================

// GET /api/users/me/orders - Obtenir son historique de commandes
router.get('/me/orders', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const Order = require('../models/Order');
    
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
    console.error('Erreur get orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/me/stats - Obtenir ses statistiques
router.get('/me/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    res.json({ stats: user.stats });
    
  } catch (error) {
    console.error('Erreur get stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMINISTRATION ====================

// GET /api/users - Liste de tous les utilisateurs (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filters.$or = [
        { email: new RegExp(req.query.search, 'i') },
        { pseudo: new RegExp(req.query.search, 'i') },
        { firstName: new RegExp(req.query.search, 'i') },
        { lastName: new RegExp(req.query.search, 'i') }
      ];
    }
    
    const users = await User.find(filters)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filters);
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur list users:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id - Détails d'un utilisateur (admin)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('orders');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json({ user });
    
  } catch (error) {
    console.error('Erreur get user:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id/role - Modifier le rôle d'un utilisateur (admin)
router.put('/:id/role', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'editor', 'admin', 'super-admin'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json({ 
      message: 'Rôle modifié avec succès',
      user 
    });
    
  } catch (error) {
    console.error('Erreur change role:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id/status - Activer/désactiver un compte (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json({ 
      message: `Compte ${isActive ? 'activé' : 'désactivé'} avec succès`,
      user 
    });
    
  } catch (error) {
    console.error('Erreur change status:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
    
  } catch (error) {
    console.error('Erreur delete user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
