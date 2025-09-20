// โมดูล Works API (หนังสือ ประชุม ตีพิมพ์)
import { api } from '../api-base'
import { 
  getCurrentUserId, 
  filterItemsByUserId, 
  filterConferencesByProjectParticipation,
  buildUserFilterParams 
} from './shared-utils'
import { getDocumentId } from '../../utils/strapi'

export const worksAPI = {
  getBooks: (params = {}) => api.get('/work-books', params),
  
  getMyBooks: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const searchParams = buildUserFilterParams(userId, params)
      return await api.get(`/work-books?${searchParams.toString()}`)
    } catch (error) {
      try { 
        const all = await api.get('/work-books?populate=*')
        const userId = await getCurrentUserId()
        const filtered = filterItemsByUserId(all, userId)
        return { data: filtered }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getBook: (id) => api.get(`/work-books/${getDocumentId(id)}?populate=*`),
  createBook: (data) => api.post('/work-books', { data }),
  updateBook: (id, data) => api.put(`/work-books/${getDocumentId(id)}`, { data }),
  deleteBook: (id) => api.delete(`/work-books/${getDocumentId(id)}`),
  
  getConferences: (params = {}) => api.get('/work-conferences', params),
  
  getMyConferences: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const allConferences = await api.get('/work-conferences?populate=project_research.research_partners.users_permissions_user')
      const myConferences = filterConferencesByProjectParticipation(allConferences, userId)
      return { data: myConferences }
    } catch (error) { 
      try { 
        const all = await api.get('/work-conferences?populate=*')
        const userId = await getCurrentUserId()
        const filtered = filterItemsByUserId(all, userId)
        return { data: filtered }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getConference: (id) => api.get(`/work-conferences/${getDocumentId(id)}?populate=*`),
  createConference: (data) => api.post('/work-conferences', { data }),
  updateConference: (id, data) => api.put(`/work-conferences/${getDocumentId(id)}`, { data }),
  deleteConference: (id) => api.delete(`/work-conferences/${getDocumentId(id)}`),
  
  getPublications: (params = {}) => api.get('/work-publications', params),
  getPublication: (id) => api.get(`/work-publications/${getDocumentId(id)}?populate=*`),
  createPublication: (data) => api.post('/work-publications', { data }),
  updatePublication: (id, data) => api.put(`/work-publications/${getDocumentId(id)}`, { data }),
  deletePublication: (id) => api.delete(`/work-publications/${getDocumentId(id)}`)
}
