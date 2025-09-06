// Strapi API Client
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params)
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    })
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT', // Strapi uses PUT for updates
      body: data,
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt')
    }
    return null
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', token)
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt')
    }
  }
}

export const api = new ApiClient()

// Auth API
export const authAPI = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/local', {
      identifier,
      password,
    })
    
    if (response.jwt) {
      api.setToken(response.jwt)
    }
    
    return response
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/local/register', {
      username,
      email,
      password,
    })
    
    if (response.jwt) {
      api.setToken(response.jwt)
    }
    
    return response
  },

  logout: () => {
    api.removeToken()
  },

  me: () => {
    return api.get('/users/me?populate=*')
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email })
  },

  resetPassword: (code, password, passwordConfirmation) => {
    return api.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation,
    })
  },

  changePassword: (currentPassword, password, passwordConfirmation) => {
    return api.post('/auth/change-password', {
      currentPassword,
      password,
      passwordConfirmation,
    })
  },
}

// Profile API
export const profileAPI = {

    getMyProfileSidebar: () => {
    // return api.get('/users/me?populate=*')
    return api.get('/users/me?populate[profile][populate]=avatarUrl');
  },

  getMyProfile: () => {
    // return api.get('/users/me?populate=*')
    return api.get('/users/me?populate[profile][populate]=avatarUrl&populate[faculty]=*&populate[department]=*&populate[academic_type]=*');
  },

  updateProfile: (id, data) => {
    return api.put(`/users/${id}`, data)
  },

  getProfiles: (params = {}) => {
    return api.get('/profiles', params)
  },

  getProfile: (id) => {
    return api.get(`/profiles/${id}?populate=*`)
  },

  createProfile: (data) => {
    return api.post('/profiles', { data })
  },

  updateProfileData: (id, data) => {
    return api.put(`/profiles/${id}`, { data })
  },
}

// Organization API
export const orgAPI = {
  getOrganizations: () => {
    return api.get('/organizations')
  },

  getFaculties: () => {
    return api.get('/faculties')
  },

  getDepartments: () => {
    return api.get('/departments')
  },

  getAcademicTypes: () => {
    return api.get('/academic-types')
  },

  getEducationLevels: () => {
    return api.get('/education-levels')
  },
}

// Project Research API
export const projectAPI = {
  getProjects: (params = {}) => {
    return api.get('/project-researches', params)
  },

  getProject: (id) => {
    return api.get(`/project-researches/${id}?populate=*`)
  },

  createProject: (data) => {
    return api.post('/project-researches', { data })
  },

  updateProject: (id, data) => {
    return api.put(`/project-researches/${id}`, { data })
  },

  deleteProject: (id) => {
    return api.delete(`/project-researches/${id}`)
  },
}

// Work API (Books, Conferences, Publications)
export const worksAPI = {
  // Work Books
  getBooks: (params = {}) => {
    return api.get('/work-books', params)
  },

  getBook: (id) => {
    return api.get(`/work-books/${id}?populate=*`)
  },

  createBook: (data) => {
    return api.post('/work-books', { data })
  },

  updateBook: (id, data) => {
    return api.put(`/work-books/${id}`, { data })
  },

  deleteBook: (id) => {
    return api.delete(`/work-books/${id}`)
  },

  // Work Conferences
  getConferences: (params = {}) => {
    return api.get('/work-conferences', params)
  },

  getConference: (id) => {
    return api.get(`/work-conferences/${id}?populate=*`)
  },

  createConference: (data) => {
    return api.post('/work-conferences', { data })
  },

  updateConference: (id, data) => {
    return api.put(`/work-conferences/${id}`, { data })
  },

  deleteConference: (id) => {
    return api.delete(`/work-conferences/${id}`)
  },

  // Work Publications
  getPublications: (params = {}) => {
    return api.get('/work-publications', params)
  },

  getPublication: (id) => {
    return api.get(`/work-publications/${id}?populate=*`)
  },

  createPublication: (data) => {
    return api.post('/work-publications', { data })
  },

  updatePublication: (id, data) => {
    return api.put(`/work-publications/${id}`, { data })
  },

  deletePublication: (id) => {
    return api.delete(`/work-publications/${id}`)
  },
}

// Upload API
export const uploadAPI = {
  uploadFiles: async (files) => {
    const formData = new FormData()
    
    files.forEach((file) => {
      formData.append('files', file)
    })

    const token = api.getToken()
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return await response.json()
  },

  getFiles: () => {
    return api.get('/upload/files')
  },

  getFile: (id) => {
    return api.get(`/upload/files/${id}`)
  },

  deleteFile: (id) => {
    return api.delete(`/upload/files/${id}`)
  },
}


export default api
