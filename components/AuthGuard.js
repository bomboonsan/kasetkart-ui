'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const isAuthPage = pathname === '/login'
    let token = null
    try {
      // ตรวจจาก localStorage หรือ cookie ฝั่ง client
      token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token && typeof document !== 'undefined') {
        const cookieStr = document.cookie || ''
        const m = cookieStr.split(';').map(s => s.trim()).find(s => s.startsWith('token='))
        if (m) token = m.split('=')[1]
      }
    } catch {}

    if (!token && !isAuthPage) {
      // ไม่ได้ล็อกอินและไม่ใช่หน้า login → ส่งกลับหน้า login
      router.replace('/login')
      setAllowed(false)
      return
    }
    setAllowed(true)
  }, [pathname, router])

  // ซ่อนเนื้อหาระหว่างตรวจสอบ/กำลัง redirect
  if (!allowed && pathname !== '/login') return null
  return children
}
