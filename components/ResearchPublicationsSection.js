"use client"

import { useMemo, useState } from 'react'
import SectionCard from './SectionCard'
import PublicationFilters from './PublicationFilters'
import PublicationItem from './PublicationItem'

const TYPE_TABS = [
  { key: 'PROJECT', label: 'โครงการวิจัย' },
  { key: 'CONFERENCE', label: 'ประชุมวิชาการ' },
  { key: 'PUBLICATION', label: 'ตีพิมพ์ทางวิชาการ' },
  { key: 'FUNDING', label: 'ขอรับทุนเขียนตำรา' },
  { key: 'BOOK', label: 'หนังสือและตำรา' },
]

export default function ResearchPublicationsSection({ profileData = null }) {
  const [activeType, setActiveType] = useState('PROJECT')

  const projectsErr = null
  const worksErr = null
  const projectsRes = true
  const worksRes = true
  
  // Mock data แทน API calls
  const mockWorks = [
    {
      id: 1,
      type: 'PUBLICATION',
      detail: {
        titleTh: 'ตัวอย่างงานตีพิมพ์',
        titleEn: 'Example Publication',
        journal: 'วารสารตัวอย่าง'
      }
    },
    {
      id: 2,
      type: 'CONFERENCE',
      detail: {
        titleTh: 'ตัวอย่างการประชุม',
        titleEn: 'Example Conference'
      }
    }
  ]
  
  const mockProjects = [
    {
      id: 1,
      nameTh: 'โครงการวิจัยตัวอย่าง',
      nameEn: 'Example Research Project',
      fiscalYear: '2567'
    }
  ]
  
  // Try to extract real works/projects from profileData (Strapi v5 shapes)
  let works = mockWorks
  let myProjects = mockProjects
  try {
    const res = profileData?.data || profileData || {}
    // works could be under res.works, res.worksPermissions, or top-level relations; try common names
    const rawWorks = res?.works || res?.works_permissions || res?.works || res?.publications || []
    const rawProjects = res?.projects || res?.project_researches || res?.myProjects || []

    if (Array.isArray(rawWorks) && rawWorks.length > 0) {
      works = rawWorks.map(w => {
        // Normalize to expected shape used by toItem
        const type = w.type || w.workType || w.category || (w.PublicationDetail ? 'PUBLICATION' : (w.ConferenceDetail ? 'CONFERENCE' : 'PUBLICATION'))
        return {
          id: w.id || w.documentId || w._id || Math.random(),
          type,
          status: w.status || w.publishState || null,
          Project: w.Project || w.project || null,
          ConferenceDetail: w.ConferenceDetail || w.conferenceDetail || w.conference_detail || w.Conference || null,
          PublicationDetail: w.PublicationDetail || w.publicationDetail || w.publication_detail || w.Publication || w.detail || {},
          FundingDetail: w.FundingDetail || w.fundingDetail || w.funding_detail || w.Funding || {},
          BookDetail: w.BookDetail || w.bookDetail || w.book_detail || w.Book || {},
        }
      })
    }

    if (Array.isArray(rawProjects) && rawProjects.length > 0) {
      myProjects = rawProjects.map(p => ({ id: p.id || p.documentId || Math.random(), nameTh: p.nameTh || p.title || p.name || p.nameTh, nameEn: p.nameEn || p.titleEn || p.nameEn, fiscalYear: p.fiscalYear || p.year || '' }))
    }
  } catch (e) { /* ignore */ }

  const counts = useMemo(() => {
    const c = { PROJECT: 0, CONFERENCE: 0, PUBLICATION: 0, FUNDING: 0, BOOK: 0 }
    c.PROJECT = myProjects.length
    for (const w of works) c[w.type] = (c[w.type] || 0) + 1
    return c
  }, [works, myProjects])

  const filteredWorks = works.filter(w => w.type === activeType)

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

  function projectItem(p) {
    return {
      title: p.nameTh || p.nameEn || `Project #${p.id}`,
      description: p.keywords || p.researchKind || '',
      year: String(p.fiscalYear || ''),
      type: 'โครงการวิจัย',
      status: p.status
    }
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
              {t.label} {counts[t.key] ? `(${counts[t.key]})` : ''}
            </button>
          ))}
        </div>

        {/* Filters placeholder */}
        {/* <PublicationFilters /> */}

        {/* List */}
        {(projectsErr || worksErr) ? (
          <div className="text-sm text-red-600">{projectsErr?.message || worksErr?.message}</div>
        ) : (!projectsRes && activeType === 'PROJECT') || (!worksRes && activeType !== 'PROJECT') ? (
          <div className="text-sm text-gray-500">กำลังโหลด...</div>
        ) : (
          <div className="space-y-4">
            {activeType === 'PROJECT' ? (
              (myProjects.length === 0 ? (
                <div className="text-sm text-gray-500">ยังไม่มีโครงการ</div>
              ) : (
                myProjects.map(p => {
                  const item = projectItem(p)
                  return (
                    <PublicationItem
                      key={p.id}
                      title={item.title}
                      description={item.description}
                      year={item.year}
                      type={item.type}
                      status={item.status}
                    />
                  )
                })
              ))
            ) : (
              (filteredWorks.length === 0 ? (
                <div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div>
              ) : (
                filteredWorks.map((w) => {
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
              ))
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
