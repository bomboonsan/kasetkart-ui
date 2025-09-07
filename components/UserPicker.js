'use client'

// ใช้ SWR โหลดรายชื่อผู้ใช้เมื่อ modal เปิด
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Button from './Button'
import { api } from '@/lib/api'

export default function UserPicker({ label = 'ผู้ร่วมงาน', onSelect, selectedUser }) {
  const [open, setOpen] = useState(false)
  const { data: usersRes, error: usersErr } = useSWR(
    open ? '/users?populate[profile]=*&populate[organization]=*&populate[faculty]=*&populate[department]=*&pageSize=1000' : null, 
    api.get
  )
  const users = usersRes?.data || usersRes?.items || []
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  useEffect(() => {
    setLoading(!usersRes && open)
    if (usersErr) setError(usersErr.message || 'ต้องเป็นผู้ดูแลระบบจึงจะสามารถค้นหารายชื่อผู้ใช้ได้')
  }, [usersRes, usersErr, open])

  // กรองรายชื่อผู้ใช้จากคำค้นหา โดยค้นจาก firstName/lastName (profile) และอีเมล
  const filtered = users.filter(u => {
    const prof = Array.isArray(u.profile) ? u.profile[0] : u.profile
    const name = ((prof?.firstName || '') + ' ' + (prof?.lastName || '')).toLowerCase()
    const email = (u.email || '').toLowerCase()
    const q = query.trim().toLowerCase()
    if (!q) return true
    return name.includes(q) || email.includes(q)
  })

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
          <span className="text-sm text-gray-700">
            {(() => {
              const prof = Array.isArray(selectedUser.profile) ? selectedUser.profile[0] : selectedUser.profile
              return prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : selectedUser.email
            })()}
          </span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
            <div className="text-lg font-medium">เลือกผู้ร่วมงาน (USER)</div>
            {/* ช่องค้นหาผู้ใช้ด้วยชื่อ/นามสกุล หรืออีเมล */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ นามสกุล หรืออีเมล"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading ? (
              <div className="text-sm text-gray-500">กำลังโหลด...</div>
            ) : (
              <div className="max-h-80 overflow-auto divide-y divide-gray-100 border rounded">
                {filtered.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { onSelect && onSelect(u); setOpen(false) }}
                    className="w-full text-left p-3 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">
                      {(() => {
                        const prof = Array.isArray(u.profile) ? u.profile[0] : u.profile
                        return prof ? `${prof.firstName || ''} ${prof.lastName || ''}`.trim() : u.email
                      })()}
                    </div>
                    <div className="text-xs text-gray-600">{u.email}</div>
                    <div className="text-xs text-gray-500">
                      {u.department?.name && `${u.department.name} `}
                      {u.faculty?.name && `${u.faculty.name} `}
                      {u.organization?.name && `${u.organization.name}`}
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
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
