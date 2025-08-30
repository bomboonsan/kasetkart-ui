import { useState, useEffect } from 'react'
import { projectAPI, worksAPI, userAPI, reportsAPI } from '@/lib/api'

export function useDashboardData() {
  const [data, setData] = useState({
    academicWorkStats: [],
    facultyPersonnelData: [],
    departmentPersonnelData: [],
    scholarshipData: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load projects and works data
        const [projectsRes, worksRes, usersRes, jobTypesRes] = await Promise.all([
          projectAPI.getProjects({ pageSize: 1000 }).catch(() => ({ data: [] })),
          worksAPI.getWorks({ pageSize: 1000 }).catch(() => ({ data: [] })),
          userAPI.getUsers({ pageSize: 1000 }).catch(() => ({ data: [] })),
          reportsAPI.getUsersByJobType().catch(() => ({ counts: {} }))
        ])

        const projects = projectsRes.data || projectsRes.items || projectsRes || []
        const works = worksRes.data || worksRes.items || worksRes || []
        const users = usersRes.data || usersRes.items || usersRes || []

        // Calculate academic work statistics
        const worksByType = works.reduce((acc, work) => {
          const type = work.type || 'other'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {})

        const academicWorkStats = [
          { 
            value: String(worksByType.copyright || 0), 
            label: 'ลิขสิทธิ์',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            )
          },
          { 
            value: String(worksByType.conference || 0), 
            label: 'ประชุมวิชาการ',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17 8h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H4v1a1 1 0 11-2 0v-1H1a1 1 0 110-2h1V7a3 3 0 013-3h8a3 3 0 013 3v1z"/>
              </svg>
            )
          },
          { 
            value: String(worksByType.publication || worksByType.book || 0), 
            label: 'หนังสือและสำรง',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
              </svg>
            )
          },
          { 
            value: String(projects.length), 
            label: 'ผลงานวิจัย',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V6z"/>
              </svg>
            )
          }
        ]

        // Override academicWorkStats to show: Project, Work conference, Work publications, Work funding, Work book
        const worksByTypeUpper = works.reduce((acc, w) => {
          const t = (w.type || 'OTHER').toUpperCase()
          acc[t] = (acc[t] || 0) + 1
          return acc
        }, {})
        const academicWorkStatsNew = [
          {
            value: String(projects.length || 0),
            label: 'Project',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V6z"/>
              </svg>
            )
          },
          {
            value: String(worksByTypeUpper.CONFERENCE || 0),
            label: 'Work conference',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17 8h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H4v1a1 1 0 110-2h1V7a3 3 0 013-3h8a3 3 0 013 3v1z"/>
              </svg>
            )
          },
          {
            value: String(worksByTypeUpper.PUBLICATION || 0),
            label: 'Work publications',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
              </svg>
            )
          },
          {
            value: String(worksByTypeUpper.FUNDING || 0),
            label: 'Work funding',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12 8c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2z"/>
                <path d="M4 6a4 4 0 114 4H4a4 4 0 010-8z"/>
              </svg>
            )
          },
          {
            value: String(worksByTypeUpper.BOOK || 0),
            label: 'Work book',
            icon: () => (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 00-2 2V5z"/>
              </svg>
            )
          }
        ]

        // Faculty personnel donut: distribution by jobType (overall)
        const allowedJobTypes = ['SA','PA','SP','IP','A']
        const counts = jobTypesRes.counts || {}
        const totalByJobTypeOverall = allowedJobTypes.reduce((sum, jt) => sum + (counts[jt] || 0), 0) || 1
        const facultyPersonnelData = allowedJobTypes.map(jt => ({
          label: jt,
          value: ((counts[jt] || 0) / totalByJobTypeOverall * 100).toFixed(1)
        }))

        // Build department personnel data from jobType distribution
        const totalByJobType = allowedJobTypes.reduce((sum, jt) => sum + (counts[jt] || 0), 0) || 1
        const departmentPersonnelData = allowedJobTypes.map(jt => ({
          category: jt,
          personnel: counts[jt] || 0,
          percentage: ((counts[jt] || 0) / totalByJobType * 100).toFixed(1)
        }))

        // Calculate scholarship data (based on projects)
        const totalProjects = projects.length || 1
        const scholarshipData = [
          { 
            type: 'Basic or Discovery Scholarship', 
            percentage: '90.5%', 
            impact: '', 
            sdg: String(Math.floor(totalProjects * 0.7)),
            color: '#22c55e'
          },
          { 
            type: 'Applied or Integrative / Application Scholarship', 
            percentage: '12.6%', 
            impact: '', 
            sdg: String(Math.floor(totalProjects * 0.2)),
            color: '#6366f1'
          },
          { 
            type: 'Teaching and Learning Scholarship', 
            percentage: '0%', 
            impact: '', 
            sdg: String(Math.floor(totalProjects * 0.1)),
            color: '#ef4444'
          }
        ]

        setData({
          academicWorkStats: academicWorkStatsNew,
          facultyPersonnelData,
          departmentPersonnelData,
          scholarshipData,
          loading: false,
          error: null
        })

      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'ไม่สามารถโหลดข้อมูล Dashboard'
        }))
      }
    }

    loadDashboardData()
  }, [])

  return data
}
