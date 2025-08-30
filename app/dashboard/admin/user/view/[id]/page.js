"use client"

import { useParams } from 'next/navigation'
import AdminUserHeader from '@/components/admin/user/AdminUserHeader'
import AdminEducationSection from '@/components/admin/user/AdminEducationSection'
import AdminUserWorksSection from '@/components/admin/user/AdminUserWorksSection'

export default function AdminUserViewPage() {
  const params = useParams()
  const userId = params?.id

  return (
    <div className="space-y-6">
      <AdminUserHeader userId={userId} />
      <AdminEducationSection userId={userId} />
      <AdminUserWorksSection userId={userId} />
    </div>
  )
}

