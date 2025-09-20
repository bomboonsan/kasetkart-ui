// โมดูล Profile API (GraphQL implementation)
import { executeGraphQL } from '../graphql'
import { 
  GET_MY_PROFILE_SIDEBAR, 
  GET_MY_PROFILE, 
  GET_USER_BY_ID, 
  GET_PROFILES,
  GET_PROFILE,
  UPDATE_USER,
  CREATE_PROFILE,
  UPDATE_PROFILE
} from '../graphql/queries'
import { getDocumentId } from '../../utils/strapi'
import { api, API_BASE } from "../api-base" // Keep for updateUserRelations

export const profileAPI = {
  // หมายเหตุ (ไทย): ดึงข้อมูลที่ใช้ใน Sidebar พร้อม role
  getMyProfileSidebar: async () => {
    const result = await executeGraphQL(GET_MY_PROFILE_SIDEBAR)
    return { data: result.me }
  },

  // หมายเหตุ (ไทย): ดึงข้อมูลโปรไฟล์แบบเต็มสำหรับหน้าแก้ไข
  getMyProfile: async () => {
    const result = await executeGraphQL(GET_MY_PROFILE)
    return { data: result.me }
  },

  // คอมเมนต์ (ไทย): ดึงข้อมูลผู้ใช้ตาม ID หรือ documentId สำหรับ Admin
  getUserById: async (id) => {
    // For GraphQL, we'll use the documentId for queries
    const result = await executeGraphQL(GET_USER_BY_ID, { id })
    const user = result.usersPermissionsUser
    return { data: user }
  },

  updateProfile: async (id, data) => {
    const result = await executeGraphQL(UPDATE_USER, { id, data })
    return result.updateUsersPermissionsUser
  },

  getProfiles: async (params = {}) => {
    // Convert REST params to GraphQL variables
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_PROFILES, variables)
    return {
      data: result.profiles.data,
      meta: result.profiles.meta
    }
  },

  getProfile: async (documentId) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(GET_PROFILE, { id })
    return { data: result.profile }
  },

  createProfile: async (data) => {
    const result = await executeGraphQL(CREATE_PROFILE, { data })
    return result.createProfile
  },

  updateProfileData: async (documentId, data) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(UPDATE_PROFILE, { id, data })
    return result.updateProfile
  },

  findProfileByUserId: async (userId) => {
    if (!userId) return null
    const variables = {
      filters: {
        user: {
          id: { eq: userId }
        }
      }
    }
    const result = await executeGraphQL(GET_PROFILES, variables)
    const profiles = result.profiles.data || []
    return Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null
  },

  // คอมเมนต์ (ไทย): อัปเดต relations ของผู้ใช้โดยเฉพาะ ใช้ endpoint custom ใน Strapi backend
  // Note: This remains as REST API call since it's a custom endpoint
  updateUserRelations: (payload) => api.post("/user-relations/update", payload),
};

export { API_BASE };
