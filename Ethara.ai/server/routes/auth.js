/**
 * Auth Routes
 *
 * POST /api/auth/register - Register new user
 * POST /api/auth/login    - Login user
 * GET  /api/auth/me       - Get current user profile
 * GET  /api/auth/users    - Get all users
 */

const express = require('express');
const router = express.Router();

// Controller
const { register, login, getMe, getUsers } = require('../controllers/authController');

// Middleware
const { protect } = require('../middleware/auth');

// Validations
const { validateRegister, validateLogin } = require('../validations/authValidation');

// ─── Public Routes ──────────────────────────────────────────────────────────
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// ─── Protected Routes ───────────────────────────────────────────────────────
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
