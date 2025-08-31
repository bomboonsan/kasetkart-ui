"use client"

import { useEffect, useState } from 'react'
import ResearchTopicRow from './ResearchTopicRow'
import { api } from '@/lib/api'

export default function ResearchTopicsTable({ tab = 1 }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setError('')
        if (tab === 1) {
          const res = await api.get('/projects?page=1&pageSize=20')
          const data = res.data || res.items || []
          const mapped = data.map(p => ({
            id: p.id,
            number: String(p.fiscalYear || ''),
            title: p.nameTh || p.nameEn || `Project #${p.id}`,
            budget: p.budget || 0,
            status: p.status || 'DRAFT',
            color: 'green',
            href: `/research/view/${p.id}`,
            editHref: `/research/edit/${p.id}`,
            owner: (() => {
              const partners = p.ProjectPartner || []
              const head = partners.find(pp => (pp.partnerType || '').includes('หัวหน้า'))
              const any = head || partners[0]
              return any ? (any.fullname || any.User?.email || '-') : '-'
            })()
          }))
          setItems(mapped)
        } else {
          const typeMap = { 2: 'CONFERENCE', 3: 'PUBLICATION', 4: 'FUNDING', 5: 'BOOK' }
          const type = typeMap[tab]
          const res = await api.get(`/works?type=${type}&page=1&pageSize=20`)
          const data = res.data || []
          const mapped = data.map(w => ({
            id: w.id,
            number: String(new Date(w.createdAt || Date.now()).getFullYear() + 543),
            title: `${w.type} #${w.id}`,
            budget: 0,
            status: w.status || 'DRAFT',
            color: 'green',
            href: `/works/view/${w.id}`,
            editHref: `/works/edit/${w.id}`,
            owner: (() => {
              const authors = w.WorkAuthor || []
              const corr = authors.find(a => a.isCorresponding)
              const a = corr || authors[0]
              return a ? (a.externalName || a.User?.email || '-') : '-'
            })()
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
      {/* Table Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-1">No.</div>
          <div className="col-span-1">ปีงบประมาณ</div>
          <div className="col-span-3">ชื่อโครงการวิจัย หรือ ผลงาน</div>
          <div className="col-span-2">วันที่ครบกำหนด</div>
          <div className="col-span-2">งบประมาณ</div>
          <div className="col-span-1">ผู้รับผิดชอบ</div>
          <div className="col-span-1">สถานะ</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {error && (
          <div className="px-6 py-4 text-sm text-red-600">{error}</div>
        )}
        {items.map((research, index) => (
          <ResearchTopicRow
            key={research.id}
            research={research}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
