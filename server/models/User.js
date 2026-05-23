/**
 * User Model
 *
 * Schema definition for application users.
 *
 * Fields:
 * - name: User's display name
 * - email: Unique email address (used for login)
 * - password: Hashed password (excluded from queries by default)
 * - role: Access level - 'admin' or 'member'
 *
 * Features:
 * - Pre-save hook for password hashing
 * - Instance method for password comparison
 * - Automatic timestamp fields (createdAt, updatedAt)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Exclude from query results by default
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: 'Role must be either admin or member'
      },
      default: ROLES.MEMBER
    }
  },
  {
    timestamps: true
  }
);

// ─── INDEX (unique on email is already created by 'unique: true') ────────────
// No additional index needed — 'unique: true' creates one automatically

// ─── PRE-SAVE: Hash password before saving ──────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── METHODS ────────────────────────────────────────────────────────────────

/**
 * Compare a candidate password with the stored hash
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove sensitive fields from JSON output
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
