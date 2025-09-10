// โมดูล authAPI (คงไว้รองรับโค้ดเดิม แม้ย้ายไปใช้ NextAuth แล้ว)
import { api } from '../api-base'

export const authAPI = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/local', { identifier, password })
    if (response?.jwt) api.setToken(response.jwt)
    return response
  },
  register: async (username, email, password) => {
    const response = await api.post('/auth/local/register', { username, email, password })
    if (response?.jwt) api.setToken(response.jwt)
    return response
  },
  logout: () => api.removeToken(),
  me: () => api.get('/users/me?populate=*'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (code, password, passwordConfirmation) => api.post('/auth/reset-password', { code, password, passwordConfirmation }),
  changePassword: (currentPassword, password, passwordConfirmation) => api.post('/auth/change-password', { currentPassword, password, passwordConfirmation }),
}
