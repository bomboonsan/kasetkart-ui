// Base GraphQL API utility for Strapi v5
import graphqlClient from './client.js';
import { GraphQLErrorHandler } from './error-handler.js';
import { buildQuery, buildSingleQuery, buildCreateMutation, buildUpdateMutation, buildDeleteMutation, buildFilters, buildSort } from './query-builder.js';

/**
 * Base GraphQL API class for Strapi operations
 */
export class GraphQLAPI {
  constructor(entityName) {
    this.entityName = entityName;
    this.client = graphqlClient;
  }

  /**
   * Execute GraphQL query with error handling
   */
  async executeQuery(query, variables = {}, context = {}) {
    try {
      const response = await this.client.query(query, variables);
      return response;
    } catch (error) {
      const processedError = GraphQLErrorHandler.processGraphQLErrors(
        error.response?.errors || [error]
      );
      
      // Log error for debugging
      GraphQLErrorHandler.logError(error, { 
        query, 
        variables, 
        context,
        entityName: this.entityName 
      });
      
      throw {
        ...processedError,
        userMessage: GraphQLErrorHandler.formatUserMessage(processedError, context)
      };
    }
  }

  /**
   * Execute GraphQL mutation with error handling
   */
  async executeMutation(mutation, variables = {}, context = {}) {
    try {
      const response = await this.client.mutate(mutation, variables);
      return response;
    } catch (error) {
      const processedError = GraphQLErrorHandler.processGraphQLErrors(
        error.response?.errors || [error]
      );
      
      // Log error for debugging
      GraphQLErrorHandler.logError(error, { 
        mutation, 
        variables, 
        context,
        entityName: this.entityName 
      });
      
      throw {
        ...processedError,
        userMessage: GraphQLErrorHandler.formatUserMessage(processedError, context)
      };
    }
  }

  /**
   * Find multiple documents
   */
  async find(options = {}) {
    const {
      filters = {},
      sort = [],
      pagination = {},
      populate = {},
      fields = null,
      locale = null
    } = options;

    const query = buildQuery(this.entityName, {
      fields: fields || this.getDefaultFields(),
      filters: buildFilters(filters),
      sort: buildSort(sort),
      pagination,
      populate,
      locale
    });

    const variables = {
      ...(Object.keys(filters).length > 0 && { filters: buildFilters(filters) }),
      ...(sort.length > 0 && { sort: buildSort(sort) }),
      ...(Object.keys(pagination).length > 0 && { pagination }),
      ...(locale && { locale })
    };

    const response = await this.executeQuery(query, variables, { 
      operation: 'fetch',
      entityName: this.entityName 
    });

    const entityNamePlural = this.pluralize(this.entityName);
    return response[entityNamePlural] || [];
  }

  /**
   * Find single document by documentId
   */
  async findOne(documentId, options = {}) {
    const {
      populate = {},
      fields = null,
      locale = null
    } = options;

    const query = buildSingleQuery(this.entityName, {
      fields: fields || this.getDefaultFields(),
      populate,
      locale
    });

    const variables = {
      documentId,
      ...(locale && { locale })
    };

    const response = await this.executeQuery(query, variables, { 
      operation: 'fetch',
      entityName: this.entityName 
    });

    return response[this.entityName] || null;
  }

  /**
   * Create new document
   */
  async create(data, options = {}) {
    const {
      populate = {},
      returnFields = null,
      locale = null
    } = options;

    const mutation = buildCreateMutation(this.entityName, {
      returnFields: returnFields || this.getDefaultFields(),
      populate,
      locale
    });

    const variables = {
      data,
      ...(locale && { locale })
    };

    const response = await this.executeMutation(mutation, variables, { 
      operation: 'create',
      entityName: this.entityName 
    });

    const createMethodName = `create${this.capitalize(this.entityName)}`;
    return response[createMethodName] || null;
  }

  /**
   * Update existing document
   */
  async update(documentId, data, options = {}) {
    const {
      populate = {},
      returnFields = null,
      locale = null
    } = options;

    const mutation = buildUpdateMutation(this.entityName, {
      returnFields: returnFields || this.getDefaultFields(),
      populate,
      locale
    });

    const variables = {
      documentId,
      data,
      ...(locale && { locale })
    };

    const response = await this.executeMutation(mutation, variables, { 
      operation: 'update',
      entityName: this.entityName 
    });

    const updateMethodName = `update${this.capitalize(this.entityName)}`;
    return response[updateMethodName] || null;
  }

  /**
   * Delete document
   */
  async delete(documentId, options = {}) {
    const {
      locale = null
    } = options;

    const mutation = buildDeleteMutation(this.entityName, {
      locale
    });

    const variables = {
      documentId,
      ...(locale && { locale })
    };

    const response = await this.executeMutation(mutation, variables, { 
      operation: 'delete',
      entityName: this.entityName 
    });

    const deleteMethodName = `delete${this.capitalize(this.entityName)}`;
    return response[deleteMethodName] || null;
  }

  /**
   * Count documents
   */
  async count(filters = {}) {
    const query = `
      query Count${this.capitalize(this.pluralize(this.entityName))}($filters: ${this.capitalize(this.entityName)}FiltersInput) {
        ${this.pluralize(this.entityName)}(filters: $filters) {
          meta {
            pagination {
              total
            }
          }
        }
      }
    `;

    const variables = Object.keys(filters).length > 0 ? { filters: buildFilters(filters) } : {};

    const response = await this.executeQuery(query, variables, { 
      operation: 'count',
      entityName: this.entityName 
    });

    const entityNamePlural = this.pluralize(this.entityName);
    return response[entityNamePlural]?.meta?.pagination?.total || 0;
  }

  /**
   * Get default fields for the entity
   * Override in subclasses to customize default fields
   */
  getDefaultFields() {
    return [
      'id',
      'documentId',
      'createdAt',
      'updatedAt',
      'publishedAt',
      'locale'
    ];
  }

  /**
   * Utility methods
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  pluralize(str) {
    // Simple pluralization - can be enhanced
    if (str.endsWith('y')) {
      return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch')) {
      return str + 'es';
    }
    return str + 's';
  }
}

/**
 * Create GraphQL API instance for specific entity
 */
export function createGraphQLAPI(entityName) {
  return new GraphQLAPI(entityName);
}

/**
 * Generic GraphQL operations without entity binding
 */
export const graphqlAPI = {
  /**
   * Execute custom query
   */
  async query(query, variables = {}) {
    try {
      return await graphqlClient.query(query, variables);
    } catch (error) {
      const processedError = GraphQLErrorHandler.processGraphQLErrors(
        error.response?.errors || [error]
      );
      throw {
        ...processedError,
        userMessage: GraphQLErrorHandler.formatUserMessage(processedError)
      };
    }
  },

  /**
   * Execute custom mutation
   */
  async mutate(mutation, variables = {}) {
    try {
      return await graphqlClient.mutate(mutation, variables);
    } catch (error) {
      const processedError = GraphQLErrorHandler.processGraphQLErrors(
        error.response?.errors || [error]
      );
      throw {
        ...processedError,
        userMessage: GraphQLErrorHandler.formatUserMessage(processedError)
      };
    }
  },

  /**
   * Update authentication token
   */
  setAuthToken(token) {
    graphqlClient.updateAuthToken(token);
  },

  /**
   * Set custom headers
   */
  setHeaders(headers) {
    graphqlClient.setHeaders(headers);
  }
};

export default GraphQLAPI;