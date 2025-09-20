// โมดูล Project / Funding API (แยก projectAPI และ fundingAPI)
import { api } from '../api-base'
import { 
  getCurrentUserId, 
  filterProjectsByUserId, 
  filterItemsByUserId,
  buildUserFilterParams 
} from './shared-utils'

export const projectAPI = {
  getProjects: (params = {}) => api.get('/project-researches', params),
  
  getMyProjects: async () => {
    try {
      const userId = await getCurrentUserId()
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user&status=draft')
      const myProjects = filterProjectsByUserId(allProjects, userId)
      return { data: myProjects }
    } catch (error) {
      try { 
        return await api.get('/project-researches') 
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required')
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user&status=draft')
      const filtered = filterProjectsByUserId(allProjects, userId)
      return { data: filtered }
    } catch (error) { 
      return { data: [] } 
    }
  },
  
  getProject: (id) => api.get(`/project-researches/${id}?populate=*&status=draft`),
  getProjectPartners: (projectId) => api.get(`/project-partners?populate=users_permissions_user&filters[project_researches][documentId][$eq]=${projectId}&status=draft`),
  updatePartner: (documentId, data) => api.put(`/project-partners/${documentId}`, { data }),
  createProject: (data) => api.post('/project-researches', { data }),
  createProjectWithRelations: (data) => api.post('/project-researches/create-with-relations', { data }),
  updateProject: (id, data) => api.put(`/project-researches/${id}`, { data }),
  deleteProject: (id) => api.delete(`/project-researches/${id}`)
}

export const fundingAPI = {
  getFundings: (params = {}) => api.get('/project-fundings', params),
  
  getMyFundings: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const searchParams = buildUserFilterParams(userId, params)
      return await api.get(`/project-fundings?${searchParams.toString()}`)
    } catch (error) {
      try {
        const all = await api.get('/project-fundings?populate=*&status=draft')
        const userId = await getCurrentUserId()
        const filtered = filterItemsByUserId(all, userId)
        return { data: filtered }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getFunding: (id) => api.get(`/project-fundings/${id}?populate=*&status=draft`),
  createFunding: (data) => api.post('/project-fundings', { data }),
  updateFunding: (id, data) => api.put(`/project-fundings/${id}`, { data }),
  deleteFunding: (id) => api.delete(`/project-fundings/${id}`)
}
