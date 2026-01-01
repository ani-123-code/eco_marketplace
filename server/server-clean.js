require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const initializeAdmin = require('./middlewares/admin');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const industryRoutes = require('./routes/industryRoutes');
const materialRoutes = require('./routes/materialRoutes');
const buyerRequestRoutes = require('./routes/buyerRequestRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000',
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

connectDB();

initializeAdmin();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/buyer-requests', buyerRequestRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Eco Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Eco Marketplace API - B2B PCR Materials Platform',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      industries: '/api/industries',
      materials: '/api/materials',
      buyerRequests: '/api/buyer-requests',
      analytics: '/api/analytics'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);

  res.status(err.status || 500).json({
    message: 'Server error',
    error: isDevelopment ? err.message : 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Eco Marketplace Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
});
