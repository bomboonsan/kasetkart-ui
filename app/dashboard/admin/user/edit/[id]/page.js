"use client"

import { useParams } from 'next/navigation'
import AdminUserEditForm from '@/components/admin/user/AdminUserEditForm'

export default function AdminUserEditPage() {
  const params = useParams()
  const userId = params?.id

  return (
    <div className="space-y-6">
      <AdminUserEditForm userId={userId} />
    </div>
  )
}

