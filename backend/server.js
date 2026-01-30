const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const farmRoutes = require('./src/routes/farmRoutes');
const cropRoutes = require('./src/routes/cropRoutes');
const livestockRoutes = require('./src/routes/livestockRoutes');
const userRoutes = require('./src/routes/userRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const paddyVarietyRoutes = require('./src/routes/paddyVarietyRoutes');
const seasonPlanRoutes = require('./src/routes/seasonPlanRoutes');
const diseaseDetectionRoutes = require('./src/routes/diseaseDetectionRoutes');
const adminDiseaseRoutes = require('./src/routes/adminDiseaseRoutes');
const machineryRoutes = require('./src/routes/machineryRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');
const { notFound } = require('./src/middleware/notFound');

// Create Express app
const app = express();

// Trust proxy - required when running behind reverse proxy (Nginx, Cloudflare, etc.)
// This fixes express-rate-limit X-Forwarded-For header validation errors
app.set('trust proxy', 1);

// Ensure upload directories exist
const fs = require('fs');
const path = require('path');

const uploadDirs = [
  './src/uploads/avatars',
  './src/uploads/disease-detection',
  './src/uploads/admin-disease-references'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created upload directory: ${dir}`);
  }
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable for file uploads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());

// Rate limiting with proper proxy support
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Farm Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/livestock', livestockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/paddy-varieties', paddyVarietyRoutes);
app.use('/api/season-plans', seasonPlanRoutes);
app.use('/api/disease-detection', diseaseDetectionRoutes);
app.use('/api/admin/diseases', adminDiseaseRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/locations', locationRoutes);
// Admin management routes (list/delete farmers)
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Check R2 configuration
const checkR2Config = () => {
  const r2Service = require('./src/services/r2Service');
  if (r2Service.isConfigured()) {
    console.log('✓ Cloudflare R2 storage configured successfully');
  } else {
    console.warn('⚠️  Cloudflare R2 not configured. Image uploads will fail.');
    console.warn('   Please set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your .env file');
  }
};

// Start server
const PORT = process.env.PORT || 5000;
let server;

connectDB().then(() => {
  checkR2Config();
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Trust proxy setting: ${app.get('trust proxy')}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  }
});

module.exports = app;
// Updated for restart
