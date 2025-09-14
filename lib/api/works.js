// โมดูล Works API (หนังสือ ประชุม ตีพิมพ์)
import { api } from '../api-base'

export const worksAPI = {
  getBooks: (params = {}) => api.get('/work-books', params),
  getMyBooks: async (params = {}) => {
    try {
      const userRes = await api.get('/users/me'); const userId = userRes.data?.id || userRes.id; if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      const searchParams = new URLSearchParams(); searchParams.set('filters[users_permissions_user][id][$eq]', userId); for (const [k, v] of Object.entries(params || {})) searchParams.set(k, v)
      return await api.get(`/work-books?${searchParams.toString()}`)
    } catch (error) {
      try { const all = await api.get('/work-books?populate=*'); const list = all?.data || all || []; const userRes = await api.get('/users/me'); const userId = userRes.data?.id || userRes.id; const filtered = Array.isArray(list) ? list.filter(item => { const owners = item.users_permissions_user || item.authors || item.user || []; return Array.isArray(owners) ? owners.some(o => o?.id === userId) : owners?.id === userId }) : []; return { data: filtered } } catch (e) { throw error }
    }
  },
  getBook: (id) => api.get(`/work-books/${id}?populate=*`),
  createBook: (data) => api.post('/work-books', { data }),
  updateBook: (id, data) => api.put(`/work-books/${id}`, { data }),
  deleteBook: (id) => api.delete(`/work-books/${id}`),
  getConferences: (params = {}) => api.get('/work-conferences', params),
  getMyConferences: async (params = {}) => {
    try {
      const userRes = await api.get('/users/me');
      const userId = userRes.data?.id || userRes.id;
      if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      const allConferents = await api.get('/work-conferences?populate=project_research.research_partners.users_permissions_user');
      const list = allConferents?.data || allConferents || []
      const myConferents = allConferents.data?.filter(p => (p.project_research.research_partners || []).some(partner => partner.users_permissions_user?.id === userId)) || []
      return { data: myConferents }
    } catch (error) { try { const all = await api.get('/work-conferences?populate=*'); const list = all?.data || all || []; const userRes = await api.get('/users/me'); const userId = userRes.data?.id || userRes.id; const filtered = Array.isArray(list) ? list.filter(item => { const owners = item.users_permissions_user || item.authors || item.presenters || item.user || []; return Array.isArray(owners) ? owners.some(o => o?.id === userId) : owners?.id === userId }) : []; return { data: filtered } } catch (e) { throw error } }

  },
  getConference: (id) => api.get(`/work-conferences/${id}?populate=*`),
  createConference: (data) => api.post('/work-conferences', { data }),
  updateConference: (id, data) => api.put(`/work-conferences/${id}`, { data }),
  deleteConference: (id) => api.delete(`/work-conferences/${id}`),
  getPublications: (params = {}) => api.get('/work-publications', params),
  getPublication: (id) => api.get(`/work-publications/${id}?populate=*`),
  createPublication: (data) => api.post('/work-publications', { data }),
  updatePublication: (id, data) => api.put(`/work-publications/${id}`, { data }),
  deletePublication: (id) => api.delete(`/work-publications/${id}`)
}
