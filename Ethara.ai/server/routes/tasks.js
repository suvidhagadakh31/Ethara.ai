/**
 * Task Routes
 *
 * POST   /api/tasks     - Create task (Admin: any project, Member: own projects)
 * GET    /api/tasks     - Get tasks with filters, search, pagination
 * PUT    /api/tasks/:id - Update task (Admin: full, Member: status only on assigned)
 * DELETE /api/tasks/:id - Delete task (Admin or creator only)
 */

const express = require('express');
const router = express.Router();

const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, taskUpdatePermission } = require('../middleware/auth');
const { validateCreateTask, validateUpdateTask } = require('../validations/taskValidation');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .post(validateCreateTask, createTask)
  .get(getTasks);

router
  .route('/:id')
  .put(validateUpdateTask, taskUpdatePermission, updateTask)
  .delete(deleteTask);

module.exports = router;
