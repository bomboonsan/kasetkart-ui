// Central Axios instance with existing interceptors (behavior preserved)
import axios from 'axios'
import { API_BASE } from '@/lib/config/api'

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.__NEXTAUTH?.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null)
    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
