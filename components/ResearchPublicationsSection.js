"use client"

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import SectionCard from './SectionCard'
import PublicationFilters from './PublicationFilters'
import PublicationItem from './PublicationItem'
import { api } from '@/lib/api'

const TYPE_TABS = [
  { key: 'CONFERENCE', label: 'ประชุมวิชาการ' },
  { key: 'PUBLICATION', label: 'ตีพิมพ์ทางวิชาการ' },
  { key: 'FUNDING', label: 'ขอรับทุนเขียนตำรา' },
  { key: 'BOOK', label: 'หนังสือและตำรา' },
]

export default function ResearchPublicationsSection() {
  const [activeType, setActiveType] = useState('CONFERENCE')
  const { data: worksRes, error: worksErr } = useSWR('/works?pageSize=100&mine=1', api.get)
  const works = worksRes?.data || worksRes?.items || worksRes || []

  const counts = useMemo(() => {
    const c = { CONFERENCE: 0, PUBLICATION: 0, FUNDING: 0, BOOK: 0 }
    for (const w of works) c[w.type] = (c[w.type] || 0) + 1
    return c
  }, [works])

  const filtered = works.filter(w => w.type === activeType)

  function toItem(w) {
    const projectYear = w?.Project?.fiscalYear
    if (w.type === 'CONFERENCE') {
      const d = w.ConferenceDetail || {}
      return { title: d.titleTh || d.titleEn || 'Conference', description: d.summary || d.abstractTh || '', year: String(projectYear || (d.durationStart ? new Date(d.durationStart).getFullYear() : '')), type: 'ประชุมวิชาการ', status: w.status }
    }
    if (w.type === 'PUBLICATION') {
      const d = w.PublicationDetail || {}
      return { title: d.titleTh || d.titleEn || 'Publication', description: d.abstractTh || '', year: String(projectYear || d.durationYearStart || ''), type: 'ตีพิมพ์ทางวิชาการ', status: w.status }
    }
    if (w.type === 'FUNDING') {
      const d = w.FundingDetail || {}
      return { title: d.fullName || 'Funding', description: d.contentDesc || '', year: String(projectYear || ''), type: 'ขอรับทุนเขียนตำรา', status: w.status }
    }
    if (w.type === 'BOOK') {
      const d = w.BookDetail || {}
      return { title: d.titleTh || d.titleEn || 'Book', description: d.detail || '', year: String(projectYear || (d.occurredAt ? new Date(d.occurredAt).getFullYear() : '')), type: 'หนังสือและตำรา', status: w.status }
    }
    return { title: 'Work', description: '', year: String(projectYear || ''), type: w.type, status: w.status }
  }

  return (
    <SectionCard title="ผลงานการการเขียนตามประเภท">
      <div className="space-y-6">
        {/* Summary counters */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TYPE_TABS.map(t => (
            <div key={t.key} className="p-3 rounded border bg-gray-50 text-center">
              <div className="text-sm text-gray-600">{t.label}</div>
              <div className="text-xl font-semibold">{counts[t.key] || 0}</div>
            </div>
          ))}
        </div> */}

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {TYPE_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={`px-3 py-2 text-sm -mb-px border-b-2 ${activeType === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters placeholder */}
        {/* <PublicationFilters /> */}

        {/* List */}
        {worksErr ? (
          <div className="text-sm text-red-600">{worksErr.message}</div>
        ) : !worksRes ? (
          <div className="text-sm text-gray-500">กำลังโหลด...</div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div>
            ) : (
              filtered.map((w) => {
                const item = toItem(w)
                return (
                  <PublicationItem
                    key={w.id}
                    title={item.title}
                    description={item.description}
                    year={item.year}
                    type={item.type}
                    status={item.status}
                  />
                )
              })
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
