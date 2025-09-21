import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_PROJECT_RESEARCHES,
  GET_PROJECT_FUNDINGS,
  GET_WORK_PUBLICATIONS,
  GET_WORK_CONFERENCES,
  GET_WORK_BOOKS,
  GET_IMPACTS,
  GET_ALL_USERS_FOR_DASHBOARD,
} from '@/lib/graphql/queries'
import {
  normalizeProjectResearchCollection,
  normalizeProjectFundingCollection,
  normalizeWorksCollection,
  normalizeLookupCollection,
} from '@/lib/graphql/transformers'

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
      // Use GraphQL to get all users and aggregate by academic_type
      const filters = departmentId ? {
        department: { documentId: { eq: departmentId } }
      } : {}
      
      const result = await executeGraphQL({
        query: GET_ALL_USERS_FOR_DASHBOARD,
        variables: { 
          filters,
          pagination: { limit: 1000 } // Get all users for aggregation
        },
      })
      
      const users = result?.usersPermissionsUsers?.data || []
      
      // Aggregate by academic_type
      const personnelByType = {}
      users.forEach(user => {
        const academicType = user.attributes?.academic_type?.data?.attributes?.name || 'ไม่ระบุ'
        personnelByType[academicType] = (personnelByType[academicType] || 0) + 1
      })
      
      return personnelByType
    } catch (error) { 
      console.warn('Failed to get personnel by academic type:', error)
      return {} 
    }
  },

  getResearchStatsByTypes: async (departmentId = null) => {
    try {
      // Use GraphQL to get research data and aggregate by types
      const filters = departmentId ? {
        research_partners: {
          users_permissions_user: {
            department: { documentId: { eq: departmentId } }
          }
        }
      } : {}
      
      const [projectsResult, fundingsResult, publicationsResult, conferencesResult, booksResult] = await Promise.all([
        executeGraphQL({ query: GET_PROJECT_RESEARCHES, variables: { filters } }),
        executeGraphQL({ query: GET_PROJECT_FUNDINGS, variables: { filters } }),
        executeGraphQL({ query: GET_WORK_PUBLICATIONS, variables: { filters } }),
        executeGraphQL({ query: GET_WORK_CONFERENCES, variables: { filters } }),
        executeGraphQL({ query: GET_WORK_BOOKS, variables: { filters } }),
      ])

      return {
        icTypes: normalizeProjectResearchCollection(projectsResult?.projectResearches)?.data || [],
        impacts: normalizeProjectFundingCollection(fundingsResult?.projectFundings)?.data || [],
        sdgs: [...(normalizeWorksCollection(publicationsResult?.workPublications)?.data || []),
               ...(normalizeWorksCollection(conferencesResult?.workConferences)?.data || []),
               ...(normalizeWorksCollection(booksResult?.workBooks)?.data || [])]
      }
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
      // Use GraphQL to get impacts data filtered by department if needed
      const result = await executeGraphQL({
        query: GET_IMPACTS,
        variables: {},
      })
      
      const impacts = normalizeLookupCollection(result?.impacts)?.data || []
      
      // If department filtering is needed, we would need to join with user/department data
      // For now, return all impacts as the REST endpoint behavior is unclear
      return { data: impacts }
    } catch (error) {
      console.warn('Failed to get impacts by department via GraphQL:', error)
      return { data: [] }
    }
  }
}
