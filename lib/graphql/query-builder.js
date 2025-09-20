// GraphQL Query Builder for Strapi v5

/**
 * Build GraphQL query for fetching multiple documents
 */
export function buildQuery(entityName, options = {}) {
  const {
    fields = ['id', 'documentId'],
    filters = {},
    sort = [],
    pagination = {},
    populate = {},
    locale = null
  } = options;

  const entityNamePlural = pluralize(entityName);
  const fieldsString = Array.isArray(fields) ? fields.join('\n    ') : fields;
  
  // Build filters
  const filtersString = Object.keys(filters).length > 0 
    ? `filters: ${JSON.stringify(filters).replace(/"/g, '')}`
    : '';

  // Build sort
  const sortString = sort.length > 0 
    ? `sort: [${sort.map(s => `"${s}"`).join(', ')}]`
    : '';

  // Build pagination
  const paginationParts = [];
  if (pagination.page) paginationParts.push(`page: ${pagination.page}`);
  if (pagination.pageSize) paginationParts.push(`pageSize: ${pagination.pageSize}`);
  const paginationString = paginationParts.length > 0 
    ? paginationParts.join(', ')
    : '';

  // Build populate (for Strapi v5, populate is handled in field selection)
  const populateFields = buildPopulateFields(populate);

  // Build locale
  const localeString = locale ? `locale: "${locale}"` : '';

  // Combine all parameters
  const params = [filtersString, sortString, paginationString, localeString]
    .filter(Boolean)
    .join(', ');

  return `
    query Get${capitalize(entityNamePlural)}${params ? `($filters: ${capitalize(entityName)}FiltersInput, $sort: [String], $pagination: PaginationArg, $locale: I18NLocaleCode)` : ''} {
      ${entityNamePlural}${params ? `(${params})` : ''} {
        ${fieldsString}
        ${populateFields}
      }
    }
  `;
}

/**
 * Build GraphQL query for fetching single document
 */
export function buildSingleQuery(entityName, options = {}) {
  const {
    fields = ['id', 'documentId'],
    populate = {},
    locale = null
  } = options;

  const fieldsString = Array.isArray(fields) ? fields.join('\n    ') : fields;
  const populateFields = buildPopulateFields(populate);
  const localeString = locale ? `, locale: "${locale}"` : '';

  return `
    query Get${capitalize(entityName)}($documentId: ID!${locale ? ', $locale: I18NLocaleCode' : ''}) {
      ${entityName}(documentId: $documentId${localeString}) {
        ${fieldsString}
        ${populateFields}
      }
    }
  `;
}

/**
 * Build GraphQL mutation for creating document
 */
export function buildCreateMutation(entityName, options = {}) {
  const {
    returnFields = ['id', 'documentId'],
    populate = {},
    locale = null
  } = options;

  const fieldsString = Array.isArray(returnFields) ? returnFields.join('\n    ') : returnFields;
  const populateFields = buildPopulateFields(populate);
  const localeString = locale ? `, locale: "${locale}"` : '';

  return `
    mutation Create${capitalize(entityName)}($data: ${capitalize(entityName)}Input!${locale ? ', $locale: I18NLocaleCode' : ''}) {
      create${capitalize(entityName)}(data: $data${localeString}) {
        ${fieldsString}
        ${populateFields}
      }
    }
  `;
}

/**
 * Build GraphQL mutation for updating document
 */
export function buildUpdateMutation(entityName, options = {}) {
  const {
    returnFields = ['id', 'documentId'],
    populate = {},
    locale = null
  } = options;

  const fieldsString = Array.isArray(returnFields) ? returnFields.join('\n    ') : returnFields;
  const populateFields = buildPopulateFields(populate);
  const localeString = locale ? `, locale: "${locale}"` : '';

  return `
    mutation Update${capitalize(entityName)}($documentId: ID!, $data: ${capitalize(entityName)}Input!${locale ? ', $locale: I18NLocaleCode' : ''}) {
      update${capitalize(entityName)}(documentId: $documentId, data: $data${localeString}) {
        ${fieldsString}
        ${populateFields}
      }
    }
  `;
}

/**
 * Build GraphQL mutation for deleting document
 */
export function buildDeleteMutation(entityName, options = {}) {
  const {
    locale = null
  } = options;

  const localeString = locale ? `, locale: "${locale}"` : '';

  return `
    mutation Delete${capitalize(entityName)}($documentId: ID!${locale ? ', $locale: I18NLocaleCode' : ''}) {
      delete${capitalize(entityName)}(documentId: $documentId${localeString}) {
        documentId
      }
    }
  `;
}

/**
 * Build populate fields based on populate object
 */
function buildPopulateFields(populate) {
  if (!populate || Object.keys(populate).length === 0) {
    return '';
  }

  return Object.entries(populate)
    .map(([field, config]) => {
      if (config === true || config === '*') {
        return field;
      }
      
      if (typeof config === 'object' && config.populate) {
        const nestedFields = buildPopulateFields(config.populate);
        return `${field} {\n      ${nestedFields}\n    }`;
      }
      
      if (Array.isArray(config)) {
        return `${field} {\n      ${config.join('\n      ')}\n    }`;
      }
      
      return field;
    })
    .join('\n    ');
}

/**
 * Utility functions
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(str) {
  // Simple pluralization - can be enhanced
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch')) {
    return str + 'es';
  }
  return str + 's';
}

/**
 * Build filters for GraphQL queries
 */
export function buildFilters(conditions) {
  const filters = {};
  
  Object.entries(conditions).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    
    // Handle different filter types
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Complex filter (e.g., { eq: 'value' }, { contains: 'text' })
      filters[key] = value;
    } else if (Array.isArray(value)) {
      // Array filter (e.g., in: [1, 2, 3])
      filters[key] = { in: value };
    } else {
      // Simple equality filter
      filters[key] = { eq: value };
    }
  });
  
  return filters;
}

/**
 * Build sort array for GraphQL queries
 */
export function buildSort(sortConfig) {
  if (!sortConfig) return [];
  
  if (typeof sortConfig === 'string') {
    return [sortConfig];
  }
  
  if (Array.isArray(sortConfig)) {
    return sortConfig;
  }
  
  if (typeof sortConfig === 'object') {
    return Object.entries(sortConfig).map(([field, direction]) => 
      direction === 'desc' ? `${field}:desc` : field
    );
  }
  
  return [];
}

/**
 * Pre-built queries for common operations
 */
export const CommonQueries = {
  // User with profile and role
  getUserWithProfile: `
    query GetUserWithProfile($documentId: ID!) {
      usersPermissionsUser(documentId: $documentId) {
        id
        documentId
        username
        email
        confirmed
        blocked
        profile {
          id
          documentId
          firstNameTH
          lastNameTH
          firstNameEN
          lastNameEN
          academicPosition
          avatarUrl {
            id
            url
            alternativeText
          }
        }
        role {
          id
          name
          type
        }
        organization {
          id
          documentId
          name
        }
        faculty {
          id
          documentId
          name
        }
        department {
          id
          documentId
          name
        }
      }
    }
  `,

  // Current user (me) with full profile
  getCurrentUser: `
    query GetCurrentUser {
      me {
        id
        documentId
        username
        email
        confirmed
        blocked
        profile {
          id
          documentId
          firstNameTH
          lastNameTH
          firstNameEN
          lastNameEN
          academicPosition
          phoneNumber
          lineId
          avatarUrl {
            id
            url
            alternativeText
          }
        }
        role {
          id
          name
          type
        }
        organization {
          id
          documentId
          name
        }
        faculty {
          id
          documentId
          name
        }
        department {
          id
          documentId
          name
        }
      }
    }
  `
};