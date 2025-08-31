import { api } from './api'

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  console.log('login')
  console.log(`email : ${email}`)
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', res.token)
    localStorage.setItem('currentUser', JSON.stringify(res.user))
    try {
      // ตั้ง cookie token สำหรับ middleware ฝั่ง server
      const maxAge = 7 * 24 * 60 * 60 // 7 วัน
      document.cookie = `token=${res.token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    } catch {}
  }
  return res
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    try {
      // ลบ cookie token
      document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax'
    } catch {}
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
