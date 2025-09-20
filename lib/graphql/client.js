// GraphQL Client Configuration for Strapi v5
import { GraphQLClient } from 'graphql-request';
import { tokenManager } from '@/lib/auth/token-manager';
import { API_BASE } from '@/lib/config/api';

// Create GraphQL endpoint URL
const GRAPHQL_ENDPOINT = `${API_BASE}/graphql`;

class StrapiGraphQLClient {
  constructor() {
    this.client = new GraphQLClient(GRAPHQL_ENDPOINT);
    this.setupDefaultHeaders();
  }

  setupDefaultHeaders() {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    // Add authentication token if available
    const token = tokenManager.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    this.client.setHeaders(defaultHeaders);
  }

  // Update headers when token changes
  updateAuthToken(token) {
    if (token) {
      this.client.setHeader('Authorization', `Bearer ${token}`);
    } else {
      this.client.setHeader('Authorization', '');
    }
  }

  // Execute GraphQL query
  async query(query, variables = {}) {
    try {
      this.setupDefaultHeaders(); // Refresh headers before each request
      const response = await this.client.request(query, variables);
      return response;
    } catch (error) {
      throw this.processGraphQLError(error);
    }
  }

  // Execute GraphQL mutation
  async mutate(mutation, variables = {}) {
    try {
      this.setupDefaultHeaders(); // Refresh headers before each request
      const response = await this.client.request(mutation, variables);
      return response;
    } catch (error) {
      throw this.processGraphQLError(error);
    }
  }

  // Process GraphQL errors into a consistent format
  processGraphQLError(error) {
    // GraphQL errors from graphql-request
    if (error.response?.errors) {
      const graphqlErrors = error.response.errors;
      const firstError = graphqlErrors[0];
      
      return {
        type: 'GraphQLError',
        message: firstError.message || 'GraphQL query failed',
        errors: graphqlErrors,
        statusCode: error.response.status || 400,
        originalError: error
      };
    }

    // Network or other errors
    if (error.response?.status) {
      return {
        type: 'NetworkError',
        message: `HTTP ${error.response.status}: ${error.message}`,
        statusCode: error.response.status,
        originalError: error
      };
    }

    // Unknown errors
    return {
      type: 'UnknownError',
      message: error.message || 'An unknown error occurred',
      originalError: error
    };
  }

  // Set custom headers
  setHeaders(headers) {
    this.client.setHeaders(headers);
  }

  // Set single header
  setHeader(key, value) {
    this.client.setHeader(key, value);
  }
}

// Create singleton instance
const graphqlClient = new StrapiGraphQLClient();

export default graphqlClient;
export { StrapiGraphQLClient };