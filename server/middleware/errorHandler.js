/**
 * Error Handling Middleware
 *
 * Centralized error handler that processes all errors thrown
 * in the application and returns consistent error responses.
 *
 * Handles:
 * - Custom ApiError instances
 * - Mongoose validation errors
 * - Mongoose duplicate key errors (code 11000)
 * - Mongoose CastError (invalid ObjectId)
 * - JWT errors (invalid/expired tokens)
 * - Unknown/unexpected errors
 */

const ApiError = require('../utils/ApiError');

/**
 * 404 Not Found handler - catches unmatched routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ─── Mongoose Validation Error ──────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    message = 'Validation failed';
  }

  // ─── Mongoose Duplicate Key Error ───────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value: A record with this ${field} already exists.`;
  }

  // ─── Mongoose CastError (Invalid ObjectId) ─────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── JWT Invalid Token ──────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // ─── JWT Expired Token ──────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  // ─── Send Response ──────────────────────────────────────────────────────────
  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
