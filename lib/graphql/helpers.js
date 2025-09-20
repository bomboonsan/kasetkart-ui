// Helper utilities for using GraphQL with SWR
import { default as useSWR } from 'swr' // Use explicit default import
import { executeGraphQL } from './client'

/**
 * SWR fetcher function for GraphQL queries
 * @param {Object} options - Query options
 * @param {string} options.query - GraphQL query string
 * @param {Object} options.variables - Query variables
 * @returns {Promise} Query result
 */
export const graphqlFetcher = async ({ query, variables = {} }) => {
  return executeGraphQL(query, variables)
}

/**
 * Create a GraphQL key for SWR caching
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Query variables
 * @returns {Object} SWR key object
 */
export const createGraphQLKey = (query, variables = {}) => {
  return { query, variables }
}

/**
 * Helper to wrap GraphQL API calls to maintain REST API response format
 * This helps with backward compatibility during migration
 * @param {Function} graphqlCall - GraphQL API call function
 * @returns {Function} Wrapped function that returns REST-like response
 */
export const wrapGraphQLResponse = (graphqlCall) => {
  return async (...args) => {
    try {
      const result = await graphqlCall(...args)
      
      // If result already has data property, return as-is (already wrapped)
      if (result && typeof result === 'object' && 'data' in result) {
        return result
      }
      
      // Otherwise wrap in data property for REST compatibility
      return { data: result }
    } catch (error) {
      throw error
    }
  }
}

/**
 * Create a GraphQL-compatible SWR hook
 * @param {string} key - SWR key
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @param {Object} options - SWR options
 */
export const useGraphQLSWR = (key, query, variables = {}, options = {}) => {
  const swrKey = key ? createGraphQLKey(query, variables) : null
  
  return useSWR(
    swrKey,
    graphqlFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...options
    }
  )
}

// Re-export for convenience
export { executeGraphQL } from './client'