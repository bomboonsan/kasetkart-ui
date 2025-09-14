// โมดูล Project / Funding API (แยก projectAPI และ fundingAPI)
import { api } from '../api-base'

export const projectAPI = {
  getProjects: (params = {}) => api.get('/project-researches', params),
  getMyProjects: async () => {
    try {
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id
      if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user')
      const myProjects = allProjects.data?.filter(p => (p.research_partners || []).some(partner => partner.users_permissions_user?.id === userId)) || []
      return { data: myProjects }
    } catch (error) {
      try { return await api.get('/project-researches') } catch (e) { throw error }
    }
  },
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required')
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user')
      const list = allProjects?.data || allProjects || []
      const filtered = Array.isArray(list) ? list.filter(project => (project.research_partners || []).some(partner => partner.users_permissions_user?.id === userId)) : []
      return { data: filtered }
    } catch (error) { return { data: [] } }
  },
  getProject: (id) => api.get(`/project-researches/${id}?populate=*`),
  getProjectPartners: (projectId) => api.get(`/project-partners?populate=users_permissions_user&filters[project_researches][documentId][$eq]=${projectId}`),
  updatePartner: (documentId, data) => api.put(`/project-partners/${documentId}`, { data }),
  createProject: (data) => api.post('/project-researches', { data }),
  // คอมเมนต์ (ไทย): เพิ่มฟังก์ชันสำหรับสร้างโครงการพร้อมความสัมพันธ์ M2M
  createProjectWithRelations: (data) => api.post('/project-researches/create-with-relations', { data }),
  updateProject: (id, data) => api.put(`/project-researches/${id}`, { data }),
  deleteProject: (id) => api.delete(`/project-researches/${id}`)
}

export const fundingAPI = {
  getFundings: (params = {}) => api.get('/project-fundings', params),
  getMyFundings: async (params = {}) => {
    try {
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id
      if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      const searchParams = new URLSearchParams()
      searchParams.set('filters[users_permissions_user][id][$eq]', userId)
      for (const [k, v] of Object.entries(params || {})) searchParams.set(k, v)
      return await api.get(`/project-fundings?${searchParams.toString()}`)
    } catch (error) {
      try {
        const all = await api.get('/project-fundings?populate=*')
        const list = all?.data || all || []
        const userRes = await api.get('/users/me')
        const userId = userRes.data?.id || userRes.id
        const filtered = Array.isArray(list) ? list.filter(item => { const owners = item.users_permissions_user || item.user || []; return Array.isArray(owners) ? owners.some(o => o?.id === userId) : owners?.id === userId }) : []
        return { data: filtered }
      } catch (e) { throw error }
    }
  },
  getFunding: (id) => api.get(`/project-fundings/${id}?populate=*`),
  createFunding: (data) => api.post('/project-fundings', { data }),
  updateFunding: (id, data) => api.put(`/project-fundings/${id}`, { data }),
  deleteFunding: (id) => api.delete(`/project-fundings/${id}`)
}
