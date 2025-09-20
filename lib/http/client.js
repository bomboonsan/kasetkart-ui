// Clean HTTP client focused on request/response handling
// Separated from token management and error handling concerns

import { tokenManager } from '@/lib/auth/token-manager';
import { ErrorHandler } from './error-handler';

export class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Make HTTP request with automatic token injection
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token and prepare headers
    let token = tokenManager.getToken();
    
    // Try NextAuth session if no immediate token found
    if (!token && typeof window !== 'undefined') {
      token = await tokenManager.getSessionToken();
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Serialize body if it's an object
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw await ErrorHandler.processResponse(response);
      }

      return this._parseResponse(response);
    } catch (error) {
      throw ErrorHandler.formatError(error, `HTTP ${options.method || 'GET'}`);
    }
  }

  /**
   * GET request
   */
  get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data) {
    return this.request(endpoint, { method: 'PATCH', body: data });
  }

  /**
   * DELETE request
   */
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Parse response body safely
   */
  async _parseResponse(response) {
    const text = await response.text().catch(() => '');
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
}