/**
 * Task Controller
 *
 * Handles CRUD operations for tasks with:
 * - Filtering (status, priority, assignedTo)
 * - Search (title, description)
 * - Sorting (dueDate, priority, status, createdAt)
 * - Pagination (page, limit)
 * - Role-based access enforcement
 */

const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { PAGINATION } = require('../config/constants');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private (Admin can create in any project, Members only in their projects)
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

  // Verify project exists
  const projectDoc = await Project.findById(project);
  if (!projectDoc) {
    throw new ApiError(404, 'Project not found');
  }

  // Members can only create tasks in projects they belong to
  if (req.user.role !== 'admin') {
    const isMember = projectDoc.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) {
      throw new ApiError(403, 'You must be a project member to create tasks.');
    }
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || '',
    project,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null
  });

  await task.populate('assignedTo createdBy', 'name email');
  await task.populate('project', 'title');

  ApiResponse.created(res, 'Task created successfully', { task });
});

/**
 * @desc    Get tasks with filtering, search, sort, and pagination
 * @route   GET /api/tasks
 * @access  Private
 *
 * Query params:
 * - project, status, priority, assignedTo: Filters
 * - search: Text search in title/description
 * - sort: dueDate | priority | status | createdAt (default)
 * - page: Page number (default 1)
 * - limit: Items per page (default 20, max 100)
 */
const getTasks = asyncHandler(async (req, res) => {
  const { project, status, priority, assignedTo, search, sort, page, limit } = req.query;
  const filter = {};

  // Apply filters
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;

  // Text search
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Scope to user's projects (members only see their projects' tasks)
  if (!project) {
    const userProjects = await Project.find(
      req.user.role === 'admin' ? {} : { members: req.user._id }
    ).select('_id');
    filter.project = { $in: userProjects.map(p => p._id) };
  }

  // Sort
  let sortOption = { createdAt: -1 };
  if (sort === 'dueDate') sortOption = { dueDate: 1 };
  if (sort === 'priority') sortOption = { priority: -1 };
  if (sort === 'status') sortOption = { status: 1 };
  if (sort === '-createdAt') sortOption = { createdAt: -1 };

  // Pagination
  const pageNum = Math.max(1, parseInt(page) || PAGINATION.DEFAULT_PAGE);
  const limitNum = Math.min(parseInt(limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(filter)
  ]);

  ApiResponse.success(res, 200, 'Tasks retrieved', {
    tasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private (Admin: full access, Member: status only on assigned tasks)
 *
 * Note: taskUpdatePermission middleware runs before this controller
 * and attaches req.task
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = req.task; // Set by taskUpdatePermission middleware

  const { title, description, status, priority, assignedTo, dueDate } = req.body;

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  await task.populate('assignedTo createdBy', 'name email');
  await task.populate('project', 'title');

  ApiResponse.success(res, 200, 'Task updated successfully', { task });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin or task creator only)
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  // Only admin or creator can delete
  if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only the task creator or admin can delete this task.');
  }

  await Task.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, 200, 'Task deleted successfully');
});

module.exports = { createTask, getTasks, updateTask, deleteTask };
