'use client'

// คอมโพเนนต์ UI ของ Dashboard
import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'
import ScholarshipTableAll from '@/components/dashboard/ScholarshipTableAll'
import { FileSearch, FileBadge, Presentation, HandCoins , BookOpen } from "lucide-react";

export default function DashboardHome() {
  // Mock data แทน API calls
  const isLoading = false
  const error = null

  // Mock stats data
  const mockStats = [
    { value: '12', label: 'ทุนโครงการวิจัย', icon: () => <HandCoins className='size-8 text-gray-600' /> },
    { value: '8', label: 'ทุนตำราหนังสือ', icon: () => <HandCoins className='size-8 text-gray-600' /> },
    { value: '15', label: 'การตีพิมพ์ทางวิชาการ', icon: () => <FileBadge className='size-8 text-gray-600' /> },
    { value: '7', label: 'การประชุมวิชาการ', icon: () => <Presentation className='size-8 text-gray-600' /> },
    { value: '5', label: 'หนังสือและตำรา', icon: () => <BookOpen className='size-8 text-gray-600' /> },
  ]

  const mockFacultyPersonnelData = [
    { label: 'SA', value: '35.5' },
    { label: 'PA', value: '28.2' },
    { label: 'SP', value: '20.1' },
    { label: 'IP', value: '10.8' },
    { label: 'A', value: '5.4' }
  ]

  const mockDepartmentPersonnelData = [
    { category: 'SA', personnel: 25, percentage: '35.5' },
    { category: 'PA', personnel: 20, percentage: '28.2' },
    { category: 'SP', personnel: 15, percentage: '20.1' },
    { category: 'IP', personnel: 8, percentage: '10.8' },
    { category: 'A', personnel: 4, percentage: '5.4' }
  ]

  // แสดงสถานะ Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    )
  }

  // แสดง Error (ถ้ามี)
  if (error) {
    return (
      <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
        {error.message || 'ไม่สามารถโหลดข้อมูล Dashboard'}
      </div>
    )
  }

  // UI หลักของหน้า Dashboard
  return (
    <div className="space-y-6">
      <div className='grid grid-cols-6 gap-5'>
        {/* สรุปจำนวน Project / Works แยกประเภท */}
        <div className='col-span-6'>
          <StatsCard title="สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ" stats={mockStats} />
        </div>

        {/* ภาพรวมประเภทบุคคลากรของคณะ (DonutChart) */}
        <div className='col-span-6 md:col-span-2 h-full'>
          <DonutChart
            title="ภาพรวมประเภทบุคคลากรของคณะ"
            subtitle="% จำนวนบุคคลากรแบ่งตามประเภท"
            data={mockFacultyPersonnelData}
            colors={['#AAB3DE', '#E0E0E0', '#24B364', '#00BAD1', '#FF9F43']}
            height={350}
          />
        </div>

        {/* ภาพรวมประเภทบุคคลากรของภาควิชา (เลือกภายในคอมโพเนนต์) */}
        <div className='col-span-6 md:col-span-4 h-full'>
          <PersonnelChart
            title="ภาพรวมประเภทบุคคลากรของภาควิชา"
            subtitle="จำนวนโครงการวิจัยแบ่งตามหมวดหมู่" 
            data={mockDepartmentPersonnelData}
            colors={['#6366f1', '#22c55e', '#06b6d4', '#f59e0b', '#ef4444']}
            height={80}
          />
        </div>

        {/* Scholarship Statistics Table */}
        <div className='col-span-6 md:col-span-6'>
          <ScholarshipTable 
            title="สถิติงานวิจัยตาม IC Types, Impact และ SDG" 
            subtitle="จำนวนโครงการวิจัยแยกตามหมวดหมู่" 
          />
        </div>
      </div>
    </div>
  )
}
