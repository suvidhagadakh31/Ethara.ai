/**
 * Authentication Validations
 *
 * Validates request bodies for register and login endpoints.
 * Uses the 'validator' library for email and string checks.
 */

const validator = require('validator');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/constants');

/**
 * Validate registration request body
 *
 * Checks:
 * - name: required, 2-50 characters, trimmed
 * - email: required, valid format, normalized
 * - password: required, minimum 6 characters, at least one number
 * - role: optional, must be 'admin' or 'member'
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  // Name validation
  if (!name || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Email validation
  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  } else if (!/\d/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' });
  }

  // Role validation (optional field)
  if (role && !Object.values(ROLES).includes(role)) {
    errors.push({ field: 'role', message: 'Role must be either admin or member' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

/**
 * Validate login request body
 *
 * Checks:
 * - email: required, valid format
 * - password: required
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

module.exports = { validateRegister, validateLogin };
