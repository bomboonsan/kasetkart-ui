// โมดูล Project / Funding API (GraphQL implementation)
import { executeGraphQL } from '../graphql'
import { 
  GET_PROJECTS,
  GET_MY_PROJECTS,
  GET_PROJECT,
  GET_PROJECT_PARTNERS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_RESEARCH_PARTNER,
  UPDATE_RESEARCH_PARTNER,
  DELETE_RESEARCH_PARTNER,
  GET_FUNDINGS,
  GET_MY_FUNDINGS,
  GET_FUNDING,
  CREATE_FUNDING,
  UPDATE_FUNDING,
  DELETE_FUNDING
} from '../graphql/queries'
import { 
  getCurrentUserId
} from './shared-utils'
import { getDocumentId } from '../../utils/strapi'

export const projectAPI = {
  getProjects: async (params = {}) => {
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_PROJECTS, variables)
    return {
      data: result.projectResearches.data,
      meta: result.projectResearches.meta
    }
  },
  
  getMyProjects: async () => {
    try {
      const userId = await getCurrentUserId()
      const result = await executeGraphQL(GET_MY_PROJECTS, { userId })
      return { data: result.projectResearches.data }
    } catch (error) {
      try { 
        // Fallback: get all projects
        const result = await executeGraphQL(GET_PROJECTS)
        return { data: result.projectResearches.data }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required')
      const result = await executeGraphQL(GET_MY_PROJECTS, { userId })
      return { data: result.projectResearches.data }
    } catch (error) { 
      return { data: [] } 
    }
  },
  
  getProject: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(GET_PROJECT, { id: documentId })
    return { data: result.projectResearch }
  },

  getProjectPartners: async (projectId) => {
    const documentId = getDocumentId(projectId)
    const result = await executeGraphQL(GET_PROJECT_PARTNERS, { projectId: documentId })
    return { data: result.researchPartners.data }
  },

  createPartner: async (data) => {
    const result = await executeGraphQL(CREATE_RESEARCH_PARTNER, { data })
    return result.createResearchPartner
  },

  updatePartner: async (documentId, data) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(UPDATE_RESEARCH_PARTNER, { id, data })
    return result.updateResearchPartner
  },

  deletePartner: async (documentId) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(DELETE_RESEARCH_PARTNER, { id })
    return result.deleteResearchPartner
  },

  createProject: async (data) => {
    const result = await executeGraphQL(CREATE_PROJECT, { data })
    return result.createProjectResearch
  },

  createProjectWithRelations: async (data) => {
    // For now, use the same mutation as createProject
    // This might need custom backend logic if relations are complex
    const result = await executeGraphQL(CREATE_PROJECT, { data })
    return result.createProjectResearch
  },

  updateProject: async (id, data) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(UPDATE_PROJECT, { id: documentId, data })
    return result.updateProjectResearch
  },

  deleteProject: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(DELETE_PROJECT, { id: documentId })
    return result.deleteProjectResearch
  }
}

export const fundingAPI = {
  getFundings: async (params = {}) => {
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_FUNDINGS, variables)
    return {
      data: result.projectFundings.data,
      meta: result.projectFundings.meta
    }
  },
  
  getMyFundings: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const result = await executeGraphQL(GET_MY_FUNDINGS, { userId })
      return { data: result.projectFundings.data }
    } catch (error) {
      try {
        // Fallback: get all fundings
        const result = await executeGraphQL(GET_FUNDINGS)
        return { data: result.projectFundings.data }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getFunding: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(GET_FUNDING, { id: documentId })
    return { data: result.projectFunding }
  },

  createFunding: async (data) => {
    const result = await executeGraphQL(CREATE_FUNDING, { data })
    return result.createProjectFunding
  },

  updateFunding: async (id, data) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(UPDATE_FUNDING, { id: documentId, data })
    return result.updateProjectFunding
  },

  deleteFunding: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(DELETE_FUNDING, { id: documentId })
    return result.deleteProjectFunding
  }
}
