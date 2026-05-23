/**
 * JWT Token Generator
 *
 * Generates a signed JWT token with the user's ID as payload.
 * Token expiration is configured via environment variables.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT token
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
