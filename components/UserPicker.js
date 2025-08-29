'use client'

import { useEffect, useState } from 'react'
import Button from './Button'
import { userAPI } from '@/lib/api'

export default function UserPicker({ label = 'ผู้ร่วมงาน', onSelect, selectedUser }) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await userAPI.getUsers({ role: 'USER', pageSize: 1000 })
        const data = res.data || res.items || []
        setUsers(data)
      } catch (err) {
        setError(err.message || 'ต้องเป็นผู้ดูแลระบบจึงจะสามารถค้นหารายชื่อผู้ใช้ได้')
      } finally {
        setLoading(false)
      }
    })()
  }, [open])

  return (
    <div className="space-y-1 flex items-center">
      <div className="w-1/3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="flex-1 space-x-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-medium py-2 px-4 rounded-md transition-colors duration-200 text-zinc-600 text-sm bg-white hover:bg-gray-50 border border-gray-300 shadow-sm"
        >
          {selectedUser ? 'เปลี่ยนผู้ร่วมงาน' : 'คลิกเพื่อเลือกชื่อผู้ร่วมงาน'}
        </button>
        {selectedUser && (
          <span className="text-sm text-gray-700">{selectedUser.Profile ? `${selectedUser.Profile.firstName || ''} ${selectedUser.Profile.lastName || ''}`.trim() : selectedUser.email}</span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
            <div className="text-lg font-medium">เลือกผู้ร่วมงาน (USER)</div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading ? (
              <div className="text-sm text-gray-500">กำลังโหลด...</div>
            ) : (
              <div className="max-h-80 overflow-auto divide-y divide-gray-100 border rounded">
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { onSelect && onSelect(u); setOpen(false) }}
                    className="w-full text-left p-3 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{u.Profile ? `${u.Profile.firstName || ''} ${u.Profile.lastName || ''}`.trim() : u.email}</div>
                    <div className="text-xs text-gray-600">{u.email}</div>
                  </button>
                ))}
                {users.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">ไม่มีรายชื่อผู้ใช้</div>
                )}
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>ปิด</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

