// โมดูล Dashboard สถิติ
import { api } from '../api-base'
import { projectAPI, fundingAPI } from './project'
import { worksAPI } from './works'

export const dashboardAPI = {
  getStats: () => Promise.all([
    projectAPI.getProjects(),
    fundingAPI.getFundings(),
    worksAPI.getPublications(),
    worksAPI.getConferences(),
    worksAPI.getBooks(),
  ]),
  getPersonnelByAcademicType: async (departmentId = null) => {
    try {
      const params = departmentId ? `?departmentId=${departmentId}` : ''
      const response = await api.get(`/dashboard/personnel-by-academic-type${params}`)
      return response?.data || response || {}
    } catch (error) { return {} }
  },
  getResearchStatsByTypes: async (departmentId = null) => {
    try {
      const params = departmentId ? `?departmentId=${departmentId}` : ''
      const response = await api.get(`/dashboard/research-stats-by-types${params}`)
      return response?.data || response || { icTypes: [], impacts: [], sdgs: [] }
    } catch (error) { return { icTypes: [], impacts: [], sdgs: [] } }
  }
}

export const reportAPI = {
  getImpacts: (params = {}) => api.get('/impacts', params),
  getImpactsByDepartment: (params = {}) => api.get('/reports/impacts-by-department', params)
}
