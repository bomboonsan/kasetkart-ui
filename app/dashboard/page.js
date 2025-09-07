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
  const [researchStats, setResearchStats] = useState({ icTypes: [], impacts: [], sdgs: [] })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Load all stats in parallel
      const [
        [projectsRes, fundingsRes, publicationsRes, conferencesRes, booksRes],
        facultyPersonnel,
        researchStatsData
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getPersonnelByAcademicType(),
        dashboardAPI.getResearchStatsByTypes()
      ])

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

      // Process faculty personnel data for donut chart
      const totalPersonnel = Object.values(facultyPersonnel).reduce((sum, count) => sum + count, 0) || 1
      const facultyChartData = Object.entries(facultyPersonnel).map(([type, count]) => ({
        label: type,
        value: ((count / totalPersonnel) * 100).toFixed(1)
      }))

      // Process department personnel data for bar chart  
      const departmentChartData = Object.entries(facultyPersonnel).map(([type, count]) => ({
        category: type,
        personnel: count,
        percentage: ((count / totalPersonnel) * 100).toFixed(1)
      }))

      setStats(statsData)
      setFacultyPersonnelData(facultyChartData)
      setDepartmentPersonnelData(departmentChartData)
      setResearchStats(researchStatsData)

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('ไม่สามารถโหลดข้อมูล Dashboard ได้')
    } finally {
      setLoading(false)
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
