/**
 * Dashboard Routes
 *
 * GET /api/dashboard/stats - Get dashboard statistics
 */

const express = require('express');
const router = express.Router();

// Controller
const { getDashboardStats } = require('../controllers/dashboardController');

// Middleware
const { protect } = require('../middleware/auth');

// ─── Dashboard Routes ───────────────────────────────────────────────────────
router.get('/stats', protect, getDashboardStats);

module.exports = router;
