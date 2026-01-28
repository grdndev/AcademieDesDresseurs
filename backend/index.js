require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Import routes
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const decksRoutes = require('./routes/decks');
const accessoriesRoutes = require('./routes/accessories');
const ordersRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (à configurer selon vos besoins)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/decks', decksRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (dbError) {
    console.error('⚠️ Database connection failed:', dbError.message);
    console.log('🚀 Starting server in standalone mode (some features will be unavailable)...');
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
