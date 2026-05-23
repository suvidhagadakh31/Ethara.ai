/**
 * Task Model
 *
 * Schema definition for project tasks.
 *
 * Fields:
 * - title: Task name/summary
 * - description: Detailed task description
 * - project: Reference to the parent project
 * - assignedTo: Reference to the assigned user
 * - status: Current task status (todo, in-progress, review, completed)
 * - priority: Task priority level (low, medium, high, urgent)
 * - dueDate: Task deadline
 *
 * Relationships:
 * - project → Project (many-to-one)
 * - assignedTo → User (many-to-one)
 * - createdBy → User (many-to-one)
 */

const mongoose = require('mongoose');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TASK_STATUS),
        message: 'Invalid task status'
      },
      default: TASK_STATUS.TODO
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(TASK_PRIORITY),
        message: 'Invalid priority level'
      },
      default: TASK_PRIORITY.MEDIUM
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ─── INDEXES: Optimize frequent queries ─────────────────────────────────────
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });

// ─── VIRTUAL: Check if task is overdue ──────────────────────────────────────
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === TASK_STATUS.COMPLETED) return false;
  return new Date(this.dueDate) < new Date();
});

module.exports = mongoose.model('Task', taskSchema);
