// Centralized error handling for HTTP requests
// Extracts error processing logic from API client

export class ErrorHandler {
  /**
   * Process and format error response for consistent error messaging
   * @param {Response} response - Fetch response object
   * @returns {Promise<Error>} Formatted error
   */
  static async processResponse(response) {
    let errorText = '';

    // Try to extract error message from JSON response
    try {
      const errorData = await response.json().catch(() => null);
      if (errorData && (errorData.error || errorData.message || errorData)) {
        errorText = errorData.error?.message || 
                   errorData.message || 
                   JSON.stringify(errorData);
      }
    } catch (e) {
      // JSON parsing failed, continue to text fallback
    }

    // Fallback to response text if no JSON error found
    if (!errorText) {
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = `HTTP ${response.status}`;
      }
    }

    return new Error(errorText || `HTTP ${response.status}`);
  }

  /**
   * Format error for consistent error messaging
   * @param {any} error - Original error object
   * @param {string} context - Context where error occurred (optional)
   * @returns {Error} Formatted error
   */
  static formatError(error, context = '') {
    const message = error?.message || String(error);
    const prefix = context ? `${context}: ` : '';
    return new Error(`${prefix}${message}`);
  }
}