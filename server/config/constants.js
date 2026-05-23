/**
 * Application Constants
 *
 * Centralized configuration values used across the application.
 */

module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    MEMBER: 'member'
  },

  // Task statuses
  TASK_STATUS: {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    REVIEW: 'review',
    COMPLETED: 'completed'
  },

  // Task priorities
  TASK_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
};
