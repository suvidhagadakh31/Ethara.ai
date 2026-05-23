/**
 * Dashboard Controller
 *
 * Provides aggregated statistics for the dashboard view.
 *
 * Endpoints:
 * - GET /api/dashboard/stats - Get all dashboard statistics
 */

const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { TASK_STATUS } = require('../config/constants');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 *
 * Returns:
 * - Task counts by status
 * - Overdue task count
 * - Total projects
 * - Completion rate
 * - Tasks per project breakdown
 * - Tasks per user breakdown
 * - User's assigned tasks
 * - Recent activity
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Determine which projects the user has access to
  const projectFilter =
    req.user.role === 'admin'
      ? {}
      : { members: req.user._id };

  const userProjects = await Project.find(projectFilter).select('_id title');
  const projectIds = userProjects.map((p) => p._id);

  // Fetch all tasks in accessible projects
  const allTasks = await Task.find({ project: { $in: projectIds } })
    .populate('assignedTo', 'name email')
    .populate('project', 'title');

  // Fetch tasks assigned to current user
  const myTasks = await Task.find({ assignedTo: req.user._id })
    .populate('project', 'title')
    .sort({ dueDate: 1, priority: -1 })
    .limit(10);

  // ─── Calculate Statistics ───────────────────────────────────────────────────
  const now = new Date();
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const pendingTasks = allTasks.filter((t) => t.status === TASK_STATUS.TODO).length;
  const inProgressTasks = allTasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
  const reviewTasks = allTasks.filter((t) => t.status === TASK_STATUS.REVIEW).length;
  const overdueTasks = allTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== TASK_STATUS.COMPLETED
  ).length;

  // Completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ─── Tasks Per Project ──────────────────────────────────────────────────────
  const tasksPerProject = userProjects.map((project) => {
    const projectTasks = allTasks.filter(
      (t) => t.project?._id?.toString() === project._id.toString()
    );
    return {
      project: project.title,
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length
    };
  });

  // ─── Tasks Per User ─────────────────────────────────────────────────────────
  const userTaskMap = {};
  allTasks.forEach((task) => {
    if (task.assignedTo) {
      const key = task.assignedTo._id.toString();
      if (!userTaskMap[key]) {
        userTaskMap[key] = {
          user: task.assignedTo.name,
          email: task.assignedTo.email,
          total: 0,
          completed: 0
        };
      }
      userTaskMap[key].total++;
      if (task.status === TASK_STATUS.COMPLETED) {
        userTaskMap[key].completed++;
      }
    }
  });
  const tasksPerUser = Object.values(userTaskMap).sort((a, b) => b.total - a.total);

  // ─── Recent Activity (last 10 updated tasks) ───────────────────────────────
  const recentActivity = await Task.find({ project: { $in: projectIds } })
    .populate('assignedTo', 'name')
    .populate('project', 'title')
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('title status priority updatedAt project assignedTo');

  // ─── Send Response ──────────────────────────────────────────────────────────
  ApiResponse.success(res, 200, 'Dashboard stats retrieved', {
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      reviewTasks,
      overdueTasks,
      totalProjects: userProjects.length,
      completionRate
    },
    tasksPerProject,
    tasksPerUser,
    myTasks,
    recentActivity
  });
});

module.exports = { getDashboardStats };
