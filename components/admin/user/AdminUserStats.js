"use client"

import { useEffect, useState } from 'react'
import { projectAPI } from '@/lib/api/project'
import { worksAPI } from '@/lib/api/works'
import { api } from '@/lib/api-base'

export default function AdminUserStats({ userId }) {
  const [counts, setCounts] = useState({
    projects: 0,
    conferences: 0,
    publications: 0,
    fundings: 0,
    books: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!userId) return
      setLoading(true)
      try {
        // Fetch projects where this user is partner
        const projRes = await projectAPI.getProjectsByUser(userId)
        const projects = projRes?.data || []
        const projectIds = projects.map(p => p.documentId || p.id).filter(Boolean)

        let confCount = 0
        let pubCount = 0
        let bookCount = 0
        let fundingCount = 0

        if (projectIds.length > 0) {
          const confParams = { publicationState: 'preview', ['pagination[pageSize]']: 1 }
          const pubParams = { publicationState: 'preview', ['pagination[pageSize]']: 1 }
          projectIds.forEach((id, idx) => {
            confParams[`filters[project_research][documentId][$in][${idx}]`] = id
            pubParams[`filters[project_research][documentId][$in][${idx}]`] = id
          })
          try {
            const confRes = await worksAPI.getConferences(confParams)
            confCount = confRes?.meta?.pagination?.total ?? (confRes?.data?.length ?? 0)
          } catch {}
          try {
            const pubRes = await worksAPI.getPublications(pubParams)
            pubCount = pubRes?.meta?.pagination?.total ?? (pubRes?.data?.length ?? 0)
          } catch {}
        }

        // Funding & books via funding-partners
        try {
          const fundingPartnersRes = await api.get('/funding-partners', {
            ['filters[users_permissions_user][id][$eq]']: userId,
            publicationState: 'preview',
            populate: 'project_fundings'
          })
          const fundingPartners = fundingPartnersRes?.data || []
          const fundingIds = new Set()
          fundingPartners.forEach(part => {
            (part.project_fundings || []).forEach(f => {
              if (f.documentId || f.id) fundingIds.add(f.documentId || f.id)
            })
          })
          fundingCount = fundingIds.size

          if (fundingIds.size > 0) {
            const bookParams = { publicationState: 'preview', ['pagination[pageSize]']: 1 }
            Array.from(fundingIds).forEach((id, idx) => {
              bookParams[`filters[project_funding][documentId][$in][${idx}]`] = id
            })
            try {
              const bookRes = await worksAPI.getBooks(bookParams)
              bookCount = bookRes?.meta?.pagination?.total ?? (bookRes?.data?.length ?? 0)
            } catch {}
          }
        } catch {}

        if (!mounted) return
        setCounts({
          projects: projects.length,
          conferences: confCount,
            publications: pubCount,
            fundings: fundingCount,
            books: bookCount,
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [userId])

  const stats = [
    { label: 'โครงการวิจัย', value: loading ? '...' : String(counts.projects) },
    { label: 'ประชุมวิชาการ', value: loading ? '...' : String(counts.conferences) },
    { label: 'ตีพิมพ์ทางวิชาการ', value: loading ? '...' : String(counts.publications) },
    { label: 'ขอทุนเขียนตำรา', value: loading ? '...' : String(counts.fundings) },
    { label: 'หนังสือและตำรา', value: loading ? '...' : String(counts.books) },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 bg-gray-50/50 p-6 rounded-b-lg border-t border-t-gray-200">
      {stats.map((s,i)=>(
        <p key={i} className="text-gray-900 text-center space-x-1.5">
          <span className="text-primary text-xl font-bold">{s.value}</span>
          <span className="text-lg">{s.label}</span>
        </p>
      ))}
    </div>
  )
}
