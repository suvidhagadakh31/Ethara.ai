/**
 * Task Validations
 *
 * Validates request bodies for task CRUD operations.
 */

const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

/**
 * Validate create task request
 *
 * Checks:
 * - title: required, 2-200 characters
 * - description: optional, max 2000 characters
 * - project: required, valid ObjectId
 * - assignedTo: optional, valid ObjectId
 * - status: optional, must be valid status
 * - priority: optional, must be valid priority
 * - dueDate: optional, must be valid date
 */
const validateCreateTask = (req, res, next) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
  const errors = [];

  // Title validation
  if (!title || !title.trim()) {
    errors.push({ field: 'title', message: 'Task title is required' });
  } else if (title.trim().length < 2) {
    errors.push({ field: 'title', message: 'Title must be at least 2 characters' });
  } else if (title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title cannot exceed 200 characters' });
  }

  // Description validation
  if (description && description.length > 2000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 2000 characters' });
  }

  // Project validation
  if (!project) {
    errors.push({ field: 'project', message: 'Project ID is required' });
  } else if (!mongoose.Types.ObjectId.isValid(project)) {
    errors.push({ field: 'project', message: 'Invalid project ID format' });
  }

  // AssignedTo validation (optional)
  if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
    errors.push({ field: 'assignedTo', message: 'Invalid user ID format for assignedTo' });
  }

  // Status validation (optional)
  if (status && !Object.values(TASK_STATUS).includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}` });
  }

  // Priority validation (optional)
  if (priority && !Object.values(TASK_PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}` });
  }

  // Due date validation (optional)
  if (dueDate && isNaN(Date.parse(dueDate))) {
    errors.push({ field: 'dueDate', message: 'Invalid date format for dueDate' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

/**
 * Validate update task request
 *
 * All fields are optional but validated if provided.
 */
const validateUpdateTask = (req, res, next) => {
  const { title, description, assignedTo, status, priority, dueDate } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (!title.trim()) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length < 2) {
      errors.push({ field: 'title', message: 'Title must be at least 2 characters' });
    } else if (title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Title cannot exceed 200 characters' });
    }
  }

  if (description && description.length > 2000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 2000 characters' });
  }

  if (assignedTo && assignedTo !== '' && !mongoose.Types.ObjectId.isValid(assignedTo)) {
    errors.push({ field: 'assignedTo', message: 'Invalid user ID format' });
  }

  if (status && !Object.values(TASK_STATUS).includes(status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}` });
  }

  if (priority && !Object.values(TASK_PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}` });
  }

  if (dueDate && dueDate !== '' && isNaN(Date.parse(dueDate))) {
    errors.push({ field: 'dueDate', message: 'Invalid date format' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors[0].message, errors);
  }

  next();
};

module.exports = { validateCreateTask, validateUpdateTask };
