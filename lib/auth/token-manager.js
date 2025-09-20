// Centralized token management for authentication
// Handles both NextAuth and localStorage token storage patterns

export class TokenManager {
  /**
   * Get authentication token from various sources
   * Priority: NextAuth runtime -> localStorage -> null
   */
  getToken() {
    if (typeof window === 'undefined') return null;

    // Try NextAuth runtime storage first
    const nextAuthToken = this._getNextAuthToken();
    if (nextAuthToken) return nextAuthToken;

    // Fallback to localStorage
    return this._getLocalStorageToken();
  }

  /**
   * Set authentication token in both storage locations
   */
  setToken(token) {
    if (typeof window === 'undefined') return;

    this._setLocalStorageToken(token);
    this._setNextAuthToken(token);
  }

  /**
   * Remove authentication token from all storage locations
   */
  removeToken() {
    if (typeof window === 'undefined') return;

    this._removeLocalStorageToken();
    this._removeNextAuthToken();
  }

  /**
   * Get token from NextAuth session via dynamic import
   * Returns Promise<string|null>
   */
  async getSessionToken() {
    if (typeof window === 'undefined') return null;

    try {
      const nextAuth = await import('next-auth/react');
      const session = await nextAuth.getSession();
      
      // Check various session shapes for JWT
      return session?.jwt || 
             session?.session?.jwt || 
             session?.user?.jwt || 
             null;
    } catch (e) {
      return null;
    }
  }

  // Private methods for specific storage operations
  _getNextAuthToken() {
    try {
      return window.__NEXTAUTH?.token || 
             window.__NEXTAUTH?.session?.accessToken || 
             null;
    } catch (e) {
      return null;
    }
  }

  _getLocalStorageToken() {
    try {
      return localStorage.getItem('jwt');
    } catch (e) {
      return null;
    }
  }

  _setLocalStorageToken(token) {
    try {
      localStorage.setItem('jwt', token);
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  _setNextAuthToken(token) {
    try {
      if (window.__NEXTAUTH) {
        window.__NEXTAUTH.token = token;
      } else {
        window.__NEXTAUTH = { token };
      }
    } catch (e) {
      // Ignore NextAuth storage errors
    }
  }

  _removeLocalStorageToken() {
    try {
      localStorage.removeItem('jwt');
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  _removeNextAuthToken() {
    try {
      if (window.__NEXTAUTH) {
        delete window.__NEXTAUTH.token;
      }
    } catch (e) {
      // Ignore NextAuth storage errors
    }
  }
}

// Export singleton instance for consistent usage
export const tokenManager = new TokenManager();