'use client'

// ใช้ SWR แทนการใช้ useDashboardData เพื่อดึงข้อมูลแบบเรียลไทม์จาก API
import useSWR from 'swr'

// คอมโพเนนต์ UI ของ Dashboard
import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'
import ScholarshipTableAll from '@/components/dashboard/ScholarshipTableAll'
import { FileSearch, FileBadge, Presentation, HandCoins , BookOpen } from "lucide-react";

// คลาส API client (มีการแนบ token อัตโนมัติ และตั้งค่า base url ไว้แล้ว)
import { api } from '@/lib/api'

// สร้าง fetcher ให้ SWR (รับ path แล้วเรียก api.get)
const fetcher = (path) => api.get(path)

export default function DashboardHome() {
  // ดึงข้อมูลจาก API ด้วย SWR
  const { data: projectsRes, error: projectsErr } = useSWR('/projects/count', fetcher)
  const { data: worksRes, error: worksErr } = useSWR('/works?pageSize=1000', fetcher)
  const { data: worksCountRes, error: worksCountErr } = useSWR('/works/state', fetcher)
  const { data: usersRes, error: usersErr } = useSWR('/users?pageSize=1000', fetcher)
  const { data: jobTypesRes, error: jobTypesErr } = useSWR('/reports/users-job-types', fetcher)

  // ตรวจสอบสถานะโหลดข้อมูล และข้อผิดพลาด
  const isLoading = !projectsRes || !worksRes || !usersRes || !jobTypesRes
  const error = projectsErr || worksErr || usersErr || jobTypesErr

  // แปลงข้อมูลให้อยู่ในรูปแบบอาร์เรย์ที่ใช้งานสะดวก
  // projects API ส่งกลับข้อมูลใน projectsRes.data
  // works API ส่งกลับข้อมูลใน worksRes.data  
  // users API ส่งกลับข้อมูลใน usersRes.data
  const projects = projectsRes || []
  const works = worksRes?.data || []
  const worksCount = worksCountRes || []
  const users = usersRes?.data || []

  console.log('worksCount', worksCountRes)

  // คำนวณจำนวน Project และผลงานตามประเภทหลัก ๆ (CONFERENCE / PUBLICATION / FUNDING / BOOK)
  const worksByType = works.reduce((acc, w) => {
    const t = (w.type || 'OTHER').toUpperCase()
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  const projectCount = projects.count || 0
  const workConference = worksCount.countConferenceDetail || 0
  const workPublication = worksCount.countPublicationDetail || 0
  const workFunding = worksCount.countFundingDetail || 0
  const workBook = worksCount.countBookDetail || 0

  // จัดเตรียมข้อมูลสำหรับการ์ดสถิติด้านบนสุด
  const academicWorkStats = [
    { value: String(projectCount), label: 'ทุนโครงการวิจัย', icon: () => (
      <HandCoins className='size-8 text-gray-600' />
    )
    },
    {
      value: String(workFunding), label: 'ทุนตำราหนังสือ', icon: () => (
        <HandCoins className='size-8 text-gray-600' />
      )
    },
    {
      value: String(workPublication), label: 'การตีพิมพ์ทางวิชาการ', icon: () => (
        <FileBadge className='size-8 text-gray-600' />
      )
    },    
    { value: String(workConference), label: 'การประชุมวิชาการ', icon: () => (
      <Presentation className='size-8 text-gray-600' />
    ) },
    
    { value: String(workBook), label: 'หนังสือและตำรา', icon: () => (
      <BookOpen className='size-8 text-gray-600' />
    ) },
  ]

  console.log('academicWorkStats', academicWorkStats)

  // ข้อมูลสำหรับ DonutChart: สัดส่วนผู้ใช้ตาม jobType ทั้งระบบ
  const allowedJobTypes = ['SA','PA','SP','IP','A']
  const jtCounts = jobTypesRes?.counts || {}
  const jtTotal = allowedJobTypes.reduce((sum, jt) => sum + (jtCounts[jt] || 0), 0) || 1
  const facultyPersonnelData = allowedJobTypes.map(jt => ({
    label: jt,
    value: ((jtCounts[jt] || 0) / jtTotal * 100).toFixed(1)
  }))

  // ข้อมูลเริ่มต้นให้ PersonnelChart (ตัวคอมโพเนนต์มีระบบโหลดตามภาควิชาอยู่แล้ว)
  const departmentPersonnelData = allowedJobTypes.map(jt => ({
    category: jt,
    personnel: jtCounts[jt] || 0,
    percentage: ((jtCounts[jt] || 0) / jtTotal * 100).toFixed(1)
  }))

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
          <StatsCard title="สรุปจำนวนผลงานวิชาการทั้งหมดของคณะ" stats={academicWorkStats} />
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
            subtitle="จำนวนบุคคลากรแบ่งตามประเภทของภาควิชา"
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
          />
        </div>
      </div>
    </div>
  )
}
