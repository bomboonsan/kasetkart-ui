// Deprecated legacy auth helpers replaced by NextAuth.js integration.
// Token functions now delegated to centralized token manager.
import { tokenManager } from './auth/token-manager'

export const auth = {}
export const getUserRole = () => null
export const getCurrentUser = () => null
export const isAuthenticated = () => false

// Delegate token operations to centralized manager
export const getToken = () => tokenManager.getToken()
export const setToken = (token) => tokenManager.setToken(token)
export const removeToken = () => tokenManager.removeToken()
