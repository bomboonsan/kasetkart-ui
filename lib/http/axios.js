// Central Axios instance with existing interceptors (behavior preserved)
import axios from 'axios'
import { API_BASE } from '@/lib/config/api'
import { tokenManager } from '@/lib/auth/token-manager'

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = tokenManager.getToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default axiosInstance
