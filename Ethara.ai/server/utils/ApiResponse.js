/**
 * Standardized API Response Utility
 *
 * Provides consistent response formatting across all endpoints.
 *
 * @example
 * ApiResponse.success(res, 200, 'Users fetched', { users });
 * ApiResponse.created(res, 'User registered', { user, token });
 * ApiResponse.noContent(res);
 */

class ApiResponse {
  /**
   * Send a success response
   */
  static success(res, statusCode = 200, message = 'Success', data = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data
    });
  }

  /**
   * Send a 201 Created response
   */
  static created(res, message = 'Created successfully', data = {}) {
    return res.status(201).json({
      success: true,
      message,
      ...data
    });
  }

  /**
   * Send a 204 No Content response
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
