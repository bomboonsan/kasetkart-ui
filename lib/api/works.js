// โมดูล Works API (หนังสือ ประชุม ตีพิมพ์) - GraphQL implementation
import { executeGraphQL } from '../graphql'
import { 
  GET_BOOKS,
  GET_MY_BOOKS,
  GET_BOOK,
  CREATE_BOOK,
  UPDATE_BOOK,
  DELETE_BOOK,
  GET_CONFERENCES,
  GET_MY_CONFERENCES,
  GET_CONFERENCE,
  CREATE_CONFERENCE,
  UPDATE_CONFERENCE,
  DELETE_CONFERENCE,
  GET_PUBLICATIONS,
  GET_MY_PUBLICATIONS,
  GET_PUBLICATION,
  CREATE_PUBLICATION,
  UPDATE_PUBLICATION,
  DELETE_PUBLICATION
} from '../graphql/queries'
import { 
  getCurrentUserId
} from './shared-utils'
import { getDocumentId } from '../../utils/strapi'

export const worksAPI = {
  getBooks: async (params = {}) => {
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_BOOKS, variables)
    return {
      data: result.workBooks.data,
      meta: result.workBooks.meta
    }
  },
  
  getMyBooks: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const result = await executeGraphQL(GET_MY_BOOKS, { userId })
      return { data: result.workBooks.data }
    } catch (error) {
      try { 
        const result = await executeGraphQL(GET_BOOKS)
        return { data: result.workBooks.data }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getBook: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(GET_BOOK, { id: documentId })
    return { data: result.workBook }
  },

  createBook: async (data) => {
    const result = await executeGraphQL(CREATE_BOOK, { data })
    return result.createWorkBook
  },

  updateBook: async (id, data) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(UPDATE_BOOK, { id: documentId, data })
    return result.updateWorkBook
  },

  deleteBook: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(DELETE_BOOK, { id: documentId })
    return result.deleteWorkBook
  },
  
  getConferences: async (params = {}) => {
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_CONFERENCES, variables)
    return {
      data: result.workConferences.data,
      meta: result.workConferences.meta
    }
  },
  
  getMyConferences: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const result = await executeGraphQL(GET_MY_CONFERENCES, { userId })
      return { data: result.workConferences.data }
    } catch (error) { 
      try { 
        const result = await executeGraphQL(GET_CONFERENCES)
        return { data: result.workConferences.data }
      } catch (e) { 
        throw error 
      }
    }
  },
  
  getConference: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(GET_CONFERENCE, { id: documentId })
    return { data: result.workConference }
  },

  createConference: async (data) => {
    const result = await executeGraphQL(CREATE_CONFERENCE, { data })
    return result.createWorkConference
  },

  updateConference: async (id, data) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(UPDATE_CONFERENCE, { id: documentId, data })
    return result.updateWorkConference
  },

  deleteConference: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(DELETE_CONFERENCE, { id: documentId })
    return result.deleteWorkConference
  },
  
  getPublications: async (params = {}) => {
    const variables = {
      filters: params.filters || {},
      pagination: params.pagination || {},
      sort: params.sort || []
    }
    const result = await executeGraphQL(GET_PUBLICATIONS, variables)
    return {
      data: result.workPublications.data,
      meta: result.workPublications.meta
    }
  },

  getMyPublications: async (params = {}) => {
    try {
      const userId = await getCurrentUserId()
      const result = await executeGraphQL(GET_MY_PUBLICATIONS, { userId })
      return { data: result.workPublications.data }
    } catch (error) {
      try {
        const result = await executeGraphQL(GET_PUBLICATIONS)
        return { data: result.workPublications.data }
      } catch (e) {
        throw error
      }
    }
  },

  getPublication: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(GET_PUBLICATION, { id: documentId })
    return { data: result.workPublication }
  },

  createPublication: async (data) => {
    const result = await executeGraphQL(CREATE_PUBLICATION, { data })
    return result.createWorkPublication
  },

  updatePublication: async (id, data) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(UPDATE_PUBLICATION, { id: documentId, data })
    return result.updateWorkPublication
  },

  deletePublication: async (id) => {
    const documentId = getDocumentId(id)
    const result = await executeGraphQL(DELETE_PUBLICATION, { id: documentId })
    return result.deleteWorkPublication
  }
}
