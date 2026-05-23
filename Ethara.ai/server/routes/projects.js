/**
 * Project Routes
 *
 * POST   /api/projects            - Create project (Admin)
 * GET    /api/projects            - Get all projects
 * GET    /api/projects/:id        - Get single project
 * PUT    /api/projects/:id        - Update project (Admin)
 * DELETE /api/projects/:id        - Delete project (Admin)
 * POST   /api/projects/:id/members - Add member (Admin)
 */

const express = require('express');
const router = express.Router();

// Controller
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember
} = require('../controllers/projectController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Validations
const {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember
} = require('../validations/projectValidation');

// All routes require authentication
router.use(protect);

// ─── CRUD Routes ────────────────────────────────────────────────────────────
router
  .route('/')
  .post(authorize('admin'), validateCreateProject, createProject)
  .get(getProjects);

router
  .route('/:id')
  .get(getProjectById)
  .put(authorize('admin'), validateUpdateProject, updateProject)
  .delete(authorize('admin'), deleteProject);

// ─── Member Management ──────────────────────────────────────────────────────
router.post('/:id/members', authorize('admin'), validateAddMember, addMember);

module.exports = router;
