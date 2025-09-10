// โมดูล Profile API (แยกจาก api.js เดิม)
import { api, API_BASE } from '../api-base'

// ฟังก์ชันช่วยเฉพาะภายในไฟล์ (ไม่ export) ถ้าจำเป็นสามารถย้าย

export const profileAPI = {
  // หมายเหตุ (ไทย): ดึงข้อมูลที่ใช้ใน Sidebar พร้อม role
  getMyProfileSidebar: () => api.get('/users/me?populate[profile][populate]=avatarUrl&populate[role]=*&publicationState=preview'),
  // หมายเหตุ (ไทย): ดึงข้อมูลโปรไฟล์แบบเต็มสำหรับหน้าแก้ไข - แก้ไขให้ populate จาก User entity เท่านั้น
  getMyProfile: () => api.get('/users/me?populate[profile][populate]=avatarUrl&populate[organization]=*&populate[faculty]=*&populate[department]=*&populate[academic_type]=*&populate[participation_type]=*&populate[educations][populate]=education_level&publicationState=preview'),
  updateProfile: (id, data) => api.put(`/users/${id}`, { data }),
  getProfiles: (params = {}) => api.get('/profiles', params),
  getProfile: (documentId) => api.get(`/profiles/${documentId}?populate=*&publicationState=preview`),
  createProfile: (data) => api.post('/profiles', { data }),
  updateProfileData: (documentId, data) => api.put(`/profiles/${documentId}`, { data }),
  findProfileByUserId: async (userId) => {
    if (!userId) return null
    const response = await api.get(`/profiles?filters[user][id][$eq]=${userId}&publicationState=preview`)
    const profiles = response?.data || response || []
    return Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null
  }
  ,
  // คอมเมนต์ (ไทย): อัปเดต relations ของผู้ใช้โดยเฉพาะ ใช้ endpoint custom ใน Strapi backend
  updateUserRelations: (payload) => api.post('/user-relations/update', payload),
}

export { API_BASE }
