// GraphQL Lookup API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import { getDocumentId } from '../../../utils/strapi/index.js';
import {
  GET_ORGANIZATIONS,
  GET_FACULTIES,
  GET_DEPARTMENTS,
  GET_ACADEMIC_TYPES,
  GET_EDUCATION_LEVELS,
  GET_PARTICIPATION_TYPES,
  GET_USER_EDUCATIONS,
  CREATE_EDUCATION,
  UPDATE_EDUCATION,
  DELETE_EDUCATION,
  GET_IC_TYPES,
  GET_IMPACTS,
  GET_SDGS
} from '../queries/lookup.js';

/**
 * GraphQL Organization API - Replacement for REST-based orgAPI
 */
export const orgAPIGraphQL = {
  /**
   * Get all organizations
   * GraphQL equivalent of: GET /organizations
   */
  getOrganizations: async () => {
    try {
      const response = await graphqlAPI.query(GET_ORGANIZATIONS, {});
      return { data: response.organizations || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all faculties
   * GraphQL equivalent of: GET /faculties
   */
  getFaculties: async () => {
    try {
      const response = await graphqlAPI.query(GET_FACULTIES, {});
      return { data: response.faculties || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all departments
   * GraphQL equivalent of: GET /departments
   */
  getDepartments: async () => {
    try {
      const response = await graphqlAPI.query(GET_DEPARTMENTS, {});
      return { data: response.departments || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all academic types
   * GraphQL equivalent of: GET /academic-types
   */
  getAcademicTypes: async () => {
    try {
      const response = await graphqlAPI.query(GET_ACADEMIC_TYPES, {});
      return { data: response.academicTypes || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get education levels
   * GraphQL equivalent of: GET /education-levels
   */
  getEducationLevels: async () => {
    try {
      const response = await graphqlAPI.query(GET_EDUCATION_LEVELS, {});
      return { data: response.educations || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get academic types (alias for getAcademicTypes)
   */
  getAcademicType: async () => {
    return orgAPIGraphQL.getAcademicTypes();
  },

  /**
   * Get participation types
   * GraphQL equivalent of: GET /participation-types
   */
  getParticipationTypes: async () => {
    try {
      const response = await graphqlAPI.query(GET_PARTICIPATION_TYPES, {});
      return { data: response.participationTypes || [] };
    } catch (error) {
      throw error;
    }
  }
};

/**
 * GraphQL Education API - Replacement for REST-based eduAPI
 */
export const eduAPIGraphQL = {
  /**
   * List user's educations
   * GraphQL equivalent of: GET /educations?filters[users_permissions_user][id][$eq]={userId}&populate=education_level
   */
  listMine: async (userId) => {
    try {
      const response = await graphqlAPI.query(GET_USER_EDUCATIONS, { 
        userId: userId.toString() 
      });
      return { data: response.educations || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create education
   * GraphQL equivalent of: POST /educations
   */
  create: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_EDUCATION, { data });
      return { data: response.createEducation };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update education
   * GraphQL equivalent of: PUT /educations/{documentId}
   */
  update: async (documentId, data) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(UPDATE_EDUCATION, {
        documentId: id,
        data
      });
      return { data: response.updateEducation };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete education
   * GraphQL equivalent of: DELETE /educations/{documentId}
   */
  remove: async (documentId) => {
    try {
      const id = getDocumentId(documentId);
      const response = await graphqlAPI.mutate(DELETE_EDUCATION, {
        documentId: id
      });
      return { data: response.deleteEducation };
    } catch (error) {
      throw error;
    }
  }
};

/**
 * GraphQL ValueFrom API - Replacement for REST-based valueFromAPI
 */
export const valueFromAPIGraphQL = {
  /**
   * Get departments (alias for orgAPI.getDepartments)
   * GraphQL equivalent of: GET /departments
   */
  getDepartments: async () => {
    try {
      const response = await graphqlAPI.query(GET_DEPARTMENTS, {});
      return { data: response.departments || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get IC types
   * GraphQL equivalent of: GET /ic-types
   */
  getIcTypes: async () => {
    try {
      const response = await graphqlAPI.query(GET_IC_TYPES, {});
      return { data: response.icTypes || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get impacts
   * GraphQL equivalent of: GET /impacts
   */
  getImpacts: async () => {
    try {
      const response = await graphqlAPI.query(GET_IMPACTS, {});
      return { data: response.impacts || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get SDGs
   * GraphQL equivalent of: GET /sdgs
   */
  getSDGs: async () => {
    try {
      const response = await graphqlAPI.query(GET_SDGS, {});
      return { data: response.sdgs || [] };
    } catch (error) {
      throw error;
    }
  }
};

// Export with backward compatibility
export const orgAPI = orgAPIGraphQL;
export const eduAPI = eduAPIGraphQL;
export const valueFromAPI = valueFromAPIGraphQL;