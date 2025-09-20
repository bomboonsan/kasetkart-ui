// GraphQL Profile API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import { getDocumentId } from '../../../utils/strapi/index.js';
import {
  GET_MY_PROFILE_SIDEBAR,
  GET_MY_PROFILE,
  GET_USER_BY_ID,
  GET_USER_BY_DOCUMENT_ID,
  GET_PROFILES,
  GET_PROFILE,
  FIND_PROFILE_BY_USER_ID,
  UPDATE_USER_PROFILE,
  CREATE_PROFILE,
  UPDATE_PROFILE_DATA,
  UPDATE_USER_RELATIONS
} from '../queries/profile.js';

/**
 * GraphQL Profile API - Replacement for REST-based profile API
 * Maintains the same interface as the original profileAPI for backward compatibility
 */
export const profileAPIGraphQL = {
  /**
   * Get current user profile for sidebar
   * GraphQL equivalent of: /users/me?populate[profile][populate]=avatarUrl&populate[role]=*
   */
  getMyProfileSidebar: async () => {
    try {
      const response = await graphqlAPI.query(GET_MY_PROFILE_SIDEBAR);
      return { data: response.me };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user complete profile for edit page
   * GraphQL equivalent of: /users/me?populate[profile][populate]=avatarUrl&populate[organization]=*&populate[faculty]=*&populate[department]=*&populate[academic_type]=*&populate[participation_type]=*&populate[educations][populate]=education_level
   */
  getMyProfile: async () => {
    try {
      const response = await graphqlAPI.query(GET_MY_PROFILE);
      return { data: response.me };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID or documentId for admin
   * Handles both numeric ID and documentId strings
   */
  getUserById: async (id) => {
    try {
      let response;
      
      // Check if it's a numeric ID (legacy) or documentId
      if (!isNaN(id)) {
        // For numeric ID, we need to query by ID directly
        response = await graphqlAPI.query(GET_USER_BY_ID, { documentId: id });
        return { data: response.usersPermissionsUser };
      } else {
        // For documentId, use filters
        response = await graphqlAPI.query(GET_USER_BY_DOCUMENT_ID, { documentId: id });
        const users = response.usersPermissionsUsers || [];
        const user = users.length > 0 ? users[0] : null;
        return { data: user };
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * GraphQL equivalent of: PUT /users/{id}
   */
  updateProfile: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_USER_PROFILE, {
        documentId,
        data
      });
      return response.updateUsersPermissionsUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get profiles list
   * GraphQL equivalent of: GET /profiles
   */
  getProfiles: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_PROFILES, variables);
      return { data: response.profiles || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single profile
   * GraphQL equivalent of: GET /profiles/{documentId}?populate=*
   */
  getProfile: async (documentId) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.query(GET_PROFILE, { documentId: id });
      return { data: response.profile };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new profile
   * GraphQL equivalent of: POST /profiles
   */
  createProfile: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_PROFILE, { data });
      return { data: response.createProfile };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update profile data
   * GraphQL equivalent of: PUT /profiles/{documentId}
   */
  updateProfileData: async (documentId, data) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(UPDATE_PROFILE_DATA, {
        documentId: id,
        data
      });
      return { data: response.updateProfile };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find profile by user ID
   * GraphQL equivalent of: GET /profiles?filters[user][id][$eq]={userId}
   */
  findProfileByUserId: async (userId) => {
    try {
      if (!userId) return null;
      
      const response = await graphqlAPI.query(FIND_PROFILE_BY_USER_ID, { 
        userId: userId.toString() 
      });
      
      const profiles = response.profiles || [];
      return Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user relations (custom endpoint)
   * This might need to be handled differently in GraphQL depending on backend implementation
   */
  updateUserRelations: async (payload) => {
    try {
      // This assumes a custom mutation exists in the GraphQL schema
      // If not, this functionality might need to be implemented differently
      const response = await graphqlAPI.mutate(UPDATE_USER_RELATIONS, { payload });
      return response.updateUserRelations;
    } catch (error) {
      // Fallback: throw error to indicate this operation is not available via GraphQL
      throw new Error('User relations update via GraphQL not implemented. This may require backend changes.');
    }
  }
};

// Export with backward compatibility
export const profileAPI = profileAPIGraphQL;

// Also export the API_BASE for compatibility
import { API_BASE } from '../../config/api.js';
export { API_BASE };