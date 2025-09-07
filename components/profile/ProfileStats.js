
"use client"

import { useEffect, useState } from 'react'
import { projectAPI, worksAPI, fundingAPI, api } from '@/lib/api'

export default function ProfileStats() {
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

    async function loadCounts() {
      try {
        setLoading(true)

        // 1) Get projects where current user is a partner
        const myProjectsRes = await projectAPI.getMyProjects()
        const myProjects = myProjectsRes?.data || myProjectsRes || []
        const projectCount = Array.isArray(myProjects) ? myProjects.length : 0

        // collect project documentIds (or ids) for filtering works
        const projectIds = (myProjects || []).map(p => p.documentId || p.id).filter(Boolean)

        let confCount = 0
        let pubCount = 0
        let bookCount = 0
        let fundingCount = 0

        // 2) If there are projects, fetch related works counts using documentId filters
        if (projectIds.length > 0) {
          const idsParam = projectIds.join(',')

          const confRes = await worksAPI.getConferences({ ['filters[project_research][documentId][$in]']: idsParam, publicationState: 'preview', ['pagination[pageSize]']: 1 })
          confCount = confRes?.meta?.pagination?.total ?? (confRes?.data?.length ?? 0)

          const pubRes = await worksAPI.getPublications({ ['filters[project_research][documentId][$in]']: idsParam, publicationState: 'preview', ['pagination[pageSize]']: 1 })
          pubCount = pubRes?.meta?.pagination?.total ?? (pubRes?.data?.length ?? 0)
        }

        // 3) Fundings: find project-fundings where current user is a partner (funding_partners.users_permissions_user)
        // Need user id
        let userId = null
        try {
          const me = await api.get('/users/me')
          userId = me?.data?.id || me?.id || null
        } catch (e) {
          // ignore
        }

        if (userId) {
          const fundRes = await fundingAPI.getFundings({ ['filters[funding_partners][users_permissions_user][id][$eq]']: userId, publicationState: 'preview', ['pagination[pageSize]']: 1 })
          fundingCount = fundRes?.meta?.pagination?.total ?? (fundRes?.data?.length ?? 0)

          // For books: count work-books that are linked to those fundings
          const fundingIds = (fundRes?.data || fundRes || []).map(f => f.documentId || f.id).filter(Boolean)
          if (fundingIds.length > 0) {
            const fbRes = await worksAPI.getBooks({ ['filters[project_funding][documentId][$in]']: fundingIds.join(','), publicationState: 'preview', ['pagination[pageSize]']: 1 })
            bookCount = fbRes?.meta?.pagination?.total ?? (fbRes?.data?.length ?? 0)
          }
        }

        if (!mounted) return
        setCounts({ projects: projectCount, conferences: confCount, publications: pubCount, fundings: fundingCount, books: bookCount })
      } catch (err) {
        console.warn('ProfileStats load error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadCounts()
    return () => { mounted = false }
  }, [])

  const stats = [
    { label: 'โครงการวิจัย', value: loading ? '...' : String(counts.projects) }, // Project Research
    { label: 'ประชุมวิชาการ', value: loading ? '...' : String(counts.conferences) }, // Work Conference
    { label: 'ตีพิมพ์ทางวิชาการ', value: loading ? '...' : String(counts.publications) }, // Work Publication
    { label: 'ขอทุนเขียนตำรา', value: loading ? '...' : String(counts.fundings) }, // Project Funding
    { label: 'หนังสือและตำรา', value: loading ? '...' : String(counts.books) }, // Work Book
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 bg-gray-50/50 p-6 rounded-b-lg border-t border-t-gray-200">
      {stats.map((stat, index) => (
        <p key={index} className="text-gray-900 text-center space-x-1.5">
          <span className="text-primary text-xl font-bold">{stat.value}</span>
          <span className="text-lg">{stat.label}</span>
        </p>
      ))}
    </div>
  )
}
