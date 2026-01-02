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
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const sellerRequestRoutes = require('./routes/sellerRequestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

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
      process.env.FRONTEND_URL,
      process.env.RAILWAY_PUBLIC_DOMAIN,
      process.env.VERCEL_URL
    ].filter(Boolean);

    // In production, allow Railway domain and custom domain
    if (process.env.NODE_ENV === 'production') {
      // Allow requests from same origin (when frontend and backend are on same domain)
      if (!origin || allowedOrigins.some(allowed => origin.includes(allowed))) {
        return callback(null, true);
      }
    } else {
      // In development, allow all origins
      callback(null, true);
      return;
    }

    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Type', 'Content-Length'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

connectDB();

initializeAdmin();

// Set response headers to prevent CORB issues and configure CSP
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Set CSP header only for HTML pages (not API routes)
  if (!req.path.startsWith('/api/') && req.accepts('text/html')) {
    // Production: Strict CSP (Vite bundles don't use eval)
    // Development: More permissive for HMR
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      // Strict CSP for production - Vite bundles don't need eval
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https: blob:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https:; " +
        "frame-ancestors 'self';"
      );
    } else {
      // More permissive for development (HMR needs eval)
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https: blob:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https: ws: wss:; " +
        "frame-ancestors 'self';"
      );
    }
  } else {
    // For API routes, set JSON content type
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  next();
});

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
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(['/api/seller-requests', '/seller-requests'], sellerRequestRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Eco Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const fs = require('fs');
  
  // Try multiple possible paths for the built frontend
  const possiblePaths = [
    path.join(__dirname, '../ecotrade/dist'),
    path.join(__dirname, '../../ecotrade/dist'),
    path.join(process.cwd(), 'ecotrade/dist'),
    path.join(process.cwd(), 'dist'),
    path.join('/app', 'ecotrade/dist'),
    path.join('/app', 'dist')
  ];
  
  let buildPath = null;
  for (const possiblePath of possiblePaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        buildPath = possiblePath;
        console.log(`📦 Found frontend build at: ${buildPath}`);
        break;
      }
    } catch (err) {
      // Continue to next path
    }
  }
  
  if (buildPath) {
    console.log(`📦 Serving static files from: ${buildPath}`);
    
    // Serve static files
    app.use(express.static(buildPath, {
      maxAge: '1y',
      etag: true
    }));
    
    // Handle React routing, return all requests to React app
    // This must be BEFORE the catch-all error handler
    app.get('*', (req, res, next) => {
      // Don't serve React app for API routes
      if (req.path.startsWith('/api/')) {
        return next(); // Let it fall through to 404 handler
      }
      res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          next(err);
        }
      });
    });
  } else {
    console.warn('⚠️  Frontend build not found. API-only mode.');
    console.warn('   Current working directory:', process.cwd());
    console.warn('   __dirname:', __dirname);
    
    // List directory contents for debugging
    try {
      const cwdContents = fs.readdirSync(process.cwd());
      console.warn('   CWD contents:', cwdContents);
    } catch (e) {
      console.warn('   Could not read CWD');
    }
  }
} else {
  // Development mode - just show API info
  app.get('/', (req, res) => {
    res.json({
      message: 'Eco Marketplace API - B2B PCR Materials Platform',
      status: 'running',
      environment: 'development',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        industries: '/api/industries',
        materials: '/api/materials',
        buyerRequests: '/api/buyer-requests',
        sellerRequests: '/api/seller-requests',
        analytics: '/api/analytics'
      }
    });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);

  res.status(err.status || 500).json({
    message: 'Server error',
    error: isDevelopment ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes only (if frontend not found or API route doesn't exist)
app.use('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      message: 'API route not found',
      path: req.originalUrl
    });
  } else {
    // If frontend build exists, this shouldn't be reached
    // If frontend build doesn't exist, show helpful message
    res.status(404).json({
      message: 'Route not found',
      path: req.originalUrl,
      note: 'Frontend may not be built or deployed. Check build logs.'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Eco Marketplace Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
});
