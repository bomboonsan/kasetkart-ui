'use client'

import { useRef } from 'react'
import UserManagement from '@/components/UserManagement'
import PageHeader from '@/components/PageHeader'
import Button from '@/components/Button'

export default function ManageUsersPage() {
  const userManagementRef = useRef()

  const handleAddUser = () => {
    if (userManagementRef.current) {
      userManagementRef.current.openCreateModal()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="จัดการผู้ใช้งาน"
          showAddButton={false}
        />
        <div>
          <Button onClick={handleAddUser}>เพิ่มผู้ใช้งาน</Button>
        </div>
      </div>
      <UserManagement ref={userManagementRef} />
    </div>
  )
}
