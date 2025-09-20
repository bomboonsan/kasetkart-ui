// GraphQL Error Handler for Strapi v5

/**
 * Enhanced GraphQL Error Handler
 */
export class GraphQLErrorHandler {
  /**
   * Process GraphQL errors and return user-friendly messages
   */
  static processGraphQLErrors(errors) {
    if (!errors || !Array.isArray(errors)) {
      return {
        type: 'UnknownError',
        message: 'An unknown error occurred',
        userMessage: 'Something went wrong. Please try again.',
        shouldRetry: true
      };
    }

    const firstError = errors[0];
    const errorCode = firstError.extensions?.code;
    const errorMessage = firstError.message;

    // Handle specific Strapi error codes
    switch (errorCode) {
      case 'FORBIDDEN':
        return {
          type: 'AuthorizationError',
          message: errorMessage,
          userMessage: 'You do not have permission to perform this action.',
          shouldRetry: false,
          statusCode: 403
        };

      case 'UNAUTHENTICATED':
        return {
          type: 'AuthenticationError',
          message: errorMessage,
          userMessage: 'Please sign in to continue.',
          shouldRetry: false,
          statusCode: 401,
          requiresAuth: true
        };

      case 'BAD_USER_INPUT':
        return {
          type: 'ValidationError',
          message: errorMessage,
          userMessage: 'Please check your input and try again.',
          shouldRetry: false,
          statusCode: 400,
          validationErrors: this.extractValidationErrors(firstError)
        };

      case 'GRAPHQL_VALIDATION_FAILED':
        return {
          type: 'GraphQLValidationError',
          message: errorMessage,
          userMessage: 'The request format is invalid.',
          shouldRetry: false,
          statusCode: 400
        };

      case 'INTERNAL_SERVER_ERROR':
        return {
          type: 'ServerError',
          message: errorMessage,
          userMessage: 'Server error occurred. Please try again later.',
          shouldRetry: true,
          statusCode: 500
        };

      default:
        // Handle common GraphQL error patterns
        if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
          return {
            type: 'DuplicateError',
            message: errorMessage,
            userMessage: 'This item already exists.',
            shouldRetry: false,
            statusCode: 409
          };
        }

        if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
          return {
            type: 'NotFoundError',
            message: errorMessage,
            userMessage: 'The requested item was not found.',
            shouldRetry: false,
            statusCode: 404
          };
        }

        if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
          return {
            type: 'RateLimitError',
            message: errorMessage,
            userMessage: 'Too many requests. Please wait a moment and try again.',
            shouldRetry: true,
            statusCode: 429,
            retryAfter: 60 // seconds
          };
        }

        return {
          type: 'GraphQLError',
          message: errorMessage,
          userMessage: 'An error occurred. Please try again.',
          shouldRetry: true,
          statusCode: 400
        };
    }
  }

  /**
   * Extract validation errors from GraphQL error
   */
  static extractValidationErrors(error) {
    const validationErrors = [];
    
    // Check for Strapi validation error structure
    if (error.extensions?.exception?.details?.errors) {
      error.extensions.exception.details.errors.forEach(err => {
        validationErrors.push({
          field: err.path?.join('.') || 'unknown',
          message: err.message,
          value: err.value
        });
      });
    }

    // Check for alternative error structures
    if (error.extensions?.validationErrors) {
      Object.entries(error.extensions.validationErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            validationErrors.push({ field, message });
          });
        } else {
          validationErrors.push({ field, message: messages });
        }
      });
    }

    return validationErrors;
  }

  /**
   * Process network errors
   */
  static processNetworkError(error) {
    const statusCode = error.response?.status || 0;

    switch (statusCode) {
      case 0:
        return {
          type: 'NetworkError',
          message: 'Network connection failed',
          userMessage: 'Unable to connect to the server. Please check your internet connection.',
          shouldRetry: true,
          statusCode: 0
        };

      case 408:
      case 504:
        return {
          type: 'TimeoutError',
          message: 'Request timed out',
          userMessage: 'The request is taking too long. Please try again.',
          shouldRetry: true,
          statusCode
        };

      case 500:
      case 502:
      case 503:
        return {
          type: 'ServerError',
          message: 'Server error',
          userMessage: 'Server is currently unavailable. Please try again later.',
          shouldRetry: true,
          statusCode
        };

      default:
        return {
          type: 'NetworkError',
          message: error.message || 'Network error occurred',
          userMessage: 'A network error occurred. Please try again.',
          shouldRetry: true,
          statusCode
        };
    }
  }

  /**
   * Format error for user display
   */
  static formatUserMessage(processedError, context = {}) {
    let message = processedError.userMessage || processedError.message;

    // Add context-specific information
    if (context.operation) {
      const operationMessages = {
        create: 'creating the item',
        update: 'updating the item',
        delete: 'deleting the item',
        fetch: 'loading the data'
      };
      
      const operationText = operationMessages[context.operation] || context.operation;
      
      if (processedError.type === 'AuthorizationError') {
        message = `You do not have permission for ${operationText}.`;
      } else if (processedError.type === 'NotFoundError') {
        message = `The item you are trying to access was not found.`;
      } else if (processedError.shouldRetry) {
        message = `Error occurred while ${operationText}. Please try again.`;
      }
    }

    return message;
  }

  /**
   * Determine if operation should be retried
   */
  static shouldRetry(processedError, attemptCount = 0, maxRetries = 3) {
    if (!processedError.shouldRetry || attemptCount >= maxRetries) {
      return false;
    }

    // Don't retry authentication/authorization errors
    if (['AuthenticationError', 'AuthorizationError', 'ValidationError'].includes(processedError.type)) {
      return false;
    }

    // Retry network errors and server errors
    return ['NetworkError', 'TimeoutError', 'ServerError', 'RateLimitError'].includes(processedError.type);
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  static getRetryDelay(attemptCount, baseDelay = 1000) {
    return Math.min(baseDelay * Math.pow(2, attemptCount), 30000); // Max 30 seconds
  }

  /**
   * Log error for debugging (in development)
   */
  static logError(error, context = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 GraphQL Error');
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Stack:', error.stack);
      console.groupEnd();
    }

    // In production, you might want to send to error tracking service
    // this.sendToErrorTracking(error, context);
  }

  /**
   * Send to error tracking service (placeholder)
   */
  static sendToErrorTracking(error, context = {}) {
    // Implement error tracking service integration here
    // e.g., Sentry, LogRocket, etc.
  }
}

/**
 * Hook for handling GraphQL errors in React components
 */
export function useGraphQLErrorHandler() {
  const handleError = (error, context = {}) => {
    let processedError;

    // Process different types of errors
    if (error.response?.errors) {
      // GraphQL errors
      processedError = GraphQLErrorHandler.processGraphQLErrors(error.response.errors);
    } else if (error.response?.status) {
      // Network errors
      processedError = GraphQLErrorHandler.processNetworkError(error);
    } else {
      // Unknown errors
      processedError = {
        type: 'UnknownError',
        message: error.message || 'An unknown error occurred',
        userMessage: 'Something went wrong. Please try again.',
        shouldRetry: true
      };
    }

    // Log error for debugging
    GraphQLErrorHandler.logError(error, context);

    // Format user message
    const userMessage = GraphQLErrorHandler.formatUserMessage(processedError, context);

    return {
      ...processedError,
      userMessage,
      originalError: error
    };
  };

  const retry = async (operation, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const processedError = handleError(error);
        
        if (!GraphQLErrorHandler.shouldRetry(processedError, attempt, maxRetries)) {
          throw processedError;
        }
        
        // Wait before retrying
        const delay = GraphQLErrorHandler.getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw handleError(lastError);
  };

  return { handleError, retry };
}

export default GraphQLErrorHandler;