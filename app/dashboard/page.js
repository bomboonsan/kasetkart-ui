'use client'

import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'

// Icons (using simple SVGs)
const BookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

const ConferenceIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17 8h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H4v1a1 1 0 11-2 0v-1H1a1 1 0 110-2h1V7a3 3 0 013-3h8a3 3 0 013 3v1z"/>
  </svg>
)

const PublicationIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
  </svg>
)

const FundingIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
    <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V6z"/>
  </svg>
)

export default function DashboardHome() {
  // Mock data based on the image
  const academicWorkStats = [
    { value: '194', label: 'ลิขสิทธิ์', icon: BookIcon },
    { value: '181', label: 'ประชุมวิชาการ', icon: ConferenceIcon },
    { value: '347', label: 'หนังสือและสำรง', icon: PublicationIcon },
    { value: '76', label: 'ผลงานวิจัย', icon: FundingIcon }
  ]

  const facultyPersonnelData = [
    { label: 'SA', value: 39.7 },
    { label: 'PA', value: 28.3 },
    { label: 'SP', value: 17.4 },
    { label: 'IP', value: 9.6 },
    { label: 'A', value: 5.0 }
  ]

  const departmentPersonnelData = [
    { category: 'Scholarly Academic (SA)', personnel: 34, percentage: 39.7 },
    { category: 'Practice Academic (PA)', personnel: 32, percentage: 28.3 },
    { category: 'Scholarly Practitioner (SP)', personnel: 10, percentage: 17.4 },
    { category: 'Instructional Practitioner (IP)', personnel: 4, percentage: 9.6 },
    { category: 'A', personnel: 2, percentage: 5.0 }
  ]

  const scholarshipData = [
    { 
      type: 'Basic or Discovery Scholarship', 
      percentage: '90.5%', 
      impact: '', 
      sdg: '110',
      color: '#22c55e'
    },
    { 
      type: 'Applied or Integrative / Application Scholarship', 
      percentage: '12.6%', 
      impact: '', 
      sdg: '145',
      color: '#6366f1'
    },
    { 
      type: 'Teaching and Learning Scholarship', 
      percentage: '0%', 
      impact: '', 
      sdg: '0',
      color: '#ef4444'
    }
  ]

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
      </div>
    </div>
  )
}
