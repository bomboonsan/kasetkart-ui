"use client"

import { useEffect, useMemo, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import PublicationItem from '@/components/PublicationItem'
import { projectAPI } from '@/lib/api/project'
import { worksAPI } from '@/lib/api/works'
import { api } from '@/lib/api-base'

const TYPE_TABS = [
  { key: 'PROJECT', label: 'โครงการวิจัย' },
  { key: 'CONFERENCE', label: 'ประชุมวิชาการ' },
  { key: 'PUBLICATION', label: 'ตีพิมพ์ทางวิชาการ' },
  { key: 'FUNDING', label: 'ขอรับทุนเขียนตำรา' },
  { key: 'BOOK', label: 'หนังสือและตำรา' },
]

export default function AdminUserResearchPublicationsSection({ userId }) {
  const [activeType, setActiveType] = useState('PROJECT')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [projects, setProjects] = useState([])
  const [works, setWorks] = useState({ conferences: [], publications: [], books: [] })
  const [fundings, setFundings] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!userId) return
      setLoading(true)
      setError(null)
      try {
        const projRes = await projectAPI.getProjectsByUser(userId)
        const projectList = projRes?.data || []
        if (!mounted) return
        setProjects(projectList)
        const projectIds = projectList.map(p => p.documentId || p.id).filter(Boolean)

        const confs = []
        const pubs = []
        const books = []

        if (projectIds.length > 0) {
          const confParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
          const pubParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
          projectIds.forEach((id, idx) => {
            confParams[`filters[project_research][documentId][$in][${idx}]`] = id
            pubParams[`filters[project_research][documentId][$in][${idx}]`] = id
          })
          try { const cRes = await worksAPI.getConferences(confParams); const data = cRes?.data || cRes || []; confs.push(...data) } catch {}
          try { const pRes = await worksAPI.getPublications(pubParams); const data = pRes?.data || pRes || []; pubs.push(...data) } catch {}
        }

        // Fundings via funding-partners for that user
        let fundingArr = []
        try {
          const fundingPartnersRes = await api.get('/funding-partners', {
            ['filters[users_permissions_user][id][$eq]']: userId,
            publicationState: 'preview',
            populate: 'project_fundings',
            ['pagination[pageSize]']: 1000
          })
          const fundingPartners = fundingPartnersRes?.data || []
          const fundingIdsSet = new Set()
          const fundingMap = new Map()
          fundingPartners.forEach(part => {
            (part.project_fundings || []).forEach(f => {
              const fid = f.documentId || f.id
              if (fid && !fundingIdsSet.has(fid)) { fundingIdsSet.add(fid); fundingMap.set(fid, f) }
            })
          })
          fundingArr = Array.from(fundingMap.values())

          if (fundingArr.length > 0) {
            const ids = fundingArr.map(f => f.documentId || f.id).filter(Boolean)
            if (ids.length > 0) {
              const bookParams = { publicationState: 'preview', ['pagination[pageSize]']: 1000 }
              ids.forEach((id, idx) => { bookParams[`filters[project_funding][documentId][$in][${idx}]`] = id })
              try { const bRes = await worksAPI.getBooks(bookParams); const data = bRes?.data || bRes || []; books.push(...data) } catch {}
            }
          }
        } catch {}

        if (!mounted) return
        setWorks({ conferences: confs, publications: pubs, books })
        setFundings(fundingArr)
      } catch (e) {
        if (mounted) setError(e.message || String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [userId])

  const counts = useMemo(() => ({
    PROJECT: projects.length,
    CONFERENCE: works.conferences.length,
    PUBLICATION: works.publications.length,
    FUNDING: fundings.length,
    BOOK: works.books.length,
  }), [projects, works, fundings])

  function projectItem(p) {
    return { title: p.nameTH || p.nameEN || p.name || p.title || `Project #${p.id}`, description: p.keywords || p.researchKind || '', year: String(p.fiscalYear || p.year || ''), type: 'โครงการวิจัย', status: p.status }
  }
  function confItem(w) { return { title: w?.titleTH || w?.titleEN || w?.title || 'Conference', description: w?.summary || w?.abstractTH || w?.abstractEN || '', year: String(w?.durationStart ? new Date(w.durationStart).getFullYear() : (w?.durationYear || '')), type: 'ประชุมวิชาการ', status: w?.status } }
  function pubItem(w) { return { title: w?.titleTH || w?.titleEN || w?.title || 'Publication', description: w?.abstractTH || w?.abstractEN || '', year: String(w?.durationStart ? new Date(w.durationStart).getFullYear() : (w?.durationYear || '')), type: 'ตีพิมพ์ทางวิชาการ', status: w?.status } }

  return (
    <SectionCard title="ผลงานการการเขียนตามประเภท">
      <div className="space-y-6">
        <div className="flex gap-2 border-b">
          {TYPE_TABS.map(t => (
            <button key={t.key} onClick={() => setActiveType(t.key)} className={`px-3 py-2 text-sm -mb-px border-b-2 ${activeType === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}>
              {t.label} {counts[t.key] ? `(${counts[t.key]})` : ''}
            </button>
          ))}
        </div>
        {error ? <div className="text-sm text-red-600">{error}</div> : loading ? <div className="text-sm text-gray-500">กำลังโหลด...</div> : (
          <div className="space-y-4">
            {activeType === 'PROJECT' ? (
              projects.length === 0 ? <div className="text-sm text-gray-500">ยังไม่มีโครงการ</div> : projects.map(p => { const it = projectItem(p); return <PublicationItem key={p.documentId || p.id} title={it.title} description={it.description} year={it.year} type={it.type} status={it.status} /> })
            ) : activeType === 'CONFERENCE' ? (
              works.conferences.length === 0 ? <div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div> : works.conferences.map(c => { const it = confItem(c); return <PublicationItem key={c.documentId || c.id} title={it.title} description={it.description} year={it.year} type={it.type} status={it.status} /> })
            ) : activeType === 'PUBLICATION' ? (
              works.publications.length === 0 ? <div className="text-sm text-gray-500">ยังไม่มีผลงานในหมวดนี้</div> : works.publications.map(p => { const it = pubItem(p); return <PublicationItem key={p.documentId || p.id} title={it.title} description={it.description} year={it.year} type={it.type} status={it.status} /> })
            ) : activeType === 'FUNDING' ? (
              fundings.length === 0 ? <div className="text-sm text-gray-500">ยังไม่มีคำขอทุน</div> : fundings.map(f => <PublicationItem key={f.documentId || f.id} title={f.fundTypeText || f.contentDesc || f.title || 'Funding'} description={f.purpose || ''} year={String(f.duration ? new Date(f.duration).getFullYear() : '')} type={'ขอรับทุนเขียนตำรา'} status={f.status} />)
            ) : (
              works.books.length === 0 ? <div className="text-sm text-gray-500">ยังไม่มีหนังสือและตำรา</div> : works.books.map(b => <PublicationItem key={b.documentId || b.id} title={b.titleTH || b.titleEN || b.title || 'Book'} description={b.detail || ''} year={String(b.publicationDate ? new Date(b.publicationDate).getFullYear() : '')} type={'หนังสือและตำรา'} status={b.status} />)
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
