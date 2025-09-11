'use client'

import AdminUserEditForm from '@/components/admin/user/AdminUserEditForm'
import { useParams } from 'next/navigation'

export default function UserEditPage() {
  const params = useParams()
  const { id } = params

  return (
    <div className="space-y-6">
      {/* คอมเมนต์ (ไทย): เปลี่ยนไปใช้ฟอร์มสำหรับ Admin โดยเฉพาะ */}
      <AdminUserEditForm userId={id} />
    </div>
  )
}


