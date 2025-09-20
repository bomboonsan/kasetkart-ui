// โมดูล Admin (userAPI + uploadAPI) - GraphQL implementation
import { executeGraphQL } from '../graphql'
import { 
  CREATE_USER,
  UPDATE_USER
} from '../graphql/queries'
import { profileAPI } from './profile'
import { getDocumentId } from '../../utils/strapi'
import { api, apiAuth, API_BASE } from '../api-base' // Keep for upload functionality

export const userAPI = {
  // คอมเมนต์ (ไทย): เพิ่มฟังก์ชัน updateUser ที่หายไป
  updateUser: async (id, data) => {
    const result = await executeGraphQL(UPDATE_USER, { id, data })
    return result.updateUsersPermissionsUser
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

    try { 
      const result = await executeGraphQL(CREATE_USER, { data: userData })
      return result.createUsersPermissionsUser
    } catch (error) {
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        // Fallback to minimal user creation with REST API
        const minimalUser = { 
          username: data.email, 
          email: data.email, 
          password: data.password || 'defaultPassword123', 
          confirmed: true, 
          blocked: false 
        }
        const userResponse = await api.post('/users', minimalUser)
        
        if (userResponse?.data?.id || userResponse?.id) {
          const userId = userResponse.data?.id || userResponse.id
          const relations = {}
          if (data.organizationID) relations.organization = data.organizationID
          if (data.facultyId) relations.faculty = data.facultyId
          if (data.departmentId) relations.department = data.departmentId
          if (data.academic_type) relations.academic_type = data.academic_type
          if (data.participation_type) relations.participation_type = data.participation_type
          
          if (Object.keys(relations).length > 0) {
            await apiAuth.put(`/users/${userId}`, relations)
          }
        }
        return userResponse
      }
      throw error
    }
  },

  upsertUserProfile: async (userId, profileData) => {
    const existingProfile = await profileAPI.findProfileByUserId(userId)
    if (existingProfile?.documentId) {
      return await profileAPI.updateProfileData(getDocumentId(existingProfile.documentId), profileData)
    }
    return await profileAPI.createProfile({ ...profileData, user: userId })
  }
}

// Upload API remains with REST since it handles file uploads
export const uploadAPI = {
  uploadFiles: async (files) => {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    const token = api.getToken()
    
    const response = await fetch(`${API_BASE}/upload`, { 
      method: 'POST', 
      headers: { 
        ...(token && { Authorization: `Bearer ${token}` }) 
      }, 
      body: formData 
    })
    
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`)
    
    const text = await response.text().catch(() => '')
    if (!text) return null
    
    try { 
      return JSON.parse(text) 
    } catch(e) { 
      return text 
    }
  },

  getFiles: () => api.get('/upload/files'),
  getFile: (id) => api.get(`/upload/files/${id}`),
  deleteFile: (id) => api.delete(`/upload/files/${id}`)
}
