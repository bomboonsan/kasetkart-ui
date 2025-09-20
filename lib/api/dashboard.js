// โมดูล Dashboard สถิติ (Mixed GraphQL/REST implementation)
import { api } from '../api-base'
import { projectAPI, fundingAPI } from './project'
import { worksAPI } from './works'
import { executeGraphQL } from '../graphql'
import { GET_IMPACTS } from '../graphql/queries'

export const dashboardAPI = {
  getStats: () => Promise.all([
    projectAPI.getProjects(),
    fundingAPI.getFundings(),
    worksAPI.getPublications(),
    worksAPI.getConferences(),
    worksAPI.getBooks(),
  ]),

  // Custom dashboard endpoints remain as REST API calls
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
  getImpacts: async (params = {}) => {
    try {
      const variables = {
        filters: params.filters || {},
        pagination: params.pagination || {},
        sort: params.sort || []
      }
      const result = await executeGraphQL(GET_IMPACTS, variables)
      return { data: result.impacts.data }
    } catch (error) {
      // Fallback to REST API
      return api.get('/impacts', params)
    }
  },

  // Custom report endpoint remains as REST API call
  getImpactsByDepartment: (params = {}) => api.get('/reports/impacts-by-department', params)
}
