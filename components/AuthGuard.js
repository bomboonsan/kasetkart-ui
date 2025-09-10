'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children, requireAuth = true, requireRole = null }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!requireAuth) return
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else if (status === 'authenticated' && requireRole) {
      // รองรับทั้งกรณีที่ backend ส่ง role เป็นตัวเลข (roleId)
      // หรือส่งเป็นชื่อ role (role)
      const roleId = session?.user?.roleId
      const roleName = session?.user?.role
      // ถ้ามี roleId ให้แมปตามค่าในคำถาม (1=Super admin, 2=User, 3=Admin)
      const resolvedRole = roleId === 1 ? 'Super admin' : roleId === 3 ? 'Admin' : (roleName || null)
      if (resolvedRole !== requireRole) router.replace('/unauthorized')
    }
  }, [status, requireAuth, requireRole, session, router])

  if (status === 'loading' && requireAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (requireAuth && status === 'unauthenticated') return null
  // สำหรับการเช็กตอน render: ให้ตรวจสอบ roleId ก่อน ถ้าไม่มีให้ใช้ role (ชื่อ)
  if (requireRole) {
    const roleId = session?.user?.roleId
    const roleName = session?.user?.role
    const resolvedRole = roleId === 1 ? 'Super admin' : roleId === 3 ? 'Admin' : (roleName || null)
    if (resolvedRole !== requireRole) return null
  }

  return children
}
