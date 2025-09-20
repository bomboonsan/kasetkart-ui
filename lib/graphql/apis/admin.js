// GraphQL Admin and Dashboard API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import { getDocumentId } from '../../../utils/strapi/index.js';
import { API_BASE } from '../../../lib/config/api.js';
import {
  GET_USERS,
  GET_USER,
  UPDATE_USER,
  UPDATE_USER_STATUS,
  CREATE_USER,
  GET_UPLOADED_FILES,
  GET_UPLOADED_FILE,
  DELETE_UPLOADED_FILE,
  GET_PROJECT_STATS,
  GET_FUNDING_STATS,
  GET_WORKS_STATS,
  GET_PERSONNEL_BY_ACADEMIC_TYPE,
  GET_RESEARCH_STATS_BY_TYPES,
  GET_IMPACTS_BY_DEPARTMENT,
  GET_DASHBOARD_OVERVIEW
} from '../queries/admin.js';
import { GET_IMPACTS } from '../queries/lookup.js';

/**
 * GraphQL User API - Replacement for REST-based userAPI
 */
export const userAPIGraphQL = {
  /**
   * Update user
   * GraphQL equivalent of: PUT /users/{id}
   */
  updateUser: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_USER, {
        documentId,
        data
      });
      return response.updateUsersPermissionsUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user status (blocked/confirmed)
   * GraphQL equivalent of: PUT /users/{id} with status fields
   */
  updateUserStatus: async (documentId, blocked, confirmed) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(UPDATE_USER_STATUS, {
        documentId: id,
        blocked,
        confirmed
      });
      return response.updateUsersPermissionsUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create user
   * GraphQL equivalent of: POST /users
   */
  createUser: async (data) => {
    try {
      // Prepare user data in the format expected by Strapi GraphQL
      const userData = {
        username: data.email,
        email: data.email,
        password: data.password || 'defaultPassword123',
        confirmed: true,
        blocked: false,
        role: 2, // Default authenticated role ID
        ...(data.organizationID && { organization: data.organizationID }),
        ...(data.facultyId && { faculty: data.facultyId }),
        ...(data.departmentId && { department: data.departmentId }),
        ...(data.academic_type && { academic_type: data.academic_type }),
        ...(data.participation_type && { participation_type: data.participation_type }),
      };

      try {
        const response = await graphqlAPI.mutate(CREATE_USER, { data: userData });
        return response.createUsersPermissionsUser;
      } catch (error) {
        // Fallback: create minimal user and update relations separately if needed
        if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
          const minimalUser = {
            username: data.email,
            email: data.email,
            password: data.password || 'defaultPassword123',
            confirmed: true,
            blocked: false
          };

          const userResponse = await graphqlAPI.mutate(CREATE_USER, { data: minimalUser });
          
          // If user created successfully, update relations if needed
          if (userResponse?.createUsersPermissionsUser?.documentId) {
            const userId = userResponse.createUsersPermissionsUser.documentId;
            const relations = {};
            
            if (data.organizationID) relations.organization = data.organizationID;
            if (data.facultyId) relations.faculty = data.facultyId;
            if (data.departmentId) relations.department = data.departmentId;
            if (data.academic_type) relations.academic_type = data.academic_type;
            if (data.participation_type) relations.participation_type = data.participation_type;
            
            if (Object.keys(relations).length > 0) {
              await this.updateUser(userId, relations);
            }
          }
          
          return userResponse.createUsersPermissionsUser;
        }
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upsert user profile (create or update)
   * This combines user profile operations
   */
  upsertUserProfile: async (userId, profileData) => {
    try {
      // This would require importing profileAPI, which might create circular dependency
      // For now, throw an error to indicate this needs to be handled differently
      throw new Error('upsertUserProfile via GraphQL requires profile API integration. Use profile API directly.');
    } catch (error) {
      throw error;
    }
  }
};

/**
 * GraphQL Upload API - Replacement for REST-based uploadAPI
 * Note: File uploads in GraphQL typically require multipart/form-data which is handled differently
 */
export const uploadAPIGraphQL = {
  /**
   * Upload files
   * Note: This still uses REST API for file upload as GraphQL file upload is complex
   * GraphQL equivalent would require multipart support
   */
  uploadFiles: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      
      // Get token from GraphQL client
      const token = graphqlAPI.client?.getToken?.() || null;
      
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const text = await response.text().catch(() => '');
      if (!text) return null;
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get uploaded files
   * GraphQL equivalent of: GET /upload/files
   */
  getFiles: async () => {
    try {
      const response = await graphqlAPI.query(GET_UPLOADED_FILES, {});
      return { data: response.uploadFiles || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single file
   * GraphQL equivalent of: GET /upload/files/{id}
   */
  getFile: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_UPLOADED_FILE, { documentId });
      return { data: response.uploadFile };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete file
   * GraphQL equivalent of: DELETE /upload/files/{id}
   */
  deleteFile: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_UPLOADED_FILE, { documentId });
      return { data: response.deleteUploadFile };
    } catch (error) {
      throw error;
    }
  }
};

/**
 * GraphQL Dashboard API - Replacement for REST-based dashboardAPI
 */
export const dashboardAPIGraphQL = {
  /**
   * Get dashboard statistics
   * Combines multiple queries to get overall stats
   */
  getStats: async () => {
    try {
      const response = await graphqlAPI.query(GET_DASHBOARD_OVERVIEW, {});
      
      // Transform response to match expected format
      return [
        response.projectResearches || [],
        response.projectFundings || [],
        response.workPublications || [],
        response.workConferences || [],
        response.workBooks || []
      ];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get personnel by academic type
   * Note: This may require custom GraphQL resolvers on the backend
   */
  getPersonnelByAcademicType: async (departmentId = null) => {
    try {
      const variables = departmentId ? { departmentId } : {};
      const response = await graphqlAPI.query(GET_PERSONNEL_BY_ACADEMIC_TYPE, variables);
      return response.personnelByAcademicType || {};
    } catch (error) {
      // Fallback: return empty object as in original implementation
      return {};
    }
  },

  /**
   * Get research statistics by types
   * Note: This may require custom GraphQL resolvers on the backend
   */
  getResearchStatsByTypes: async (departmentId = null) => {
    try {
      const variables = departmentId ? { departmentId } : {};
      const response = await graphqlAPI.query(GET_RESEARCH_STATS_BY_TYPES, variables);
      return response.researchStatsByTypes || { icTypes: [], impacts: [], sdgs: [] };
    } catch (error) {
      // Fallback: return empty arrays as in original implementation
      return { icTypes: [], impacts: [], sdgs: [] };
    }
  }
};

/**
 * GraphQL Report API - Replacement for REST-based reportAPI
 */
export const reportAPIGraphQL = {
  /**
   * Get impacts
   * GraphQL equivalent of: GET /impacts
   */
  getImpacts: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_IMPACTS, variables);
      return { data: response.impacts || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get impacts by department
   * Note: This may require custom GraphQL resolvers on the backend
   */
  getImpactsByDepartment: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {}
      };

      const response = await graphqlAPI.query(GET_IMPACTS_BY_DEPARTMENT, variables);
      return { data: response.impactsByDepartment || [] };
    } catch (error) {
      throw error;
    }
  }
};

// Export with backward compatibility
export const userAPI = userAPIGraphQL;
export const uploadAPI = uploadAPIGraphQL;
export const dashboardAPI = dashboardAPIGraphQL;
export const reportAPI = reportAPIGraphQL;