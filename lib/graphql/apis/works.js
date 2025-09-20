// GraphQL Works API implementation for Strapi v5
import { graphqlAPI } from '../api.js';
import { getDocumentId } from '../../../utils/strapi/index.js';
import {
  GET_BOOKS,
  GET_BOOKS_BY_USER,
  GET_BOOK,
  CREATE_BOOK,
  UPDATE_BOOK,
  DELETE_BOOK,
  GET_CONFERENCES,
  GET_CONFERENCES_BY_USER,
  GET_CONFERENCES_BY_PROJECT_PARTICIPATION,
  GET_CONFERENCE,
  CREATE_CONFERENCE,
  UPDATE_CONFERENCE,
  DELETE_CONFERENCE,
  GET_PUBLICATIONS,
  GET_PUBLICATIONS_BY_USER,
  GET_PUBLICATION,
  CREATE_PUBLICATION,
  UPDATE_PUBLICATION,
  DELETE_PUBLICATION,
  GET_CURRENT_USER
} from '../queries/works.js';

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
 * GraphQL Works API - Replacement for REST-based works API
 * Handles Books, Conferences, and Publications
 */
export const worksAPIGraphQL = {
  // ===== BOOK OPERATIONS =====

  /**
   * Get all books
   * GraphQL equivalent of: GET /work-books
   */
  getBooks: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_BOOKS, variables);
      return { data: response.workBooks || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's books
   */
  getMyBooks: async (params = {}) => {
    try {
      const userId = await getCurrentUserId();
      const response = await graphqlAPI.query(GET_BOOKS_BY_USER, { 
        userId: userId.toString() 
      });
      return { data: response.workBooks || [] };
    } catch (error) {
      try {
        // Fallback: get all books without filtering
        const response = await graphqlAPI.query(GET_BOOKS, params);
        return { data: response.workBooks || [] };
      } catch (e) {
        throw error;
      }
    }
  },

  /**
   * Get single book
   * GraphQL equivalent of: GET /work-books/{id}?populate=*
   */
  getBook: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_BOOK, { documentId });
      return { data: response.workBook };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create book
   * GraphQL equivalent of: POST /work-books
   */
  createBook: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_BOOK, { data });
      return { data: response.createWorkBook };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update book
   * GraphQL equivalent of: PUT /work-books/{id}
   */
  updateBook: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_BOOK, {
        documentId,
        data
      });
      return { data: response.updateWorkBook };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete book
   * GraphQL equivalent of: DELETE /work-books/{id}
   */
  deleteBook: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_BOOK, { documentId });
      return { data: response.deleteWorkBook };
    } catch (error) {
      throw error;
    }
  },

  // ===== CONFERENCE OPERATIONS =====

  /**
   * Get all conferences
   * GraphQL equivalent of: GET /work-conferences
   */
  getConferences: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_CONFERENCES, variables);
      return { data: response.workConferences || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's conferences
   * Includes both direct presentation and project participation
   */
  getMyConferences: async (params = {}) => {
    try {
      const userId = await getCurrentUserId();
      
      // First try to get conferences by project participation
      try {
        const response = await graphqlAPI.query(GET_CONFERENCES_BY_PROJECT_PARTICIPATION, { 
          userId: userId.toString() 
        });
        return { data: response.workConferences || [] };
      } catch (projectError) {
        // Fallback to direct presenter relation
        try {
          const response = await graphqlAPI.query(GET_CONFERENCES_BY_USER, { 
            userId: userId.toString() 
          });
          return { data: response.workConferences || [] };
        } catch (presenterError) {
          // Final fallback: get all conferences without filtering
          const response = await graphqlAPI.query(GET_CONFERENCES, params);
          return { data: response.workConferences || [] };
        }
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single conference
   * GraphQL equivalent of: GET /work-conferences/{id}?populate=*
   */
  getConference: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_CONFERENCE, { documentId });
      return { data: response.workConference };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create conference
   * GraphQL equivalent of: POST /work-conferences
   */
  createConference: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_CONFERENCE, { data });
      return { data: response.createWorkConference };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update conference
   * GraphQL equivalent of: PUT /work-conferences/{id}
   */
  updateConference: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_CONFERENCE, {
        documentId,
        data
      });
      return { data: response.updateWorkConference };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete conference
   * GraphQL equivalent of: DELETE /work-conferences/{id}
   */
  deleteConference: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_CONFERENCE, { documentId });
      return { data: response.deleteWorkConference };
    } catch (error) {
      throw error;
    }
  },

  // ===== PUBLICATION OPERATIONS =====

  /**
   * Get all publications
   * GraphQL equivalent of: GET /work-publications
   */
  getPublications: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        sort: params.sort || [],
        pagination: params.pagination || {},
        locale: params.locale || null
      };

      const response = await graphqlAPI.query(GET_PUBLICATIONS, variables);
      return { data: response.workPublications || [] };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's publications
   */
  getMyPublications: async (params = {}) => {
    try {
      const userId = await getCurrentUserId();
      const response = await graphqlAPI.query(GET_PUBLICATIONS_BY_USER, { 
        userId: userId.toString() 
      });
      return { data: response.workPublications || [] };
    } catch (error) {
      try {
        // Fallback: get all publications without filtering
        const response = await graphqlAPI.query(GET_PUBLICATIONS, params);
        return { data: response.workPublications || [] };
      } catch (e) {
        throw error;
      }
    }
  },

  /**
   * Get single publication
   * GraphQL equivalent of: GET /work-publications/{id}?populate=*
   */
  getPublication: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.query(GET_PUBLICATION, { documentId });
      return { data: response.workPublication };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create publication
   * GraphQL equivalent of: POST /work-publications
   */
  createPublication: async (data) => {
    try {
      const response = await graphqlAPI.mutate(CREATE_PUBLICATION, { data });
      return { data: response.createWorkPublication };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update publication
   * GraphQL equivalent of: PUT /work-publications/{id}
   */
  updatePublication: async (id, data) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(UPDATE_PUBLICATION, {
        documentId,
        data
      });
      return { data: response.updateWorkPublication };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete publication
   * GraphQL equivalent of: DELETE /work-publications/{id}
   */
  deletePublication: async (id) => {
    try {
      const documentId = getDocumentId(id);
      const response = await graphqlAPI.mutate(DELETE_PUBLICATION, { documentId });
      return { data: response.deleteWorkPublication };
    } catch (error) {
      throw error;
    }
  }
};

// Export with backward compatibility
export const worksAPI = worksAPIGraphQL;