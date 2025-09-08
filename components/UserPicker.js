'use client'

// ใช้ SWR โหลดรายชื่อผู้ใช้เมื่อ modal เปิด
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Button from './Button'
import { api } from '@/lib/api'

export default function UserPicker({ label = 'ผู้ร่วมงาน', onSelect, selectedUser }) {
  const [open, setOpen] = useState(false)
  // query must be declared before the debounce effect
  const [query, setQuery] = useState('')
  // Debounced query so we don't refetch on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  // Wrap api.get so `this` binding inside ApiClient is preserved and SWR fetcher works
  const { data: usersRes, error: usersErr, isValidating } = useSWR(
    open ? ['/users', debouncedQuery] : null,
    // fetcher builds Strapi filter when query present
    async ([, q]) => {
      const base = '/users?populate[profile]=*&populate[organization]=*&populate[faculty]=*&populate[department]=*&pageSize=1000'
      if (!q) return api.get(base)
      const filters = `&filters[$or][0][profile][firstName][$containsi]=${encodeURIComponent(q)}&filters[$or][1][profile][lastName][$containsi]=${encodeURIComponent(q)}&filters[$or][2][email][$containsi]=${encodeURIComponent(q)}`
      return api.get(base + filters)
    }
  )
  const users = (() => {
    if (!usersRes) return []
    if (Array.isArray(usersRes)) return usersRes
    if (Array.isArray(usersRes.data)) return usersRes.data
    if (Array.isArray(usersRes.items)) return usersRes.items
    // Strapi sometimes returns { data: { data: [...] } }
    if (usersRes.data && Array.isArray(usersRes.data.data)) return usersRes.data.data
    return []
  })()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading((!usersRes && open) || isValidating)
    if (usersErr) setError(usersErr.message || 'ต้องเป็นผู้ดูแลระบบจึงจะสามารถค้นหารายชื่อผู้ใช้ได้')
  }, [usersRes, usersErr, open])

  // กรองรายชื่อผู้ใช้จากคำค้นหา โดยค้นจาก firstName/lastName (profile) และอีเมล
  const filtered = users.filter(u => {
    const prof = Array.isArray(u.profile) ? u.profile[0] : u.profile
    const name = ((prof?.firstNameTH || '') + ' ' + (prof?.lastNameTH || '')).toLowerCase()
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
              return prof ? `${prof.firstNameTH || ''} ${prof.lastNameTH || ''}`.trim() : selectedUser.email
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
                        return prof ? `${prof.firstNameTH || ''} ${prof.lastNameTH || ''}`.trim() : u.email
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
