'use client'

import { useEffect, useState } from 'react'
import Button from './Button'
import { projectAPI } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'

export default function ProjectPicker({ label = 'โครงการวิจัย', onSelect, selectedProject }) {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const current = getCurrentUser()

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await projectAPI.getProjects({ page: 1, pageSize: 100 })
        const all = res.data || res.items || []
        // filter projects related to current user by ProjectPartner membership (fallback to all if cannot detect)
        const mine = current ? all.filter(p => (p.ProjectPartner || []).some(pp => pp.User?.email === current.email)) : all
        setProjects(mine)
      } catch (err) {
        setError(err.message || 'โหลดรายการโครงการไม่สำเร็จ')
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
          {selectedProject ? 'เปลี่ยนโครงการ' : 'คลิกเพื่อเลือกโครงการวิจัย'}
        </button>
        {selectedProject && (
          <span className="text-sm text-gray-700">{selectedProject.nameTh || selectedProject.nameEn || `Project #${selectedProject.id}`}</span>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
            <div className="text-lg font-medium">เลือกโครงการวิจัย</div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading ? (
              <div className="text-sm text-gray-500">กำลังโหลด...</div>
            ) : (
              <div className="max-h-80 overflow-auto divide-y divide-gray-100 border rounded">
                {projects.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { onSelect && onSelect(p); setOpen(false) }}
                    className="w-full text-left p-3 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{p.nameTh || p.nameEn || `Project #${p.id}`}</div>
                    <div className="text-xs text-gray-600">ปีงบประมาณ: {p.fiscalYear}</div>
                  </button>
                ))}
                {projects.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">ไม่มีรายการโครงการ</div>
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

