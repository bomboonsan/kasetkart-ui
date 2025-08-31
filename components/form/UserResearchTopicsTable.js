"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function UserResearchTopicsTable({ tab = 1 }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setError('')
        if (tab === 1) {
          const res = await api.get('/projects?page=1&pageSize=50&mine=1')
          const data = res.data || res.items || []
          const mapped = data.map(p => ({
            id: p.id,
            number: String(p.fiscalYear || ''),
            title: p.nameTh || p.nameEn || `Project #${p.id}`,
            budget: p.budget || 0,
            status: p.status || 'DRAFT',
            href: `/research/view/${p.id}`,
            editHref: `/research/edit/${p.id}`,
          }))
          setItems(mapped)
        } else {
          const typeMap = { 2: 'CONFERENCE', 3: 'PUBLICATION', 4: 'FUNDING', 5: 'BOOK' }
          const type = typeMap[tab]
          const res = await api.get(`/works?type=${encodeURIComponent(type)}&page=1&pageSize=50&mine=1`)
          const data = res.data || res.items || res || []
          const mapped = data.map(w => ({
            id: w.id,
            number: String(new Date(w.createdAt || Date.now()).getFullYear() + 543),
            title: `${w.type} #${w.id}`,
            budget: 0,
            status: w.status || 'DRAFT',
            href: `/works/view/${w.id}`,
            editHref: `/works/edit/${w.id}`,
          }))
          setItems(mapped)
        }
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลไม่สำเร็จ')
      }
    })()
  }, [tab])

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-1">No.</div>
          <div className="col-span-2">ปีงบประมาณ/ปี</div>
          <div className="col-span-5">ชื่อโครงการ/ผลงาน</div>
          <div className="col-span-2">งบประมาณ</div>
          <div className="col-span-2">สถานะ</div>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200">
        {error && (
          <div className="px-6 py-4 text-sm text-red-600">{error}</div>
        )}
        {items.map((row, idx) => (
          <div key={row.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </div>
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-900">{row.number}</div>
              <div className="col-span-5">
                <Link href={row.href} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  {row.title}
                </Link>
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-900">{(row.budget || 0).toLocaleString()}</div>
              <div className="col-span-2">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{row.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

