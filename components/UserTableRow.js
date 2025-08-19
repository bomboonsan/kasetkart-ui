'use client'

import { useState } from 'react'

export default function UserTableRow({ user, onAction }) {
  const [showDropdown, setShowDropdown] = useState(false)

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    }
    
    const labels = {
      Active: 'ใช้งานอยู่',
      Inactive: 'ไม่ใช้งาน',
      Pending: 'รอการอนุมัติ'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getRoleBadge = (role) => {
    const styles = {
      Admin: 'bg-purple-100 text-purple-800',
      Moderator: 'bg-blue-100 text-blue-800',
      User: 'bg-gray-100 text-gray-800'
    }

    const labels = {
      Admin: 'ผู้ดูแลระบบ',
      Moderator: 'ผู้ดูแล',
      User: 'ผู้ใช้'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    )
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
              {user.avatar}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getRoleBadge(user.role)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(user.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.lastLogin}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            การกระทำ
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showDropdown && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onAction('view', user)
                    setShowDropdown(false)
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  ดูรายละเอียด
                </button>
                <button
                  onClick={() => {
                    onAction('edit', user)
                    setShowDropdown(false)
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  แก้ไข
                </button>
                {user.status === 'Active' ? (
                  <button
                    onClick={() => {
                      onAction('deactivate', user)
                      setShowDropdown(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    ระงับการใช้งาน
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAction('activate', user)
                      setShowDropdown(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    เปิดใช้งาน
                  </button>
                )}
                <button
                  onClick={() => {
                    onAction('delete', user)
                    setShowDropdown(false)
                  }}
                  className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                >
                  ลบผู้ใช้
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
