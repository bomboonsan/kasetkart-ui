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
      const role = session?.user?.role
      if (role !== requireRole) router.replace('/unauthorized')
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
  if (requireRole && session?.user?.role !== requireRole) return null

  return children
}
