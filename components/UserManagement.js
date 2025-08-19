'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import UserTable from './UserTable'
import UserFilters from './UserFilters'
import UserModal from './UserModal'

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    role: 'Admin',
    department: 'IT Department',
    status: 'Active',
    lastLogin: '2025-08-19',
    avatar: 'JC'
  },
  {
    id: 2,
    name: 'Floyd Miles',
    email: 'floyd.miles@example.com',
    role: 'User',
    department: 'Research Department',
    status: 'Active',
    lastLogin: '2025-08-18',
    avatar: 'FM'
  },
  {
    id: 3,
    name: 'Ronald Richards',
    email: 'ronald.richards@example.com',
    role: 'Moderator',
    department: 'Academic Affairs',
    status: 'Inactive',
    lastLogin: '2025-08-15',
    avatar: 'RR'
  },
  {
    id: 4,
    name: 'Marvin McKinney',
    email: 'marvin.mckinney@example.com',
    role: 'User',
    department: 'Finance Department',
    status: 'Active',
    lastLogin: '2025-08-19',
    avatar: 'MM'
  },
  {
    id: 5,
    name: 'Jerome Bell',
    email: 'jerome.bell@example.com',
    role: 'User',
    department: 'HR Department',
    status: 'Pending',
    lastLogin: 'Never',
    avatar: 'JB'
  },
  {
    id: 6,
    name: 'Kathryn Murphy',
    email: 'kathryn.murphy@example.com',
    role: 'Admin',
    department: 'IT Department',
    status: 'Active',
    lastLogin: '2025-08-19',
    avatar: 'KM'
  }
]

const UserManagement = forwardRef((props, ref) => {
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view', 'edit', 'create'

  useImperativeHandle(ref, () => ({
    openCreateModal: () => {
      handleUserAction('create')
    }
  }))

  const handleFilter = (filters) => {
    let filtered = users

    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(user => user.department === filters.department)
    }

    setFilteredUsers(filtered)
  }

  const handleUserAction = (action, user = null) => {
    switch (action) {
      case 'view':
        setSelectedUser(user)
        setModalMode('view')
        setIsModalOpen(true)
        break
      case 'edit':
        setSelectedUser(user)
        setModalMode('edit')
        setIsModalOpen(true)
        break
      case 'create':
        setSelectedUser(null)
        setModalMode('create')
        setIsModalOpen(true)
        break
      case 'delete':
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
          setUsers(prev => prev.filter(u => u.id !== user.id))
          setFilteredUsers(prev => prev.filter(u => u.id !== user.id))
        }
        break
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: 'Active' } : u
        ))
        setFilteredUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: 'Active' } : u
        ))
        break
      case 'deactivate':
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: 'Inactive' } : u
        ))
        setFilteredUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: 'Inactive' } : u
        ))
        break
    }
  }

  const handleSaveUser = (userData) => {
    if (modalMode === 'create') {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id)) + 1,
        lastLogin: 'Never',
        avatar: userData.name.split(' ').map(n => n[0]).join('')
      }
      setUsers(prev => [...prev, newUser])
      setFilteredUsers(prev => [...prev, newUser])
    } else if (modalMode === 'edit') {
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ))
      setFilteredUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ))
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <UserFilters onFilter={handleFilter} />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 hidden">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">ผู้ใช้ทั้งหมด</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">ผู้ใช้ที่ใช้งานอยู่</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">รอการอนุมัติ</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 008.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">ผู้ใช้ที่ไม่ใช้งาน</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.status === 'Inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable 
        users={filteredUsers}
        onUserAction={handleUserAction}
      />

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
})

UserManagement.displayName = 'UserManagement'

export default UserManagement
