'use strict';

const { verifyAccessToken } = require('../services/token');
const prisma = require('../lib/prisma');

// ─── HIÉRARCHIE DES RÔLES ────────────────────────────────────────────────────

const ROLE_LEVEL = {
  USER:          1,
  PROFESSOR:     2,
  EDITOR:        3,
  STOCK_MANAGER: 3,
  ADMIN:         4,
  SUPER_ADMIN:   5,
};

function isAdmin(role) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

// ─── authenticate ─────────────────────────────────────────────────────────────
// Vérifie le JWT Bearer, charge req.user (rôle frais, isActive garanti)

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const payload = verifyAccessToken(header.slice(7));

    const user = await prisma.user.findUnique({
      where:   { id: payload.userId },
      include: { professorProfile: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Compte inactif ou introuvable' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// ─── optionalAuth ─────────────────────────────────────────────────────────────

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  try {
    const payload = verifyAccessToken(header.slice(7));
    const user = await prisma.user.findUnique({
      where:   { id: payload.userId },
      include: { professorProfile: true },
    });
    if (user?.isActive) req.user = user;
  } catch (_) { /* ignoré */ }

  next();
}

// ─── requireRole ─────────────────────────────────────────────────────────────
// Autorise les rôles listés + ADMIN/SUPER_ADMIN toujours

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
    if (isAdmin(req.user.role)) return next();
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'Accès refusé — rôle insuffisant' });
  };
}

// ─── Raccourcis rôles ────────────────────────────────────────────────────────

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  if (isAdmin(req.user.role)) return next();
  return res.status(403).json({ error: 'Accès administrateur requis' });
}

function requireEditor(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  if (isAdmin(req.user.role)) return next();
  if (req.user.role === 'EDITOR') return next();
  return res.status(403).json({ error: 'Accès éditeur requis' });
}

function requireStockManager(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  if (isAdmin(req.user.role)) return next();
  if (req.user.role === 'STOCK_MANAGER' || req.user.role === 'EDITOR') return next();
  return res.status(403).json({ error: 'Accès gestionnaire de stock requis' });
}

// ─── requireVerifiedProfessor ─────────────────────────────────────────────────
// Professeur validé par l'Académie (professorProfile.isVerified = true)

function requireVerifiedProfessor(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  if (isAdmin(req.user.role)) return next();
  if (req.user.role !== 'PROFESSOR') {
    return res.status(403).json({ error: 'Réservé aux professeurs' });
  }
  if (!req.user.professorProfile?.isVerified) {
    return res.status(403).json({ error: 'Compte professeur non encore validé par l\'Académie' });
  }
  next();
}

// ─── requireVerifiedEmail ────────────────────────────────────────────────────

function requireVerifiedEmail(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  if (req.user.isVerified) return next();
  return res.status(403).json({
    error: 'Vérifiez votre email avant de continuer',
    code:  'EMAIL_NOT_VERIFIED',
  });
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireEditor,
  requireStockManager,
  requireVerifiedProfessor,
  requireVerifiedEmail,
  ROLE_LEVEL,
};
