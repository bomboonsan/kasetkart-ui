'use client'

import { useState, useEffect } from 'react'
// คอมโพเนนต์ UI ของ Dashboard
import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'
import ScholarshipTableAll from '@/components/dashboard/ScholarshipTableAll'
import { dashboardAPI, valueFromAPI } from '@/lib/api'
import { FileSearch, FileBadge, Presentation, HandCoins , BookOpen } from "lucide-react";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState([])
  const [facultyPersonnelData, setFacultyPersonnelData] = useState([])
  const [departmentPersonnelData, setDepartmentPersonnelData] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDept, setSelectedDept] = useState('all')
  const [researchStats, setResearchStats] = useState({ icTypes: [], impacts: [], sdgs: [] })

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    // When selectedDept changes, reload personnel-by-department
    loadPersonnelForDepartment(selectedDept)
  }, [selectedDept])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Load departments first so we can request department-specific stats
      const [
        departmentsRes,
        [projectsRes, fundingsRes, publicationsRes, conferencesRes, booksRes],
        facultyPersonnel,
        researchStatsData
      ] = await Promise.all([
        valueFromAPI.getDepartments(),
        dashboardAPI.getStats(),
        dashboardAPI.getPersonnelByAcademicType(),
        dashboardAPI.getResearchStatsByTypes()
      ])

      // Departments list (set selected to first if any)
      const deptList = (departmentsRes?.data || departmentsRes || []).map(d => ({
        id: d.id || d.documentId || d.attributes?.documentId || d.attributes?.id,
        name: d.attributes?.name || d.name || d.title || d.attributes?.displayName || d.displayName || d
      }))
      setDepartments(deptList)
      if (deptList.length && selectedDept === 'all') {
        // choose first department by documentId if available, else id
        setSelectedDept(deptList[0].id || 'all')
      }

      // Process stats data
      const projectsCount = projectsRes?.meta?.pagination?.total || projectsRes?.data?.length || 0
      const fundingsCount = fundingsRes?.meta?.pagination?.total || fundingsRes?.data?.length || 0
      const publicationsCount = publicationsRes?.meta?.pagination?.total || publicationsRes?.data?.length || 0
      const conferencesCount = conferencesRes?.meta?.pagination?.total || conferencesRes?.data?.length || 0
      const booksCount = booksRes?.meta?.pagination?.total || booksRes?.data?.length || 0

      const statsData = [
        { value: String(projectsCount), label: 'ทุนโครงการวิจัย', icon: () => <HandCoins className='size-8 text-gray-600' /> },
        { value: String(fundingsCount), label: 'ทุนตำราหนังสือ', icon: () => <HandCoins className='size-8 text-gray-600' /> },
        { value: String(publicationsCount), label: 'การตีพิมพ์ทางวิชาการ', icon: () => <FileBadge className='size-8 text-gray-600' /> },
        { value: String(conferencesCount), label: 'การประชุมวิชาการ', icon: () => <Presentation className='size-8 text-gray-600' /> },
        { value: String(booksCount), label: 'หนังสือและตำรา', icon: () => <BookOpen className='size-8 text-gray-600' /> },
      ]

      // Normalize personnel counts to ensure keys SA, PA, SP, IP, A
      const normalizePersonnelCounts = (raw = {}) => {
        const keys = ['SA', 'PA', 'SP', 'IP', 'A']
        const out = {}
        keys.forEach(k => {
          // accept case-insensitive keys if present
          const foundKey = Object.keys(raw || {}).find(rk => String(rk).toUpperCase() === k)
          out[k] = Number(foundKey ? raw[foundKey] : 0)
        })
        return out
      }

      const normalizedFaculty = normalizePersonnelCounts(facultyPersonnel)

      // Process faculty personnel data for donut chart
      const totalPersonnel = Object.values(normalizedFaculty).reduce((sum, count) => sum + count, 0) || 1
      const facultyChartData = Object.entries(normalizedFaculty).map(([type, count]) => ({
        label: type,
        value: ((count / totalPersonnel) * 100).toFixed(1),
        raw: count
      }))

      // Default department chart uses faculty data until a department is selected
      const departmentChartData = Object.entries(normalizedFaculty).map(([type, count]) => ({
        category: type,
        personnel: count,
        percentage: ((count / totalPersonnel) * 100).toFixed(1)
      }))

      setStats(statsData)
      setFacultyPersonnelData(facultyChartData)
      setDepartmentPersonnelData(departmentChartData)
      setResearchStats(researchStatsData)

      // If we have a selected department (set above) load its data
      if (deptList && deptList.length) {
        await loadPersonnelForDepartment(selectedDept || deptList[0].id)
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('ไม่สามารถโหลดข้อมูล Dashboard ได้')
    } finally {
      setLoading(false)
    }
  }

  const loadPersonnelForDepartment = async (departmentId) => {
    try {
      // departmentId could be 'all' meaning overall
      if (!departmentId || departmentId === 'all') {
        // use facultyPersonnelData already set
        return
      }

      const deptPersonnel = await dashboardAPI.getPersonnelByAcademicType(departmentId)

      // Ensure keys exist (SA,PA,SP,IP,A) and default to 0
      const keys = ['SA','PA','SP','IP','A']
      const normalized = {}
      keys.forEach(k => {
        const foundKey = Object.keys(deptPersonnel || {}).find(rk => String(rk).toUpperCase() === k)
        normalized[k] = Number(foundKey ? deptPersonnel[foundKey] : 0)
      })

      const total = Object.values(normalized).reduce((s, v) => s + v, 0) || 1
      const deptChartData = Object.entries(normalized).map(([type, count]) => ({
        category: type,
        personnel: count,
        percentage: ((count / total) * 100).toFixed(1)
      }))

      setDepartmentPersonnelData(deptChartData)
    } catch (err) {
      console.error('Error loading personnel for department:', err)
    }
  }

  // แสดงสถานะ Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล Dashboard...</p>
      </div>
    )
  }

  // แสดง Error (ถ้ามี)
  if (error) {
    return (
      <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
        {error}
        <button 
          onClick={loadDashboardData}
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    )
  }

  // UI หลักของหน้า Dashboard
  return (
    <div className="space-y-6">
      <div className='grid grid-cols-6 gap-5'>
        {/* สรุปจำนวน Project / Works แยกประเภท */}
        <div className='col-span-6'>
          <StatsCard title="สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ" stats={stats} />
        </div>

        {/* ภาพรวมประเภทบุคคลากรของคณะ (DonutChart) */}
        <div className='col-span-6 md:col-span-2 h-full'>
          <DonutChart
            title="ภาพรวมประเภทบุคคลากรของคณะ"
            subtitle="% จำนวนบุคคลากรแบ่งตามประเภท"
            data={facultyPersonnelData}
            colors={['#AAB3DE', '#E0E0E0', '#24B364', '#00BAD1', '#FF9F43']}
            height={350}
          />
        </div>

        {/* ภาพรวมประเภทบุคคลากรของภาควิชา (เลือกภายในคอมโพเนนต์) */}
        <div className='col-span-6 md:col-span-4 h-full'>
          <PersonnelChart
            title="ภาพรวมประเภทบุคคลากรของภาควิชา"
            subtitle="จำนวนบุคลากรแบ่งตามประเภท" 
            data={departmentPersonnelData}
            colors={['#6366f1', '#22c55e', '#06b6d4', '#f59e0b', '#ef4444']}
            height={80}
          />
        </div>

        {/* Scholarship Statistics Table */}
        <div className='col-span-6 md:col-span-6'>
          <ScholarshipTable 
            title="สถิติงานวิจัยตาม IC Types, Impact และ SDG" 
            subtitle="จำนวนโครงการวิจัยแยกตามหมวดหมู่"
            researchStats={researchStats}
          />
        </div>
      </div>
    </div>
  )
}
