'use strict';

require('dotenv').config();

const express  = require('express');
const prisma   = require('./lib/prisma');

const { securityHeaders, sanitizeResponses } = require('./middleware/security');
const { sanitizeInputs, enforceLengths }     = require('./middleware/sanitize');
const { apiLimiter }                         = require('./middleware/rateLimiter');
const { logger }                             = require('./services/logger');

const authRoutes     = require('./routes/auth');
const gdprRoutes     = require('./routes/gdpr');
const productsRoutes = require('./routes/products');
const coursesRoutes  = require('./routes/courses');
const usersRoutes    = require('./routes/users');
const adminRoutes    = require('./routes/admin');

const app = express();

// ─── PROXY (OVH / Nginx) ─────────────────────────────────────────────────────

if (String(process.env.TRUST_PROXY).toLowerCase() === 'true') {
  app.set('trust proxy', 1);
}

// ─── SÉCURITÉ GLOBALE ─────────────────────────────────────────────────────────

app.use(securityHeaders);    // helmet (CSP, HSTS, X-Frame-Options, etc.)
app.use(sanitizeResponses);  // filtre les champs sensibles de toutes les réponses JSON
app.use(apiLimiter);         // rate limit global (200 req/min par IP)

// ─── BODY PARSING ─────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') return next();
  express.json({ limit: '1mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── SANITISATION DES INPUTS ─────────────────────────────────────────────────

app.use(enforceLengths);   // refuse les payloads avec champs trop longs
app.use(sanitizeInputs);   // strip HTML de tous les body/query

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin   = req.headers.origin;
  const allowAll = allowedOrigins.includes('*');

  if (allowAll) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin');
  } else if (origin && !allowAll) {
    logger.warn({ message: 'CORS blocked', origin, path: req.originalUrl });
    return res.status(403).json({ error: 'Origin non autorisée' });
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.use('/api/auth',     authRoutes);
app.use('/api/gdpr',     gdprRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/courses',  coursesRoutes);
app.use('/api/users',    usersRoutes);
app.use('/api/admin',    adminRoutes);

// ─── HEALTH ───────────────────────────────────────────────────────────────────

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', db: 'connected', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'ERROR', db: 'disconnected', timestamp: new Date() });
  }
});

// ─── 404 / ERREUR ─────────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  logger.error({ message: 'Unhandled error', error: err.message, stack: err.stack, path: req.originalUrl });
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

// ─── START ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connecté');
  } catch (err) {
    logger.error(`⚠️ Connexion DB échouée : ${err.message}`);
  }
  logger.info(`🚀 Serveur démarré sur le port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
});
