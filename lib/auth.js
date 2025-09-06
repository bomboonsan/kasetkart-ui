import { authAPI } from './api'

export const auth = {
  login: authAPI.login,
  logout: authAPI.logout,
  register: authAPI.register,
  me: authAPI.me,
  forgotPassword: authAPI.forgotPassword,
  resetPassword: authAPI.resetPassword,
  changePassword: authAPI.changePassword,
}

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('jwt')
  if (!token) return null

  try {
    // Decode JWT payload (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // Check if token is expired
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwt')
      return null
    }

    return {
      id: payload.id,
      username: payload.username || payload.email,
      email: payload.email,
      role: payload.role?.type || 'authenticated',
    }
  } catch (error) {
    console.error('Invalid token:', error)
    localStorage.removeItem('jwt')
    return null
  }
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jwt')
}

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', token)
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
  }
}
