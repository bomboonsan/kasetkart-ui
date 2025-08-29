"use client"

import AddUserForm from '@/components/admin/AddUserForm'
import { getCurrentUser } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function AdminAddUserPage() {
  const [allowed, setAllowed] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    if (u && (u.role === 'ADMIN' || u.role === 'SUPERADMIN')) {
      setAllowed(true)
    }
    setChecked(true)
  }, [])

  if (!checked) return null
  if (!allowed) return <div className="p-6 text-red-600">403 Forbidden - เฉพาะผู้ดูแลระบบเท่านั้น</div>

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-800">เพิ่มผู้ใช้ใหม่</div>
      <AddUserForm />
    </div>
  )
}

