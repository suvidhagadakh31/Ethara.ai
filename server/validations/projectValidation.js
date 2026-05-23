/**
 * Project Validations
 *
 * Validates request bodies for project CRUD operations.
 */

const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

/**
 * Validate create project request
 *
 * Checks:
 * - title: required, 2-100 characters
 * - description: optional, max 500 characters
 */
const validateCreateProject = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || !title.trim()) {
    errors.push({ field: 'title', message: 'Project title is required' });
  } else if (title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Title must be at least 2 characters' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

/**
 * Validate update project request
 *
 * Checks:
 * - title: optional, 2-100 characters if provided
 * - description: optional, max 500 characters
 */
const validateUpdateProject = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (!title.trim()) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length < 2) {
      errors.push({ field: 'title', message: 'Title must be at least 2 characters' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
    }
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

/**
 * Validate add member request
 *
 * Checks:
 * - userId: required, valid MongoDB ObjectId
 */
const validateAddMember = (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID format');
  }

  next();
};

module.exports = { validateCreateProject, validateUpdateProject, validateAddMember };
