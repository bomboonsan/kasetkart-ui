// Refactored API base using modular approach
import axiosInstance from '@/lib/http/axios'
import { HttpClient } from '@/lib/http/client'
import { tokenManager } from '@/lib/auth/token-manager'
import { ErrorHandler } from '@/lib/http/error-handler'
import { API_BASE as API_BASE_URL } from '@/lib/config/api'

export const API_BASE = API_BASE_URL

// Legacy axios instance export (preserved for backward compatibility)
export const apiAuth = axiosInstance

// Legacy API client for backward compatibility (delegating to modular components)
class LegacyApiClient {
  constructor() {
    this.httpClient = new HttpClient(API_BASE);
  }

  // Delegate HTTP methods to the new client
  async request(endpoint, options = {}) {
    return this.httpClient.request(endpoint, options);
  }

  get(endpoint, params = {}) {
    return this.httpClient.get(endpoint, params);
  }

  post(endpoint, data) {
    return this.httpClient.post(endpoint, data);
  }

  put(endpoint, data) {
    return this.httpClient.put(endpoint, data);
  }

  patch(endpoint, data) {
    return this.httpClient.patch(endpoint, data);
  }

  delete(endpoint) {
    return this.httpClient.delete(endpoint);
  }

  // Delegate token methods to token manager
  getToken() {
    return tokenManager.getToken();
  }

  setToken(token) {
    return tokenManager.setToken(token);
  }

  removeToken() {
    return tokenManager.removeToken();
  }
}

// Export instance that maintains existing API for compatibility
export const api = new LegacyApiClient();

// Server-side API function with simplified error handling
export async function serverGet(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const token = process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(url, { method: 'GET', headers });
    
    if (!response.ok) {
      const error = await ErrorHandler.processResponse(response);
      throw error;
    }

    return await response.json();
  } catch (error) {
    throw ErrorHandler.formatError(error, 'Server GET');
  }
}


