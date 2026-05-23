/**
 * Project Controller
 *
 * Handles CRUD operations for projects and member management.
 * Admin-only operations: create, update, delete, manage members.
 *
 * Endpoints:
 * - POST   /api/projects            - Create project
 * - GET    /api/projects            - Get all user's projects
 * - GET    /api/projects/:id        - Get single project
 * - PUT    /api/projects/:id        - Update project
 * - DELETE /api/projects/:id        - Delete project
 * - POST   /api/projects/:id/members - Add member
 */

const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
const createProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;

  // Build members array: always include creator + any specified members
  const memberIds = [req.user._id.toString()];
  if (members && Array.isArray(members)) {
    members.forEach(id => {
      if (id && !memberIds.includes(id.toString())) {
        memberIds.push(id);
      }
    });
  }

  const project = await Project.create({
    title: title.trim(),
    description: description?.trim() || '',
    createdBy: req.user._id,
    members: memberIds
  });

  await project.populate('createdBy members', 'name email role');

  ApiResponse.created(res, 'Project created successfully', { project });
});

/**
 * @desc    Get all projects for the current user
 * @route   GET /api/projects
 * @access  Private
 *
 * Admins see all projects. Members see only projects they belong to.
 */
const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'admin'
      ? {}
      : { members: req.user._id };

  const projects = await Project.find(filter)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });

  // Calculate progress for each project
  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const tasks = await Task.find({ project: project._id });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...project.toObject(),
        progress,
        totalTasks,
        completedTasks
      };
    })
  );

  ApiResponse.success(res, 200, 'Projects retrieved', {
    count: projectsWithProgress.length,
    projects: projectsWithProgress
  });
});

/**
 * @desc    Get a single project by ID with progress stats
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Check access: must be a member or admin
  const isMember = project.members.some(
    (m) => m._id.toString() === req.user._id.toString()
  );
  if (!isMember && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. You are not a member of this project.');
  }

  // Calculate project progress from tasks
  const tasks = await Task.find({ project: project._id });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  ApiResponse.success(res, 200, 'Project retrieved', {
    project,
    progress: {
      percentage: progress,
      totalTasks,
      completedTasks,
      inProgressTasks,
      reviewTasks,
      todoTasks,
      overdueTasks
    }
  });
});

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Only creator or admin can update
  if (
    project.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Only the project creator or admin can update this project');
  }

  const { title, description } = req.body;
  if (title !== undefined) project.title = title.trim();
  if (description !== undefined) project.description = description.trim();

  await project.save();
  await project.populate('createdBy members', 'name email role');

  ApiResponse.success(res, 200, 'Project updated successfully', { project });
});

/**
 * @desc    Delete a project and all associated tasks
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Only creator or admin can delete
  if (
    project.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Only the project creator or admin can delete this project');
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ project: project._id });

  // Delete the project
  await Project.findByIdAndDelete(req.params.id);

  ApiResponse.success(res, 200, 'Project and associated tasks deleted successfully');
});

/**
 * @desc    Add a member to the project
 * @route   POST /api/projects/:id/members
 * @access  Private/Admin
 */
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Only creator or admin can manage members
  if (
    project.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Only the project creator or admin can manage members');
  }

  // Verify user exists
  const userToAdd = await User.findById(userId);
  if (!userToAdd) {
    throw new ApiError(404, 'User not found');
  }

  // Check if already a member
  if (project.members.some((m) => m.toString() === userId)) {
    throw new ApiError(400, 'User is already a member of this project');
  }

  // Add member
  project.members.push(userId);
  await project.save();
  await project.populate('createdBy members', 'name email role');

  ApiResponse.success(res, 200, 'Member added successfully', { project });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember
};
