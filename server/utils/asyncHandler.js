/**
 * Async Handler Utility
 *
 * Wraps async route handlers to automatically catch errors
 * and pass them to the Express error middleware.
 * Eliminates the need for try-catch blocks in every controller.
 *
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
