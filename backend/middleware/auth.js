const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur introuvable ou inactif.' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

// Middleware d'authentification optionnelle (pour routes publiques avec bonus si connecté)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignorer les erreurs, l'auth est optionnelle
  }
  
  next();
};

// Middleware pour vérifier le rôle
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }
    
    if (!req.user.hasPermission(role)) {
      return res.status(403).json({ error: 'Permissions insuffisantes.' });
    }
    
    next();
  };
};

// Raccourcis pour les rôles courants
const requireEditor = requireRole('editor');
const requireAdmin = requireRole('admin');
const requireSuperAdmin = requireRole('super-admin');

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireEditor,
  requireAdmin,
  requireSuperAdmin
};
