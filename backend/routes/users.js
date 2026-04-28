'use strict';

const express = require('express');
const prisma   = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const LEVEL_MAP  = { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé', EXPERT: 'Expert' };
const STATUS_MAP = { PUBLISHED: 'Publié', DRAFT: 'Brouillon', CANCELLED: 'En attente' };

// ─── GET /api/users/me/dashboard ─────────────────────────────────────────────

router.get('/me/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, ordersCount, contentAccess, recentOrders] = await Promise.all([
      prisma.user.findUnique({
        where:   { id: userId },
        include: { professorProfile: true, preferences: true },
      }),
      prisma.order.count({ where: { userId } }),
      prisma.userContentAccess.count({ where: { userId } }),
      prisma.order.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
        take:    5,
        include: { items: { include: { product: { select: { name: true, type: true } } } } },
      }),
    ]);

    const { passwordHash, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;

    res.json({
      user:  safeUser,
      stats: { formationsCount: contentAccess, ordersCount },
      recentOrders: recentOrders.map(o => ({
        id:     o.id,
        status: o.status,
        total:  parseFloat(o.total),
        date:   o.createdAt,
        items:  o.items.map(i => ({ name: i.product?.name ?? 'Produit', type: i.product?.type ?? '' })),
      })),
    });
  } catch (err) {
    console.error('users/me/dashboard:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── GET /api/users/me/orders ─────────────────────────────────────────────────

router.get('/me/orders', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where:   { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: { select: { name: true } } } } },
    });
    res.json(orders.map(o => ({
      id:     o.id,
      status: o.status,
      total:  parseFloat(o.total),
      date:   o.createdAt,
      items:  o.items.map(i => i.product?.name ?? 'Produit'),
    })));
  } catch (err) {
    console.error('users/me/orders:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── GET /api/users/me/professor-dashboard ────────────────────────────────────

router.get('/me/professor-dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, courses, replaysCount, guidesCount] = await Promise.all([
      prisma.user.findUnique({
        where:   { id: userId },
        include: { professorProfile: true },
      }),
      prisma.course.findMany({
        where:   { professorId: userId },
        orderBy: { createdAt: 'desc' },
        take:    10,
        select:  { id: true, title: true, description: true, level: true, status: true, createdAt: true, price: true, ratingAvg: true },
      }),
      prisma.replay.count({ where: { professorId: userId } }),
      prisma.guide.count({  where: { professorId: userId } }),
    ]);

    const { passwordHash, verificationToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;

    res.json({
      user:  safeUser,
      stats: {
        totalContents:  courses.length + replaysCount + guidesCount,
        replaysCount,
        guidesCount,
        ratingAvg:      parseFloat(safeUser.professorProfile?.ratingAvg ?? 0),
        totalSessions:  safeUser.professorProfile?.totalSessions ?? 0,
        isVerified:     safeUser.professorProfile?.isVerified ?? false,
      },
      recentContents: courses.map(c => ({
        id:     c.id,
        title:  c.title,
        type:   'Cours',
        statut: STATUS_MAP[c.status] ?? c.status,
        level:  LEVEL_MAP[c.level]  ?? c.level,
        date:   c.createdAt,
        rating: parseFloat(c.ratingAvg ?? 0),
        ventes: null,
      })),
    });
  } catch (err) {
    console.error('users/me/professor-dashboard:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
