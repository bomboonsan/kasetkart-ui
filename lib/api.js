import axios from 'axios'

// Strapi API Client
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kasetbackend.bomboonsan.com/api'

export const apiAuth = axios.create({
  baseURL: API_BASE,
  // ตั้งค่าเริ่มต้นเพื่อไม่ให้เกิดข้อผิดพลาด CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม Interceptor สำหรับการตั้งค่า Bearer Token
apiAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

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
        // Try to parse JSON error, otherwise include raw text
        let errorText = ''
        try {
          const errorData = await response.json().catch(() => null)
          if (errorData && (errorData.error || errorData.message || errorData)) {
            errorText = (errorData.error?.message || errorData.message || JSON.stringify(errorData))
          }
        } catch (e) {
          // ignore
        }
        if (!errorText) {
          try {
            errorText = await response.text()
          } catch (e) {
            errorText = `HTTP ${response.status}`
          }
        }
        // Do not log to console in production UI; preserve error propagation
        throw new Error(errorText || `HTTP ${response.status}`)
      }

      // Some endpoints may return an empty body (204 No Content) or plain text.
      // Read text first and parse JSON only when present to avoid "Unexpected end of JSON input".
      const text = await response.text().catch(() => '')
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch (e) {
        // If it's not JSON, return the raw text
        return text
      }
    } catch (error) {
      // Propagate error without logging to console
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
    // หมายเหตุ (ไทย): ดึงเฉพาะข้อมูลที่จำเป็นสำหรับ Sidebar และรูปภาพโปรไฟล์
  // Include role so sidebar can show user's role without extra requests
  return api.get('/users/me?populate[profile][populate]=avatarUrl&populate[role]=*&publicationState=preview');
  },

  getMyProfile: () => {
    // หมายเหตุ (ไทย): populate ความสัมพันธ์ที่ใช้ในหน้าแก้ไขโปรไฟล์ให้ครบถ้วน
    // - profile (รวม avatarUrl)
    // - organization, faculty, department, academic_type, participation_type (one-to-one บน user)
    // - educations (one-to-many) พร้อม education_level
    // - ใช้ publicationState=preview เพื่อดู draft content
    return api.get(
      '/users/me' +
      '?populate[profile][populate]=avatarUrl' +
      '&populate[organization]=*' +
      '&populate[faculty]=*' +
      '&populate[department]=*' +
      '&populate[academic_type]=*' +
      '&populate[participation_type]=*' +
      '&populate[educations][populate]=education_level' +
      '&publicationState=preview'
    )
  },

  updateProfile: (id, data) => {
  // Strapi v5 expects updates in the { data: { ... } } envelope for content types
  return api.put(`/users/${id}`, { data })
  },

  getProfiles: (params = {}) => {
    return api.get('/profiles', params)
  },

  getProfile: (documentId) => {
    // Strapi v5: ใช้ documentId แทน id
    return api.get(`/profiles/${documentId}?populate=*&publicationState=preview`)
  },

  createProfile: (data) => {
    return api.post('/profiles', { data })
  },

  updateProfileData: (documentId, data) => {
    // Strapi v5: ใช้ documentId แทน id
    return api.put(`/profiles/${documentId}`, { data })
  },

  // Helper method to find profile by user ID - returns profile with documentId
  findProfileByUserId: async (userId) => {
    if (!userId) return null
    const response = await api.get(`/profiles?filters[user][id][$eq]=${userId}&publicationState=preview`)
    const profiles = response?.data || response || []
    return Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null
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

  getAcademicType: () => {
    return api.get('/academic-types')
  },

  getParticipationTypes: () => {
    return api.get('/participation-types')
  },
}

// Education API (สำหรับวุฒิการศึกษา)
// หมายเหตุ (ไทย): content-type `education` เก็บข้อมูลระดับการศึกษา, ชื่อสถาบัน, คณะ/สาขา, ปี และผูกกับผู้ใช้ผ่านฟิลด์ users_permissions_user
export const eduAPI = {
  listMine: (userId) => {
    // หมายเหตุ (ไทย): กรองด้วย users_permissions_user.id และ populate ระดับการศึกษา
    const params = new URLSearchParams()
    params.set('filters[users_permissions_user][id][$eq]', userId)
    params.set('populate', 'education_level')
    params.set('publicationState', 'preview')
    return api.get(`/educations?${params.toString()}`)
  },

  create: (data) => {
    // หมายเหตุ (ไทย): รูปแบบที่ Strapi ต้องการคือ { data: {...} }
    return api.post('/educations', { data })
  },

  update: (documentId, data) => {
    // Strapi v5: ใช้ documentId แทน id
    return api.put(`/educations/${documentId}`, { data })
  },

  remove: (documentId) => {
    // Strapi v5: ใช้ documentId แทน id
    return api.delete(`/educations/${documentId}`)
  },
}

// Value From API 
export const valueFromAPI = {
  getDepartments: () => {
    return api.get('/departments')
  },
  getIcTypes: () => {
    return api.get('/ic-types')
  },
  getImpacts: () => {
    return api.get('/impacts')
  },
  getSDGs: () => {
    return api.get('/sdgs')
  },
}

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => {
    // Get counts for different content types
    return Promise.all([
      projectAPI.getProjects(),
      fundingAPI.getFundings(),
      worksAPI.getPublications(),
      worksAPI.getConferences(),
      worksAPI.getBooks(),
    ])
  },

  getPersonnelByAcademicType: async (departmentId = null) => {
    try {
      let params = ''
      if (departmentId) {
        params = `?departmentId=${departmentId}`
      }

      const response = await api.get(`/dashboard/personnel-by-academic-type${params}`)
      return response?.data || response || {}
    } catch (error) {
      // swallow errors and return defaults
      return {}
    }
  },

  getResearchStatsByTypes: async (departmentId = null) => {
    try {
      let params = ''
      if (departmentId) {
        params = `?departmentId=${departmentId}`
      }

      const response = await api.get(`/dashboard/research-stats-by-types${params}`)
      return response?.data || response || { icTypes: [], impacts: [], sdgs: [] }
    } catch (error) {
      // swallow errors and return defaults
      return { icTypes: [], impacts: [], sdgs: [] }
    }
  },
}

// Project Research API
export const projectAPI = {
  getProjects: (params = {}) => {
    return api.get('/project-researches', params)
  },

  getMyProjects: async () => {
    try {
      // Get current user first
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id

      if (!userId) {
        throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      }

      // Get all projects with research_partners populated
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user')

      // Filter projects where current user is a partner
      const myProjects = allProjects.data?.filter(project => {
        const partners = project.research_partners || []
        return partners.some(partner => {
          const partnerId = partner.users_permissions_user?.id
          return partnerId === userId
        })
      }) || []

      return { data: myProjects }
    } catch (error) {
      // Filtering failed; fallback to returning all projects
      try {
        const allProjects = await api.get('/project-researches')
        return allProjects
      } catch (fallbackError) {
        throw error
      }
    }
  },

  // Admin helper: fetch projects where an arbitrary user (by id) is a research partner
  getProjectsByUser: async (userId) => {
    try {
      if (!userId) throw new Error('userId is required')
      // Get all projects with research partners populated then filter client-side
      const allProjects = await api.get('/project-researches?populate[research_partners][populate]=users_permissions_user')
      const list = allProjects?.data || allProjects || []
      const filtered = Array.isArray(list) ? list.filter(project => {
        const partners = project.research_partners || []
        return partners.some(partner => (partner.users_permissions_user?.id) === userId)
      }) : []
      return { data: filtered }
    } catch (error) {
      // Fallback: return empty list (avoid breaking admin UI)
      return { data: [] }
    }
  },

  getProject: (id) => {
    return api.get(`/project-researches/${id}?populate=*`)
  },

  getProjectPartners: (projectId) => {
    return api.get(`/project-partners?populate=users_permissions_user&filters[project_researches][documentId][$eq]=${projectId}`)
  },

  updatePartner: (documentId, data) => {
    return api.put(`/project-partners/${documentId}`, { data })
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

// Project Funding API
export const fundingAPI = {
  getFundings: (params = {}) => {
    return api.get('/project-fundings', params)
  },

  // Get fundings belonging to current user. Returns { data: [...] } or array-like
  getMyFundings: async (params = {}) => {
    try {
      // Get current user id
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id

      if (!userId) {
        throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
      }

      // Build query: filter by users_permissions_user relation (common pattern)
      const searchParams = new URLSearchParams()
      // include any client-supplied params like populate/publicationState
      // but keep filter for user
      searchParams.set('filters[users_permissions_user][id][$eq]', userId)
      // allow callers to request populate or pagination by passing params object
      for (const [k, v] of Object.entries(params || {})) {
        searchParams.set(k, v)
      }

      const endpoint = `/project-fundings?${searchParams.toString()}`
      return await api.get(endpoint)
    } catch (error) {
      // If server-side filter isn't available, fallback to fetching all and filtering client-side
      try {
        const all = await api.get('/project-fundings?populate=*')
        const list = all?.data || all || []
        const userRes = await api.get('/users/me')
        const userId = userRes.data?.id || userRes.id
        const filtered = Array.isArray(list) ? list.filter(item => {
          const owners = item.users_permissions_user || item.user || []
          // owners may be array or single object
          if (Array.isArray(owners)) return owners.some(o => o?.id === userId)
          return owners?.id === userId
        }) : []
        return { data: filtered }
      } catch (e) {
        throw error
      }
    }
  },

  getFunding: (id) => {
    return api.get(`/project-fundings/${id}?populate=*`)
  },

  createFunding: (data) => {
    return api.post('/project-fundings', { data })
  },

  updateFunding: (id, data) => {
    return api.put(`/project-fundings/${id}`, { data })
  },

  deleteFunding: (id) => {
    return api.delete(`/project-fundings/${id}`)
  },
}

// Work API (Books, Conferences, Publications)
export const worksAPI = {
  // Work Books
  getBooks: (params = {}) => {
    return api.get('/work-books', params)
  },

  // Get books belonging to current user. Attempts server-side filter; falls back to client-side filtering
  getMyBooks: async (params = {}) => {
    try {
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id
      if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')

      const searchParams = new URLSearchParams()
      searchParams.set('filters[users_permissions_user][id][$eq]', userId)
      for (const [k, v] of Object.entries(params || {})) {
        searchParams.set(k, v)
      }

      const endpoint = `/work-books?${searchParams.toString()}`
      return await api.get(endpoint)
    } catch (error) {
      // fallback: fetch all and filter client-side
      try {
        const all = await api.get('/work-books?populate=*')
        const list = all?.data || all || []
        const userRes = await api.get('/users/me')
        const userId = userRes.data?.id || userRes.id
        const filtered = Array.isArray(list) ? list.filter(item => {
          // common relation fields: users_permissions_user, authors, user
          const owners = item.users_permissions_user || item.authors || item.user || []
          if (Array.isArray(owners)) return owners.some(o => o?.id === userId)
          return owners?.id === userId
        }) : []
        return { data: filtered }
      } catch (e) {
        throw error
      }
    }
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

  // Get conferences belonging to current user. Attempts server-side filter; falls back to client-side filtering
  getMyConferences: async (params = {}) => {
    try {
      const userRes = await api.get('/users/me')
      const userId = userRes.data?.id || userRes.id
      if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')

      const searchParams = new URLSearchParams()
      searchParams.set('filters[users_permissions_user][id][$eq]', userId)
      for (const [k, v] of Object.entries(params || {})) {
        searchParams.set(k, v)
      }

      const endpoint = `/work-conferences?${searchParams.toString()}`
      return await api.get(endpoint)
    } catch (error) {
      // fallback: fetch all and filter client-side
      try {
        const all = await api.get('/work-conferences?populate=*')
        const list = all?.data || all || []
        const userRes = await api.get('/users/me')
        const userId = userRes.data?.id || userRes.id
        const filtered = Array.isArray(list) ? list.filter(item => {
          // common relation fields: users_permissions_user, authors, presenters, user
          const owners = item.users_permissions_user || item.authors || item.presenters || item.user || []
          if (Array.isArray(owners)) return owners.some(o => o?.id === userId)
          return owners?.id === userId
        }) : []
        return { data: filtered }
      } catch (e) {
        throw error
      }
    }
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

export const reportAPI = {
  // Report
  getImpacts: (params = {}) => {
    // Return impacts list from Strapi; allow optional query params (filters, populate, pagination)
    return api.get('/impacts', params)
  }

  ,
  getImpactsByDepartment: (params = {}) => {
    // Server-side aggregated report: impacts by department
    return api.get('/reports/impacts-by-department', params)
  }
}


// User API for admin operations
export const userAPI = {
  createUser: async (data) => {
    // Create user using admin endpoint instead of registration
    const userData = {
      username: data.email,
      email: data.email,
      password: data.password || 'defaultPassword123',
      confirmed: true, // Auto-confirm the user
      blocked: false,
      role: 2, // Assuming '2' is the role ID for standard users
      // Include relations directly in user creation
      ...(data.organizationID && { organization: data.organizationID }),
      ...(data.facultyId && { faculty: data.facultyId }),
      ...(data.departmentId && { department: data.departmentId }),
      ...(data.academic_type && { academic_type: data.academic_type }),
      ...(data.participation_type && { participation_type: data.participation_type }),
    }

    // debug: creating user with admin endpoint

    try {
      // Use admin users endpoint with proper format
      const response = await api.post('/users', userData)
      // user creation response handled
      return response
    } catch (error) {
      // If admin endpoint fails, try alternative approach
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        // trying alternative user creation method

        // Try with minimal data first, then update
        const minimalUser = {
          username: data.email,
          email: data.email,
          password: data.password || 'defaultPassword123',
          confirmed: true,
          blocked: false
        }

        const userResponse = await api.post('/users', minimalUser)

        // Then update with relations if user was created successfully
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
    // First try to find existing profile
    const existingProfile = await profileAPI.findProfileByUserId(userId)

    if (existingProfile?.documentId) {
      // Update existing profile using documentId
      return await profileAPI.updateProfileData(existingProfile.documentId, profileData)
    } else {
      // Create new profile
      return await profileAPI.createProfile({ ...profileData, user: userId })
    }
  }
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

    // Robust parsing: read text and parse JSON only if non-empty
    const text = await response.text().catch(() => '')
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
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

// Server-side helper for Next.js server components.
// Use an admin token provided via environment variable (e.g. NEXT_ADMIN_JWT).
// This avoids relying on localStorage (which is unavailable on server).
export async function serverGet(endpoint) {
  const url = `${API_BASE}${endpoint}`
  const token = process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  try {
    const response = await fetch(url, { method: 'GET', headers })

    if (!response.ok) {
      let errorText = ''
      try {
        const errorData = await response.json().catch(() => null)
        if (errorData && (errorData.error || errorData.message || errorData)) {
          errorText = (errorData.error?.message || errorData.message || JSON.stringify(errorData))
        }
      } catch (e) {
        // ignore
      }
      if (!errorText) {
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = `HTTP ${response.status}`
        }
      }
      throw new Error(errorText || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}
