'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'

export default function AuthGuard({ children, requireAuth = true, requireRole = null }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (requireAuth) {
        const currentUser = getCurrentUser()
        
        if (!currentUser) {
          router.push('/login')
          return
        }

        // Check role requirement
        if (requireRole && currentUser.role !== requireRole) {
          router.push('/unauthorized')
          return
        }

        setUser(currentUser)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [requireAuth, requireRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect to login
  }

  return children
}
