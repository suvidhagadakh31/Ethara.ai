/**
 * Custom API Error Class
 *
 * Extends the native Error class to include HTTP status codes
 * and structured error responses for the API.
 *
 * @example
 * throw new ApiError(404, 'User not found');
 * throw new ApiError(400, 'Validation failed', errors);
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Optional array of validation errors
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes operational errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
