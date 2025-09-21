import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_PROJECT_RESEARCHES,
  GET_PROJECT_RESEARCH_BY_ID,
  GET_PROJECT_RESEARCH_BY_DOCUMENT_ID,
  GET_PROJECT_PARTNERS,
  GET_PROJECT_FUNDINGS,
  GET_PROJECT_FUNDING_BY_ID,
  GET_PROJECT_FUNDING_BY_DOCUMENT_ID,
} from '@/lib/graphql/queries'
import {
  CREATE_PROJECT_RESEARCH_MUTATION,
  UPDATE_PROJECT_RESEARCH_MUTATION,
  DELETE_PROJECT_RESEARCH_MUTATION,
  CREATE_PROJECT_PARTNER_MUTATION,
  UPDATE_PROJECT_PARTNER_MUTATION,
  DELETE_PROJECT_PARTNER_MUTATION,
  CREATE_PROJECT_FUNDING_MUTATION,
  UPDATE_PROJECT_FUNDING_MUTATION,
  DELETE_PROJECT_FUNDING_MUTATION,
} from '@/lib/graphql/mutations'
import {
  normalizeProjectResearchCollection,
  normalizeProjectResearch,
  normalizeProjectPartner,
  normalizeProjectFundingCollection,
  normalizeProjectFunding,
  normalizeCollection,
} from '@/lib/graphql/transformers'
import { restParamsToGraphQLArgs } from '@/lib/graphql/param-utils'
import { 
  getCurrentUserId, 
  filterProjectsByUserId, 
  filterItemsByUserId,
  buildUserFilterParams 
} from './shared-utils'
import { getDocumentId, stripUndefined } from '@/utils/strapi'

function wrapData(data) {
  return data === null || data === undefined ? null : { data }
}

export const projectAPI = {
  getProjects: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_PROJECT_RESEARCHES,
      variables: { filters, pagination },
    })
    return normalizeProjectResearchCollection(result?.projectResearches)
  },
  
  getMyProjects: async () => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('User not authenticated')
      
      const filters = {
        research_partners: {
          users_permissions_user: { id: { eq: Number(userId) } }
        }
      }
      
      const result = await executeGraphQL({
        query: GET_PROJECT_RESEARCHES,
        variables: { filters },
      })
      
      return normalizeProjectResearchCollection(result?.projectResearches)
    } catch (error) {
      console.warn('Failed to get user-specific projects, falling back to all projects:', error)
      try { 
        return await projectAPI.getProjects()
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required')
      
      const filters = {
        research_partners: {
          users_permissions_user: { id: { eq: Number(userId) } }
        }
      }
      
      const result = await executeGraphQL({
        query: GET_PROJECT_RESEARCHES,
        variables: { filters },
      })
      
      return normalizeProjectResearchCollection(result?.projectResearches)
    } catch (error) { 
      return { data: [], meta: null } 
    }
  },
  
  getProject: async (id) => {
    if (!id) return wrapData(null)
    
    const docId = getDocumentId(id)
    const isNumeric = !Number.isNaN(Number(docId))
    
    const query = isNumeric ? GET_PROJECT_RESEARCH_BY_ID : GET_PROJECT_RESEARCH_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }
    
    const result = await executeGraphQL({ query, variables })
    const entity = result?.projectResearch?.data
    
    return wrapData(normalizeProjectResearch(entity))
  },

  getProjectPartners: async (projectId) => {
    if (!projectId) return { data: [] }
    
    const docId = getDocumentId(projectId)
    const filters = { project_researches: { documentId: { eq: docId } } }
    
    const result = await executeGraphQL({
      query: GET_PROJECT_PARTNERS,
      variables: { filters },
    })
    
    const items = normalizeCollection(result?.projectPartners, normalizeProjectPartner)
    return { data: items }
  },

  createPartner: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_PROJECT_PARTNER_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createProjectPartner?.data || null
    return wrapData(normalizeProjectPartner(entity))
  },

  updatePartner: async (documentId, data) => {
    const docId = getDocumentId(documentId)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_PROJECT_PARTNER_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateProjectPartner?.data || null
    return wrapData(normalizeProjectPartner(entity))
  },

  deletePartner: async (documentId) => {
    const docId = getDocumentId(documentId)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_PROJECT_PARTNER_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteProjectPartner?.data || null }
  },

  createProject: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_PROJECT_RESEARCH_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createProjectResearch?.data || null
    return wrapData(normalizeProjectResearch(entity))
  },

  createProjectWithRelations: async (data) => {
    // For complex creation with relations, we might need to use REST endpoint
    // This is a fallback for custom operations that GraphQL doesn't handle well
    throw new Error('createProjectWithRelations not yet implemented in GraphQL')
  },

  updateProject: async (id, data) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_PROJECT_RESEARCH_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateProjectResearch?.data || null
    return wrapData(normalizeProjectResearch(entity))
  },

  deleteProject: async (id) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_PROJECT_RESEARCH_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteProjectResearch?.data || null }
  },
}

export const fundingAPI = {
  getFundings: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_PROJECT_FUNDINGS,
      variables: { filters, pagination },
    })
    return normalizeProjectFundingCollection(result?.projectFundings)
  },
  
  getMyFundings: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('User not authenticated')
      
      // For now, filter by user association - might need custom logic
      const { filters, pagination } = restParamsToGraphQLArgs(params)
      const result = await executeGraphQL({
        query: GET_PROJECT_FUNDINGS,
        variables: { filters, pagination },
      })
      
      return normalizeProjectFundingCollection(result?.projectFundings)
    } catch (error) {
      try {
        const result = await executeGraphQL({
          query: GET_PROJECT_FUNDINGS,
          variables: {},
        })
        return normalizeProjectFundingCollection(result?.projectFundings)
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getFunding: async (id) => {
    if (!id) return wrapData(null)
    
    const docId = getDocumentId(id)
    const isNumeric = !Number.isNaN(Number(docId))
    
    const query = isNumeric ? GET_PROJECT_FUNDING_BY_ID : GET_PROJECT_FUNDING_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }
    
    const result = await executeGraphQL({ query, variables })
    const entity = result?.projectFunding?.data
    
    return wrapData(normalizeProjectFunding(entity))
  },

  createFunding: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_PROJECT_FUNDING_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createProjectFunding?.data || null
    return wrapData(normalizeProjectFunding(entity))
  },

  updateFunding: async (id, data) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_PROJECT_FUNDING_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateProjectFunding?.data || null
    return wrapData(normalizeProjectFunding(entity))
  },

  deleteFunding: async (id) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_PROJECT_FUNDING_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteProjectFunding?.data || null }
  },
}
