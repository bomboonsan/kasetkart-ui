import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_MY_PROFILE_SIDEBAR,
  GET_MY_PROFILE,
  GET_USER_BY_FILTERS,
  GET_PROFILES,
  GET_PROFILE_BY_ID,
  GET_PROFILE_BY_DOCUMENT_ID,
} from '@/lib/graphql/queries'
import {
  UPDATE_USER_MUTATION,
  CREATE_PROFILE_MUTATION,
  UPDATE_PROFILE_MUTATION,
} from '@/lib/graphql/mutations'
import {
  normalizeUser,
  normalizeProfile,
  normalizeProfileCollection,
} from '@/lib/graphql/transformers'
import { restParamsToGraphQLArgs } from '@/lib/graphql/param-utils'
import { stripUndefined, getDocumentId } from '@/utils/strapi'

function wrapData(data) {
  return data === null || data === undefined ? null : { data }
}

export const profileAPI = {
  getMyProfileSidebar: async () => {
    const result = await executeGraphQL({ query: GET_MY_PROFILE_SIDEBAR })
    const normalized = normalizeUser(result?.me)
    return wrapData(normalized)
  },

  getMyProfile: async () => {
    const result = await executeGraphQL({ query: GET_MY_PROFILE })
    const normalized = normalizeUser(result?.me)
    return wrapData(normalized)
  },

  getUserById: async (identifier) => {
    if (!identifier) return wrapData(null)

    const numericId = Number(identifier)
    const filters = Number.isNaN(numericId)
      ? { documentId: { eq: identifier } }
      : { id: { eq: numericId } }

    const result = await executeGraphQL({
      query: GET_USER_BY_FILTERS,
      variables: { filters },
    })

    const entity = result?.usersPermissionsUsers?.data?.[0] || null
    const normalized = normalizeUser(entity)
    return wrapData(normalized)
  },

  updateProfile: async (id, data) => {
    if (!id) throw new Error('User id is required')
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_USER_MUTATION,
      variables: { id: String(id), data: payload },
    })

    const entity = result?.updateUsersPermissionsUser?.data || null
    return wrapData(normalizeUser(entity))
  },

  getProfiles: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_PROFILES,
      variables: { filters, pagination },
    })

    return normalizeProfileCollection(result?.profiles)
  },

  getProfile: async (documentIdentifier) => {
    if (!documentIdentifier) return wrapData(null)

    const docId = getDocumentId(documentIdentifier)
    const isNumeric = !Number.isNaN(Number(docId))

    const query = isNumeric ? GET_PROFILE_BY_ID : GET_PROFILE_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }

    const result = await executeGraphQL({ query, variables })
    const entity = isNumeric
      ? result?.profile?.data
      : result?.profile?.data

    return wrapData(normalizeProfile(entity))
  },

  createProfile: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_PROFILE_MUTATION,
      variables: { data: payload },
    })

    const entity = result?.createProfile?.data || null
    return wrapData(normalizeProfile(entity))
  },

  updateProfileData: async (documentIdentifier, data) => {
    const docId = getDocumentId(documentIdentifier)
    if (!docId) throw new Error('documentId is required')

    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_PROFILE_MUTATION,
      variables: { documentId: docId, data: payload },
    })

    const entity = result?.updateProfile?.data || null
    return wrapData(normalizeProfile(entity))
  },

  findProfileByUserId: async (userId) => {
    if (!userId) return null

    const filters = { user: { id: { eq: Number(userId) } } }
    const result = await executeGraphQL({
      query: GET_PROFILES,
      variables: { filters, pagination: { limit: 1 } },
    })

    const item = result?.profiles?.data?.[0] || null
    return normalizeProfile(item)
  },

  updateUserRelations: async (payload) => {
    // Convert REST payload to GraphQL user update
    // Payload structure: { userId, organization, faculty, department, academic_type, participation_type }
    const { userId, ...relationData } = payload
    if (!userId) throw new Error('userId is required for user relations update')
    
    // Use the existing GraphQL UPDATE_USER_MUTATION instead of REST endpoint
    const { userAPI } = await import('./admin')
    return await userAPI.updateUser(userId, relationData)
  },
}
