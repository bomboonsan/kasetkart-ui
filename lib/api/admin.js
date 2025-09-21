import { executeGraphQL } from '@/lib/graphql/client'
import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION } from '@/lib/graphql/mutations'
import { GET_FILES, GET_FILE_BY_ID } from '@/lib/graphql/queries'
import { normalizeUser } from '@/lib/graphql/transformers'
import { profileAPI } from './profile'
import { getDocumentId, stripUndefined } from '@/utils/strapi'
import { STRAPI_REST_ENDPOINT } from '@/lib/config/api'
import { tokenManager } from '@/lib/auth/token-manager'

async function resolveAuthToken() {
  let token = typeof window === 'undefined'
    ? process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null
    : tokenManager.getToken()

  if (!token && typeof window !== 'undefined') {
    try {
      token = await tokenManager.getSessionToken()
    } catch (error) {
      token = null
    }
  }

  return token
}

async function restFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const token = await resolveAuthToken()
  const response = await fetch(`${STRAPI_REST_ENDPOINT}${path}`, {
    method,
    headers: {
      ...(method !== 'GET' && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData
      ? body
      : body
        ? JSON.stringify(body)
        : undefined,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `HTTP ${response.status}`)
  }

  if (method === 'DELETE') return { success: true }

  const text = await response.text().catch(() => '')
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}

function toUserInput(data) {
  return stripUndefined({
    username: data.email || data.username,
    email: data.email || data.username,
    password: data.password || 'defaultPassword123',
    confirmed: data.confirmed ?? true,
    blocked: data.blocked ?? false,
    role: data.role ?? data.roleId ?? undefined,
    organization: data.organizationID,
    faculty: data.facultyId,
    department: data.departmentId,
    academic_type: data.academic_type,
    participation_type: data.participation_type,
  })
}

export const userAPI = {
  updateUser: async (id, data) => {
    if (!id) throw new Error('User id is required')
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_USER_MUTATION,
      variables: { id: String(id), data: payload },
    })

    const entity = result?.updateUsersPermissionsUser?.data || null
    return normalizeUser(entity)
  },

  createUser: async (data) => {
    const createInput = toUserInput(data)
    const result = await executeGraphQL({
      query: CREATE_USER_MUTATION,
      variables: { data: createInput },
    })

    const entity = result?.createUsersPermissionsUser?.data || null
    const normalized = normalizeUser(entity)

    const userId = normalized?.id
    if (!userId) {
      throw new Error('Failed to create user via GraphQL')
    }

    const relationInput = stripUndefined({
      organization: data.organizationID,
      faculty: data.facultyId,
      department: data.departmentId,
      academic_type: data.academic_type,
      participation_type: data.participation_type,
    })

    if (Object.keys(relationInput).length) {
      await userAPI.updateUser(userId, relationInput)
    }

    return normalized
  },

  upsertUserProfile: async (userId, profileData) => {
    if (!userId) throw new Error('userId is required for profile upsert')
    const existingProfile = await profileAPI.findProfileByUserId(userId)
    if (existingProfile?.documentId) {
      const documentId = getDocumentId(existingProfile.documentId)
      await profileAPI.updateProfileData(documentId, profileData)
      return profileAPI.findProfileByUserId(userId)
    }

    await profileAPI.createProfile({ ...profileData, user: userId })
    return profileAPI.findProfileByUserId(userId)
  },
}

export const uploadAPI = {
  uploadFiles: async (files) => {
    // File uploads still need to use REST endpoint due to multipart/form-data requirements
    // This is a common limitation in GraphQL implementations
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    return restFetch('/upload', { method: 'POST', body: formData })
  },

  getFiles: async (filters = {}, pagination = {}) => {
    try {
      // Use GraphQL for getting files list
      const result = await executeGraphQL({
        query: GET_FILES,
        variables: { filters, pagination },
      })
      return result?.uploadFiles?.data || []
    } catch (error) {
      console.warn('Failed to get files via GraphQL, falling back to REST:', error)
      return restFetch('/upload/files')
    }
  },

  getFile: async (id) => {
    try {
      // Use GraphQL for getting single file
      const result = await executeGraphQL({
        query: GET_FILE_BY_ID,
        variables: { id: String(id) },
      })
      return result?.uploadFile?.data || null
    } catch (error) {
      console.warn('Failed to get file via GraphQL, falling back to REST:', error)
      return restFetch(`/upload/files/${id}`)
    }
  },

  deleteFile: async (id) => {
    // File deletion may need to use REST endpoint as well
    // since it might not be properly implemented in GraphQL
    return restFetch(`/upload/files/${id}`, { method: 'DELETE' })
  },
}
