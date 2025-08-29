import { api } from './api'

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  console.log('login')
  console.log(`email : ${email}`)
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', res.token)
    localStorage.setItem('currentUser', JSON.stringify(res.user))
  }
  return res
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

