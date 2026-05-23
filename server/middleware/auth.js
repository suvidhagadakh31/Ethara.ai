/**
 * Authentication & Authorization Middleware
 *
 * Provides:
 * - JWT token verification (protect)
 * - Role-based access control (authorize)
 * - Project membership validation (projectMember)
 * - Task ownership validation (taskOwnerOrAdmin)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - Verifies JWT token and attaches user to request.
 * Also checks token expiration explicitly.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. No token provided.');
  }

  // Verify token (jwt.verify throws on expiration automatically)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user (exclude password from response)
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new ApiError(401, 'Not authorized. User no longer exists.');
  }

  req.user = user;
  next();
});

/**
 * Role-based access control.
 * Usage: authorize('admin') or authorize('admin', 'member')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized.`);
    }
    next();
  };
};

/**
 * Validate that the user is a member of the specified project.
 * Admins bypass this check.
 * Expects project ID in req.params.id or req.body.project
 */
const projectMember = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id || req.body.project;
  if (!projectId) {
    throw new ApiError(400, 'Project ID is required.');
  }

  // Admins bypass membership check
  if (req.user.role === 'admin') return next();

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const isMember = project.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) {
    throw new ApiError(403, 'Access denied. You are not a member of this project.');
  }

  next();
});

/**
 * Validate task update permissions.
 * 
 * Assignment requirement:
 * - Admin: Manage tasks and users (full CRUD)
 * - Member: View and update assigned tasks only (status change on their tasks)
 */
const taskUpdatePermission = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found.');
  }

  // Admins can update any task fully
  if (req.user.role === 'admin') {
    req.task = task;
    return next();
  }

  // Members: can only update tasks assigned to them
  const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  if (!isAssigned) {
    throw new ApiError(403, 'You can only update tasks assigned to you.');
  }

  // Members can only change the status field
  const allowedFields = ['status'];
  const attemptedFields = Object.keys(req.body);
  const unauthorized = attemptedFields.filter(f => !allowedFields.includes(f));
  if (unauthorized.length > 0) {
    throw new ApiError(403, 'Members can only update task status.');
  }

  req.task = task;
  next();
});

module.exports = { protect, authorize, projectMember, taskUpdatePermission };
