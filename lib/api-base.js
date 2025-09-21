/**
 * Legacy API compatibility layer
 * This provides backward compatibility for components still using REST-style API calls
 * TODO: Replace these calls with proper GraphQL API calls
 */

import { projectAPI, worksAPI, profileAPI, userAPI, orgAPI } from '@/lib/api'
import { STRAPI_REST_ENDPOINT } from '@/lib/config/api'
import { tokenManager } from '@/lib/auth/token-manager'

async function resolveAuthToken() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null
  }

  const immediate = tokenManager.getToken()
  if (immediate) return immediate

  try {
    return await tokenManager.getSessionToken()
  } catch (error) {
    return null
  }
}

async function legacyFetch(path, { method = 'GET', headers = {}, body, params } = {}) {
  const token = await resolveAuthToken()
  
  let url = `${STRAPI_REST_ENDPOINT}${path}`
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    url += `?${searchParams.toString()}`
  }
  
  const response = await fetch(url, {
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

// Legacy API object for backward compatibility
export const api = {
  get: (path, params) => legacyFetch(path, { method: 'GET', params }),
  post: (path, body) => legacyFetch(path, { method: 'POST', body }),
  put: (path, body) => legacyFetch(path, { method: 'PUT', body }),
  delete: (path) => legacyFetch(path, { method: 'DELETE' }),
}

// Export API_BASE for components that need it
export const API_BASE = STRAPI_REST_ENDPOINT