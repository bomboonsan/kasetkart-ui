// GraphQL client configuration for Strapi
import { GraphQLClient } from 'graphql-request'
import { tokenManager } from '@/lib/auth/token-manager'
import { API_BASE } from '@/lib/config/api'

// GraphQL endpoint - Strapi GraphQL plugin endpoint
const GRAPHQL_ENDPOINT = API_BASE.replace('/api', '/graphql')

// Create GraphQL client with dynamic headers
const createClient = () => {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: () => {
      const token = tokenManager.getToken()
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    },
  })
}

// Export singleton client instance
export const graphqlClient = createClient()

// Helper function to execute GraphQL requests with error handling
export async function executeGraphQL(query, variables = {}) {
  try {
    return await graphqlClient.request(query, variables)
  } catch (error) {
    console.error('GraphQL Error:', error)
    throw error
  }
}

export { GRAPHQL_ENDPOINT }