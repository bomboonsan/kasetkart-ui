'use client'

import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'
import ScholarshipTableAll from '@/components/dashboard/ScholarshipTableAll'
import { useDashboardData } from '@/lib/hooks/useDashboardData'

export default function DashboardHome() {
  const { 
    academicWorkStats, 
    facultyPersonnelData, 
    departmentPersonnelData, 
    scholarshipData,
    loading,
    error 
  } = useDashboardData()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className='grid grid-cols-6 gap-5'>
        {/* สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ */}
        <div className='col-span-6'>
          <StatsCard 
            title="สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ"
            stats={academicWorkStats}
          />
        </div>
        
        {/* ภาพรวมประเภทบุคคลากรของคณะ */}
        <div className='col-span-6 md:col-span-2 h-full'>
          <DonutChart
            title="ภาพรวมประเภทบุคคลากรของคณะ"
            subtitle="% จำนวนบุคคลากรแบ่งตามประเภท"
            data={facultyPersonnelData}
            colors={['#AAB3DE', '#E0E0E0', '#24B364', '#00BAD1', '#FF9F43']}
            height={350}
          />
        </div>
        
        {/* ภาพรวมประเภทบุคคลากรของภาควิชา */}
        <div className='col-span-6 md:col-span-4 h-full'>
          <PersonnelChart
            title="ภาพรวมประเภทบุคคลากรของภาควิชา"
            subtitle="จำนวนบุคคลากรแบ่งตามประเภทของภาควิชา"
            data={departmentPersonnelData}
            colors={['#6366f1', '#22c55e', '#06b6d4', '#f59e0b', '#ef4444']}
            height={80}
          />
        </div>
        
        {/* ภาพรวมตามสาขาวิชา */}
        <div className='col-span-6 md:col-span-3'>
          <ScholarshipTable
            title="ภาพรวมตามสาขาวิชา"
            subtitle="จำนวนบุคคลากรแบ่งตาม 225"
            data={scholarshipData}
          />
        </div>
        <div className='col-span-6 md:col-span-3'>
          <ScholarshipTableAll
            title="ภาพรวมของคณะ"
            subtitle="จำนวนบุคคลากรแบ่งตาม 225"
            data={scholarshipData}
          />
        </div>
      </div>
    </div>
  )
}
