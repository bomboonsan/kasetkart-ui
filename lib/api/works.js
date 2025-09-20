import { executeGraphQL } from '@/lib/graphql/client'
import {
  GET_WORK_BOOKS,
  GET_WORK_BOOK_BY_ID,
  GET_WORK_BOOK_BY_DOCUMENT_ID,
  GET_WORK_CONFERENCES,
  GET_WORK_CONFERENCE_BY_ID,
  GET_WORK_CONFERENCE_BY_DOCUMENT_ID,
  GET_WORK_PUBLICATIONS,
  GET_WORK_PUBLICATION_BY_ID,
  GET_WORK_PUBLICATION_BY_DOCUMENT_ID,
} from '@/lib/graphql/queries'
import {
  CREATE_WORK_BOOK_MUTATION,
  UPDATE_WORK_BOOK_MUTATION,
  DELETE_WORK_BOOK_MUTATION,
  CREATE_WORK_CONFERENCE_MUTATION,
  UPDATE_WORK_CONFERENCE_MUTATION,
  DELETE_WORK_CONFERENCE_MUTATION,
  CREATE_WORK_PUBLICATION_MUTATION,
  UPDATE_WORK_PUBLICATION_MUTATION,
  DELETE_WORK_PUBLICATION_MUTATION,
} from '@/lib/graphql/mutations'
import {
  normalizeWorksCollection,
  normalizeWorkBook,
  normalizeWorkConference,
  normalizeWorkPublication,
} from '@/lib/graphql/transformers'
import { restParamsToGraphQLArgs } from '@/lib/graphql/param-utils'
import { 
  getCurrentUserId, 
  filterItemsByUserId, 
  filterConferencesByProjectParticipation,
  buildUserFilterParams 
} from './shared-utils'
import { getDocumentId, stripUndefined } from '@/utils/strapi'

function wrapData(data) {
  return data === null || data === undefined ? null : { data }
}

export const worksAPI = {
  getBooks: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_WORK_BOOKS,
      variables: { filters, pagination },
    })
    return normalizeWorksCollection(result?.workBooks, 'books')
  },
  
  getMyBooks: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('User not authenticated')
      
      // Filter by user - might need custom logic based on how books relate to users
      const { filters: baseFilters, pagination } = restParamsToGraphQLArgs(params)
      const filters = {
        ...baseFilters,
        // Add user filtering logic here based on your schema
      }
      
      const result = await executeGraphQL({
        query: GET_WORK_BOOKS,
        variables: { filters, pagination },
      })
      
      return normalizeWorksCollection(result?.workBooks, 'books')
    } catch (error) {
      try { 
        const result = await executeGraphQL({
          query: GET_WORK_BOOKS,
          variables: {},
        })
        
        // Fallback: filter on client side
        const userId = await getCurrentUserId()
        const collection = normalizeWorksCollection(result?.workBooks, 'books')
        const filtered = filterItemsByUserId(collection, userId)
        return { data: filtered, meta: collection.meta }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getBook: async (id) => {
    if (!id) return wrapData(null)
    
    const docId = getDocumentId(id)
    const isNumeric = !Number.isNaN(Number(docId))
    
    const query = isNumeric ? GET_WORK_BOOK_BY_ID : GET_WORK_BOOK_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }
    
    const result = await executeGraphQL({ query, variables })
    const entity = result?.workBook?.data
    
    return wrapData(normalizeWorkBook(entity))
  },

  createBook: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_WORK_BOOK_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createWorkBook?.data || null
    return wrapData(normalizeWorkBook(entity))
  },

  updateBook: async (id, data) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_WORK_BOOK_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateWorkBook?.data || null
    return wrapData(normalizeWorkBook(entity))
  },

  deleteBook: async (id) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_WORK_BOOK_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteWorkBook?.data || null }
  },
  
  getConferences: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_WORK_CONFERENCES,
      variables: { filters, pagination },
    })
    return normalizeWorksCollection(result?.workConferences, 'conferences')
  },
  
  getMyConferences: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('User not authenticated')
      
      // Filter by project participation
      const filters = {
        project_research: {
          research_partners: {
            users_permissions_user: { id: { eq: Number(userId) } }
          }
        }
      }
      
      const result = await executeGraphQL({
        query: GET_WORK_CONFERENCES,
        variables: { filters },
      })
      
      return normalizeWorksCollection(result?.workConferences, 'conferences')
    } catch (error) { 
      try { 
        const result = await executeGraphQL({
          query: GET_WORK_CONFERENCES,
          variables: {},
        })
        
        // Fallback: filter on client side
        const userId = await getCurrentUserId()
        const collection = normalizeWorksCollection(result?.workConferences, 'conferences')
        const filtered = filterConferencesByProjectParticipation(collection, userId)
        return { data: filtered, meta: collection.meta }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getConference: async (id) => {
    if (!id) return wrapData(null)
    
    const docId = getDocumentId(id)
    const isNumeric = !Number.isNaN(Number(docId))
    
    const query = isNumeric ? GET_WORK_CONFERENCE_BY_ID : GET_WORK_CONFERENCE_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }
    
    const result = await executeGraphQL({ query, variables })
    const entity = result?.workConference?.data
    
    return wrapData(normalizeWorkConference(entity))
  },

  createConference: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_WORK_CONFERENCE_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createWorkConference?.data || null
    return wrapData(normalizeWorkConference(entity))
  },

  updateConference: async (id, data) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_WORK_CONFERENCE_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateWorkConference?.data || null
    return wrapData(normalizeWorkConference(entity))
  },

  deleteConference: async (id) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_WORK_CONFERENCE_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteWorkConference?.data || null }
  },
  
  getPublications: async (params = {}) => {
    const { filters, pagination } = restParamsToGraphQLArgs(params)
    const result = await executeGraphQL({
      query: GET_WORK_PUBLICATIONS,
      variables: { filters, pagination },
    })
    return normalizeWorksCollection(result?.workPublications, 'publications')
  },

  getPublication: async (id) => {
    if (!id) return wrapData(null)
    
    const docId = getDocumentId(id)
    const isNumeric = !Number.isNaN(Number(docId))
    
    const query = isNumeric ? GET_WORK_PUBLICATION_BY_ID : GET_WORK_PUBLICATION_BY_DOCUMENT_ID
    const variables = isNumeric ? { id: String(docId) } : { documentId: docId }
    
    const result = await executeGraphQL({ query, variables })
    const entity = result?.workPublication?.data
    
    return wrapData(normalizeWorkPublication(entity))
  },

  createPublication: async (data) => {
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: CREATE_WORK_PUBLICATION_MUTATION,
      variables: { data: payload },
    })
    
    const entity = result?.createWorkPublication?.data || null
    return wrapData(normalizeWorkPublication(entity))
  },

  updatePublication: async (id, data) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const payload = stripUndefined(data)
    const result = await executeGraphQL({
      query: UPDATE_WORK_PUBLICATION_MUTATION,
      variables: { documentId: docId, data: payload },
    })
    
    const entity = result?.updateWorkPublication?.data || null
    return wrapData(normalizeWorkPublication(entity))
  },

  deletePublication: async (id) => {
    const docId = getDocumentId(id)
    if (!docId) throw new Error('documentId is required')
    
    const result = await executeGraphQL({
      query: DELETE_WORK_PUBLICATION_MUTATION,
      variables: { documentId: docId },
    })
    
    return { success: true, data: result?.deleteWorkPublication?.data || null }
  },
}
