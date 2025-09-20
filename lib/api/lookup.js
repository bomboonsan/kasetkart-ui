// โมดูล Lookup (orgAPI, eduAPI, valueFromAPI) - GraphQL implementation
import { executeGraphQL } from "../graphql"
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
  GET_MY_EDUCATIONS,
  CREATE_EDUCATION,
  UPDATE_EDUCATION,
  DELETE_EDUCATION
} from '../graphql/queries'
import { getDocumentId } from '../../utils/strapi'

export const orgAPI = {
  getOrganizations: async () => {
    const result = await executeGraphQL(GET_ORGANIZATIONS)
    return { data: result.organizations.data }
  },

  getFaculties: async () => {
    const result = await executeGraphQL(GET_FACULTIES)
    return { data: result.faculties.data }
  },

  getDepartments: async () => {
    const result = await executeGraphQL(GET_DEPARTMENTS)
    return { data: result.departments.data }
  },

  getAcademicTypes: async () => {
    const result = await executeGraphQL(GET_ACADEMIC_TYPES)
    return { data: result.academicTypes.data }
  },

  getEducationLevels: async () => {
    const result = await executeGraphQL(GET_EDUCATION_LEVELS)
    return { data: result.educationLevels.data }
  },

  getAcademicType: async () => {
    // Same as getAcademicTypes - keep for compatibility
    const result = await executeGraphQL(GET_ACADEMIC_TYPES)
    return { data: result.academicTypes.data }
  },

  getParticipationTypes: async () => {
    const result = await executeGraphQL(GET_PARTICIPATION_TYPES)
    return { data: result.participationTypes.data }
  },
}

export const eduAPI = {
  listMine: async (userId) => {
    const result = await executeGraphQL(GET_MY_EDUCATIONS, { userId })
    return { data: result.educations.data }
  },

  create: async (data) => {
    const result = await executeGraphQL(CREATE_EDUCATION, { data })
    return result.createEducation
  },

  update: async (documentId, data) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(UPDATE_EDUCATION, { id, data })
    return result.updateEducation
  },

  remove: async (documentId) => {
    const id = getDocumentId(documentId)
    const result = await executeGraphQL(DELETE_EDUCATION, { id })
    return result.deleteEducation
  },
}

export const valueFromAPI = {
  getDepartments: async () => {
    const result = await executeGraphQL(GET_DEPARTMENTS)
    return { data: result.departments.data }
  },

  getIcTypes: async () => {
    const result = await executeGraphQL(GET_IC_TYPES)
    return { data: result.icTypes.data }
  },

  getImpacts: async () => {
    const result = await executeGraphQL(GET_IMPACTS)
    return { data: result.impacts.data }
  },

  getSDGs: async () => {
    const result = await executeGraphQL(GET_SDGS)
    return { data: result.sdgs.data }
  },
}
