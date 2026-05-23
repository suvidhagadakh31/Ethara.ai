/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Team Task Manager - Production Server
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Features:
 * - MongoDB Atlas connection
 * - JWT authentication + RBAC
 * - Helmet (secure HTTP headers)
 * - Compression (gzip responses)
 * - Rate limiting (API abuse prevention)
 * - CORS (production + development)
 * - Morgan (request logging)
 * - Static file serving (React SPA)
 * - Centralized error handling
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');

// Error handling
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Secure HTTP headers (XSS, clickjacking, MIME sniffing protection)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for React SPA compatibility
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - prevent brute force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // Limit per IP
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 100,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Gzip compression for all responses
app.use(compression());

// Parse request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - allow frontend origin
app.use(cors({
  origin: isProduction ? true : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
if (isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Trust proxy (Railway uses reverse proxy)
app.set('trust proxy', 1);

// ═══════════════════════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check (for Railway health monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC FILES (Production - Serve React SPA)
// ═══════════════════════════════════════════════════════════════════════════════

if (isProduction) {
  const clientDist = path.join(__dirname, '../client/dist');

  // Serve static assets with caching
  app.use(express.static(clientDist, {
    maxAge: '1y',       // Cache static assets for 1 year
    etag: true,
    lastModified: true
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

app.use(notFound);
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER STARTUP
// ═══════════════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  🚀 Team Task Manager Server`);
    console.log(`${'═'.repeat(50)}`);
    console.log(`  Port:        ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  API:         http://localhost:${PORT}/api`);
    console.log(`  Health:      http://localhost:${PORT}/api/health`);
    console.log(`${'═'.repeat(50)}\n`);
  });
};

startServer();
