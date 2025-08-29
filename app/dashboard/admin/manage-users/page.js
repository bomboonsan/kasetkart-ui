'use client'

import { useRef } from 'react'
import UserManagement from '@/components/UserManagement'
import PageHeader from '@/components/PageHeader'

export default function ManageUsersPage() {
  const userManagementRef = useRef()

  const handleAddUser = () => {
    if (userManagementRef.current) {
      userManagementRef.current.openCreateModal()
    }
  }

  console.log(userManagementRef);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="จัดการผู้ใช้งาน"
        showAddButton={true}
        onAddClick={handleAddUser}
      />
      <UserManagement ref={userManagementRef} />
    </div>
  )
}
