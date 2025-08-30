'use client'

// ใช้ SWR แทนการใช้ useDashboardData เพื่อดึงข้อมูลแบบเรียลไทม์จาก API
import useSWR from 'swr'

// คอมโพเนนต์ UI ของ Dashboard
import StatsCard from '@/components/dashboard/StatsCard'
import DonutChart from '@/components/dashboard/DonutChart'
import PersonnelChart from '@/components/dashboard/PersonnelChart'
import ScholarshipTable from '@/components/dashboard/ScholarshipTable'
import ScholarshipTableAll from '@/components/dashboard/ScholarshipTableAll'
import { FileSearch, BookMarked, FileBadge, BookText , BookOpen } from "lucide-react";

// คลาส API client (มีการแนบ token อัตโนมัติ และตั้งค่า base url ไว้แล้ว)
import { api } from '@/lib/api'

// สร้าง fetcher ให้ SWR (รับ path แล้วเรียก api.get)
const fetcher = (path) => api.get(path)

export default function DashboardHome() {
  // ดึงข้อมูลจาก API ด้วย SWR
  const { data: projectsRes, error: projectsErr } = useSWR('/projects?pageSize=1000', fetcher)
  const { data: worksRes, error: worksErr } = useSWR('/works?pageSize=1000', fetcher)
  const { data: usersRes, error: usersErr } = useSWR('/users?pageSize=1000', fetcher)
  const { data: jobTypesRes, error: jobTypesErr } = useSWR('/reports/users-job-types', fetcher)

  // ตรวจสอบสถานะโหลดข้อมูล และข้อผิดพลาด
  const isLoading = !projectsRes || !worksRes || !usersRes || !jobTypesRes
  const error = projectsErr || worksErr || usersErr || jobTypesErr

  // แปลงข้อมูลให้อยู่ในรูปแบบอาร์เรย์ที่ใช้งานสะดวก
  const projects = projectsRes?.data || projectsRes?.items || projectsRes || []
  const works = worksRes?.data || worksRes?.items || worksRes || []
  const users = usersRes?.data || usersRes?.items || usersRes || []

  // คำนวณจำนวน Project และผลงานตามประเภทหลัก ๆ (CONFERENCE / PUBLICATION / FUNDING / BOOK)
  const worksByType = works.reduce((acc, w) => {
    const t = (w.type || 'OTHER').toUpperCase()
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  const projectCount = projects.length || 0
  const workConference = worksByType.CONFERENCE || 0
  const workPublication = worksByType.PUBLICATION || 0
  const workFunding = worksByType.FUNDING || 0
  const workBook = worksByType.BOOK || 0

  // จัดเตรียมข้อมูลสำหรับการ์ดสถิติด้านบนสุด
  const academicWorkStats = [
    { value: String(projectCount), label: 'โครงการ', icon: () => (
      <FileSearch className='size-8 text-gray-600' />
    ) },
    { value: String(workConference), label: 'การประชุมวิชาการ', icon: () => (
      <FileBadge className='size-8 text-gray-600' />
    ) },
    { value: String(workPublication), label: 'การตีพิมพ์ทางวิชาการ', icon: () => (
      <BookMarked className='size-8 text-gray-600' />
    ) },
    { value: String(workFunding), label: 'ขอการทุน', icon: () => (
      <BookText className='size-8 text-gray-600' />
    ) },
    { value: String(workBook), label: 'หนังสือและตำรา', icon: () => (
      <BookOpen className='size-8 text-gray-600' />
    ) },
  ]

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

  // ตัวอย่างข้อมูลตาราง (ยังคง mock ไว้ตามเดิม)
  const totalProjects = projects.length || 1
  const scholarshipData = [
    { type: 'Basic or Discovery Scholarship', percentage: '90.5%', impact: '', sdg: String(Math.floor(totalProjects * 0.7)), color: '#22c55e' },
    { type: 'Applied or Integrative / Application Scholarship', percentage: '12.6%', impact: '', sdg: String(Math.floor(totalProjects * 0.2)), color: '#6366f1' },
    { type: 'Teaching and Learning Scholarship', percentage: '0%', impact: '', sdg: String(Math.floor(totalProjects * 0.1)), color: '#ef4444' },
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

        {/* ตารางตัวอย่าง (ข้อมูลจำลอง) */}
        <div className='col-span-6 md:col-span-3'>
          <ScholarshipTable title="ภาพรวมตามสาขาวิชา" subtitle="จำนวนบุคคลากรแบ่งตาม 225" data={scholarshipData} />
        </div>
        <div className='col-span-6 md:col-span-3'>
          <ScholarshipTableAll title="ภาพรวมของคณะ" subtitle="จำนวนบุคคลากรแบ่งตาม 225" data={scholarshipData} />
        </div>
      </div>
    </div>
  )
}
