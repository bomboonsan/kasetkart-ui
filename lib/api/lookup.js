import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_ORGANIZATIONS,
  GET_FACULTIES,
  GET_DEPARTMENTS,
  GET_ACADEMIC_TYPES,
  GET_EDUCATION_LEVELS,
  GET_PARTICIPATION_TYPES,
  GET_IC_TYPES,
  GET_IMPACTS,
  GET_SDGS,
  GET_EDUCATIONS_BY_USER,
} from '@/lib/graphql/queries'
import {
  CREATE_EDUCATION_MUTATION,
  UPDATE_EDUCATION_MUTATION,
  DELETE_EDUCATION_MUTATION,
} from '@/lib/graphql/mutations'
import {
  normalizeLookupCollection,
  normalizeCollection,
  normalizeEducation,
} from '@/lib/graphql/transformers'
import { restParamsToGraphQLArgs } from '@/lib/graphql/param-utils'
import { getDocumentId, stripUndefined } from '@/utils/strapi'

function wrapData(data) {
  return data === null || data === undefined ? null : { data }
}

export const orgAPI = {
  getOrganizations: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_ORGANIZATIONS,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.organizations)
  },

  getFaculties: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_FACULTIES,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.faculties)
  },

  getDepartments: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_DEPARTMENTS,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.departments)
  },

  getAcademicTypes: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_ACADEMIC_TYPES,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.academicTypes)
  },

  getEducationLevels: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_EDUCATION_LEVELS,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.educationLevels)
  },

  getAcademicType: async (params = {}) => {
    return await orgAPI.getAcademicTypes(params)
  },

  getParticipationTypes: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_PARTICIPATION_TYPES,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.participationTypes)
  },
}

export const eduAPI = {
  listMine: async (userId) => {
    if (!userId) return { data: [] }
    
    const filters = { users_permissions_user: { id: { eq: Number(userId) } } }
    const result = await executeGraphQL({
      query: GET_EDUCATIONS_BY_USER,
      variables: { filters },
    })
    
    const items = normalizeCollection(result?.educations, normalizeEducation)
    return { data: items }
  },

  create: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_EDUCATION_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createEducation?.data || null
    return wrapData(normalizeEducation(entity))
  },

  update: async (documentId, data) => {
    const docId = getDocumentId(documentId)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_EDUCATION_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateEducation?.data || null
    return wrapData(normalizeEducation(entity))
  },

  remove: async (documentId) => {
    const docId = getDocumentId(documentId)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_EDUCATION_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteEducation?.data || null }
  },
}

export const valueFromAPI = {
  getDepartments: async (params = {}) => {
    return await orgAPI.getDepartments(params)
  },

  getIcTypes: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_IC_TYPES,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.icTypes)
  },

  getImpacts: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_IMPACTS,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.impacts)
  },

  getSDGs: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_SDGS,
      variables: { filters, pagination },
    })
    return normalizeLookupCollection(result?.sdgs)
  },
}
