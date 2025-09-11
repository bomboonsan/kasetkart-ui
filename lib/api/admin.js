// โมดูล Admin (userAPI + uploadAPI)
import { api, apiAuth, API_BASE } from '../api-base'
import { profileAPI } from './profile'

export const userAPI = {
  // คอมเมนต์ (ไทย): เพิ่มฟังก์ชัน updateUser ที่หายไป
  updateUser: async (id, data) => {
    return api.put(`/users/${id}`, data);
  },
  createUser: async (data) => {
    const userData = {
      username: data.email,
      email: data.email,
      password: data.password || 'defaultPassword123',
      confirmed: true,
      blocked: false,
      role: 2,
      ...(data.organizationID && { organization: data.organizationID }),
      ...(data.facultyId && { faculty: data.facultyId }),
      ...(data.departmentId && { department: data.departmentId }),
      ...(data.academic_type && { academic_type: data.academic_type }),
      ...(data.participation_type && { participation_type: data.participation_type }),
    }
    try { return await api.post('/users', userData) } catch (error) {
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        const minimalUser = { username: data.email, email: data.email, password: data.password || 'defaultPassword123', confirmed: true, blocked: false }
        const userResponse = await api.post('/users', minimalUser)
        if (userResponse?.data?.id || userResponse?.id) {
          const userId = userResponse.data?.id || userResponse.id
            const relations = {}
            if (data.organizationID) relations.organization = data.organizationID
            if (data.facultyId) relations.faculty = data.facultyId
            if (data.departmentId) relations.department = data.departmentId
            if (data.academic_type) relations.academic_type = data.academic_type
            if (data.participation_type) relations.participation_type = data.participation_type
            if (Object.keys(relations).length > 0) await apiAuth.put(`/users/${userId}`, relations)
        }
        return userResponse
      }
      throw error
    }
  },
  upsertUserProfile: async (userId, profileData) => {
    const existingProfile = await profileAPI.findProfileByUserId(userId)
    if (existingProfile?.documentId) return await profileAPI.updateProfileData(existingProfile.documentId, profileData)
    return await profileAPI.createProfile({ ...profileData, user: userId })
  }
}

export const uploadAPI = {
  uploadFiles: async (files) => {
    const formData = new FormData(); files.forEach(f => formData.append('files', f))
    const token = api.getToken()
    const response = await fetch(`${API_BASE}/upload`, { method: 'POST', headers: { ...(token && { Authorization: `Bearer ${token}` }) }, body: formData })
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)
    const text = await response.text().catch(()=> '')
    if (!text) return null
    try { return JSON.parse(text) } catch(e){ return text }
  },
  getFiles: () => api.get('/upload/files'),
  getFile: (id) => api.get(`/upload/files/${id}`),
  deleteFile: (id) => api.delete(`/upload/files/${id}`)
}
