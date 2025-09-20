import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_PROJECT_RESEARCHES,
  GET_PROJECT_FUNDINGS,
  GET_WORK_PUBLICATIONS,
  GET_WORK_CONFERENCES,
  GET_WORK_BOOKS,
  GET_IMPACTS,
} from '@/lib/graphql/queries'
import {
  normalizeProjectResearchCollection,
  normalizeProjectFundingCollection,
  normalizeWorksCollection,
  normalizeLookupCollection,
} from '@/lib/graphql/transformers'
import { STRAPI_REST_ENDPOINT } from '@/lib/config/api'
import { tokenManager } from '@/lib/auth/token-manager'

// Fallback to REST for complex dashboard operations that may not have GraphQL equivalents
async function dashboardRestFetch(path, { method = 'GET', headers = {}, body } = {}) {
  let token = typeof window === 'undefined'
    ? process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null
    : tokenManager.getToken()

  if (!token && typeof window !== 'undefined') {
    try {
      token = await tokenManager.getSessionToken()
    } catch (error) {
      token = null
    }
  }

  const response = await fetch(`${STRAPI_REST_ENDPOINT}${path}`, {
    method,
    headers: {
      ...(method !== 'GET' && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData
      ? body
      : body
        ? JSON.stringify(body)
        : undefined,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `HTTP ${response.status}`)
  }

  const text = await response.text().catch(() => '')
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}

export const dashboardAPI = {
  getStats: async () => {
    try {
      // Use GraphQL for basic data fetching
      const [
        projectsResult,
        fundingsResult,
        publicationsResult,
        conferencesResult,
        booksResult,
      ] = await Promise.all([
        executeGraphQL({ query: GET_PROJECT_RESEARCHES, variables: {} }),
        executeGraphQL({ query: GET_PROJECT_FUNDINGS, variables: {} }),
        executeGraphQL({ query: GET_WORK_PUBLICATIONS, variables: {} }),
        executeGraphQL({ query: GET_WORK_CONFERENCES, variables: {} }),
        executeGraphQL({ query: GET_WORK_BOOKS, variables: {} }),
      ])

      return [
        normalizeProjectResearchCollection(projectsResult?.projectResearches),
        normalizeProjectFundingCollection(fundingsResult?.projectFundings),
        normalizeWorksCollection(publicationsResult?.workPublications, 'publications'),
        normalizeWorksCollection(conferencesResult?.workConferences, 'conferences'),
        normalizeWorksCollection(booksResult?.workBooks, 'books'),
      ]
    } catch (error) {
      console.warn('Failed to get stats via GraphQL, falling back to empty data:', error)
      return [
        { data: [], meta: null },
        { data: [], meta: null },
        { data: [], meta: null },
        { data: [], meta: null },
        { data: [], meta: null },
      ]
    }
  },

  getPersonnelByAcademicType: async (departmentId = null) => {
    try {
      // This is likely a custom dashboard endpoint that may not have GraphQL equivalent
      // Keep using REST for now
      const params = departmentId ? `?departmentId=${departmentId}` : ''
      const response = await dashboardRestFetch(`/dashboard/personnel-by-academic-type${params}`)
      return response?.data || response || {}
    } catch (error) { 
      console.warn('Failed to get personnel by academic type:', error)
      return {} 
    }
  },

  getResearchStatsByTypes: async (departmentId = null) => {
    try {
      // This is likely a custom dashboard endpoint that may not have GraphQL equivalent
      // Keep using REST for now
      const params = departmentId ? `?departmentId=${departmentId}` : ''
      const response = await dashboardRestFetch(`/dashboard/research-stats-by-types${params}`)
      return response?.data || response || { icTypes: [], impacts: [], sdgs: [] }
    } catch (error) { 
      console.warn('Failed to get research stats by types:', error)
      return { icTypes: [], impacts: [], sdgs: [] } 
    }
  }
}

export const reportAPI = {
  getImpacts: async (params = {}) => {
    try {
      // Use GraphQL for impacts
      const result = await executeGraphQL({
        query: GET_IMPACTS,
        variables: {},
      })
      return normalizeLookupCollection(result?.impacts)
    } catch (error) {
      console.warn('Failed to get impacts via GraphQL:', error)
      return { data: [], meta: null }
    }
  },

  getImpactsByDepartment: async (params = {}) => {
    try {
      // This is likely a custom report endpoint that may not have GraphQL equivalent
      // Keep using REST for now
      const response = await dashboardRestFetch('/reports/impacts-by-department', { 
        method: 'GET',
        body: Object.keys(params).length ? JSON.stringify(params) : undefined,
      })
      return response || { data: [] }
    } catch (error) {
      console.warn('Failed to get impacts by department:', error)
      return { data: [] }
    }
  }
}
