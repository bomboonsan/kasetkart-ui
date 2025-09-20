// GraphQL Auth API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  ME_QUERY,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  CHANGE_PASSWORD_MUTATION
} from '../queries/auth.js';

/**
 * GraphQL Auth API - Replacement for REST-based authAPI
 * Note: This is mainly for backward compatibility as the app uses NextAuth
 */
export const authAPIGraphQL = {
  /**
   * Login user
   * GraphQL equivalent of: POST /auth/local
   */
  login: async (identifier, password) => {
    try {
      const response = await graphqlAPI.mutate(LOGIN_MUTATION, {
        input: { identifier, password }
      });
      
      if (response.login?.jwt) {
        graphqlAPI.setAuthToken(response.login.jwt);
      }
      
      return response.login;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register user
   * GraphQL equivalent of: POST /auth/local/register
   */
  register: async (username, email, password) => {
    try {
      const response = await graphqlAPI.mutate(REGISTER_MUTATION, {
        input: { username, email, password }
      });
      
      if (response.register?.jwt) {
        graphqlAPI.setAuthToken(response.register.jwt);
      }
      
      return response.register;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    graphqlAPI.setAuthToken(null);
  },

  /**
   * Get current user
   * GraphQL equivalent of: GET /users/me?populate=*
   */
  me: async () => {
    try {
      const response = await graphqlAPI.query(ME_QUERY);
      return { data: response.me };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Forgot password
   * GraphQL equivalent of: POST /auth/forgot-password
   */
  forgotPassword: async (email) => {
    try {
      const response = await graphqlAPI.mutate(FORGOT_PASSWORD_MUTATION, { email });
      return response.forgotPassword;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password
   * GraphQL equivalent of: POST /auth/reset-password
   */
  resetPassword: async (code, password, passwordConfirmation) => {
    try {
      const response = await graphqlAPI.mutate(RESET_PASSWORD_MUTATION, {
        code,
        password,
        passwordConfirmation
      });
      
      if (response.resetPassword?.jwt) {
        graphqlAPI.setAuthToken(response.resetPassword.jwt);
      }
      
      return response.resetPassword;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   * GraphQL equivalent of: POST /auth/change-password
   */
  changePassword: async (currentPassword, password, passwordConfirmation) => {
    try {
      const response = await graphqlAPI.mutate(CHANGE_PASSWORD_MUTATION, {
        currentPassword,
        password,
        passwordConfirmation
      });
      
      if (response.changePassword?.jwt) {
        graphqlAPI.setAuthToken(response.changePassword.jwt);
      }
      
      return response.changePassword;
    } catch (error) {
      throw error;
    }
  }
};

// Export with backward compatibility
export const authAPI = authAPIGraphQL;