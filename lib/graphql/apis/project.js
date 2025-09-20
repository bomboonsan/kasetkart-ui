// GraphQL Project and Funding API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import { getDocumentId } from '../../../utils/strapi/index.js';
import {
  GET_PROJECTS,
  GET_PROJECTS_BY_USER,
  GET_PROJECT,
  GET_PROJECT_PARTNERS,
  CREATE_PROJECT,
  CREATE_PROJECT_WITH_RELATIONS,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_PROJECT_PARTNER,
  UPDATE_PROJECT_PARTNER,
  DELETE_PROJECT_PARTNER,
  GET_FUNDINGS,
  GET_FUNDINGS_BY_USER,
  GET_FUNDING,
  CREATE_FUNDING,
  UPDATE_FUNDING,
  DELETE_FUNDING,
  GET_CURRENT_USER
} from '../queries/project.js';

/**
 * Get current user ID from GraphQL API
 */
async function getCurrentUserId() {
  try {
    const response = await graphqlAPI.query(GET_CURRENT_USER);
    const userId = response.me?.id;
    if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    return userId;
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  }
}

/**
 * GraphQL Project API - Replacement for REST-based project API
 */
export const projectAPIGraphQL = {
  /**
   * Get all projects
   * GraphQL equivalent of: GET /project-researches
   */
  getProjects: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_PROJECTS, variables);
      return { data: response.projectResearches || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's projects (from research_partners relation)
   */
  getMyProjects: async () => {
    try {
      const userId = await getCurrentUserId();
      const response = await graphqlAPI.query(GET_PROJECTS_BY_USER, { 
        userId: userId.toString() 
      });
      return { data: response.projectResearches || [] };
    } catch (error) {
      try {
        // Fallback: get all projects without filtering
        const response = await graphqlAPI.query(GET_PROJECTS, {});
        return { data: response.projectResearches || [] };
      } catch (e) {
        throw error;
      }
    }
  },

  /**
   * Get projects by specific user ID
   */
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required');
      
      const response = await graphqlAPI.query(GET_PROJECTS_BY_USER, { 
        userId: userId.toString() 
      });
      return { data: response.projectResearches || [] };
    } catch (error) {
      return { data: [] };
    }
  },

  /**
   * Get single project
   * GraphQL equivalent of: GET /project-researches/{id}?populate=*
   */
  getProject: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_PROJECT, { documentId });
      return { data: response.projectResearch };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get project partners
   */
  getProjectPartners: async (projectId) => {
    try {
      const projectDocumentId = getDocumentId(projectId);
      const response = await graphqlAPI.query(GET_PROJECT_PARTNERS, { 
        projectDocumentId 
      });
      return { data: response.projectPartners || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create project partner
   */
  createPartner: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_PROJECT_PARTNER, { data });
      return { data: response.createProjectPartner };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update project partner
   */
  updatePartner: async (documentId, data) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(UPDATE_PROJECT_PARTNER, {
        documentId: id,
        data
      });
      return { data: response.updateProjectPartner };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete project partner
   */
  deletePartner: async (documentId) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(DELETE_PROJECT_PARTNER, {
        documentId: id
      });
      return { data: response.deleteProjectPartner };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create project
   * GraphQL equivalent of: POST /project-researches
   */
  createProject: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_PROJECT, { data });
      return { data: response.createProjectResearch };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create project with relations (custom endpoint)
   */
  createProjectWithRelations: async (data) => {
    try {
      // This assumes a custom mutation exists in the GraphQL schema
      const response = await graphqlAPI.mutate(CREATE_PROJECT_WITH_RELATIONS, { data });
      return response.createProjectWithRelations;
    } catch (error) {
      // Fallback to regular create if custom mutation doesn't exist
      throw new Error('Project creation with relations via GraphQL not implemented. This may require backend changes.');
    }
  },

  /**
   * Update project
   * GraphQL equivalent of: PUT /project-researches/{id}
   */
  updateProject: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_PROJECT, {
        documentId,
        data
      });
      return { data: response.updateProjectResearch };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete project
   * GraphQL equivalent of: DELETE /project-researches/{id}
   */
  deleteProject: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_PROJECT, { documentId });
      return { data: response.deleteProjectResearch };
    } catch (error) {
      throw error;
    }
  }
};

/**
 * GraphQL Funding API - Replacement for REST-based funding API
 */
export const fundingAPIGraphQL = {
  /**
   * Get all fundings
   * GraphQL equivalent of: GET /project-fundings
   */
  getFundings: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_FUNDINGS, variables);
      return { data: response.projectFundings || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's fundings
   */
  getMyFundings: async (params = {}) => {
    try {
      const userId = await getCurrentUserId();
      const response = await graphqlAPI.query(GET_FUNDINGS_BY_USER, { 
        userId: userId.toString() 
      });
      return { data: response.projectFundings || [] };
    } catch (error) {
      try {
        // Fallback: get all fundings without filtering
        const response = await graphqlAPI.query(GET_FUNDINGS, params);
        return { data: response.projectFundings || [] };
      } catch (e) {
        throw error;
      }
    }
  },

  /**
   * Get single funding
   * GraphQL equivalent of: GET /project-fundings/{id}?populate=*
   */
  getFunding: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_FUNDING, { documentId });
      return { data: response.projectFunding };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create funding
   * GraphQL equivalent of: POST /project-fundings
   */
  createFunding: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_FUNDING, { data });
      return { data: response.createProjectFunding };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update funding
   * GraphQL equivalent of: PUT /project-fundings/{id}
   */
  updateFunding: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_FUNDING, {
        documentId,
        data
      });
      return { data: response.updateProjectFunding };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete funding
   * GraphQL equivalent of: DELETE /project-fundings/{id}
   */
  deleteFunding: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_FUNDING, { documentId });
      return { data: response.deleteProjectFunding };
    } catch (error) {
      throw error;
    }
  }
};

// Export with backward compatibility
export const projectAPI = projectAPIGraphQL;
export const fundingAPI = fundingAPIGraphQL;