/**
 * Project Model
 *
 * Schema definition for team projects.
 *
 * Fields:
 * - title: Project name
 * - description: Brief project description
 * - createdBy: Reference to the user who created the project (owner)
 * - members: Array of user references (team members)
 *
 * Relationships:
 * - createdBy → User (one-to-one)
 * - members → User (one-to-many)
 * - Tasks reference this project via 'project' field
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have a creator']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ─── INDEXES ────────────────────────────────────────────────────────────────
projectSchema.index({ createdBy: 1 });
projectSchema.index({ members: 1 });

// ─── VIRTUAL: Get task count for this project ───────────────────────────────
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

module.exports = mongoose.model('Project', projectSchema);
