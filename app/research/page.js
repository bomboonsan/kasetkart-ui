'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { projectAPI } from '@/lib/api'
import Link from 'next/link'

export default function ResearchListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    year: '',
    status: '',
    search: ''
  })

  useEffect(() => {
    loadProjects()
  }, [filters])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const params = {
        page: 1,
        pageSize: 50,
        ...(filters.year && { year: filters.year }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { q: filters.search })
      }
      const res = await projectAPI.getProjects(params)
      setProjects(res.data || res.items || res || [])
    } catch (err) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลโครงการวิจัย')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('th-TH')
    } catch {
      return dateString
    }
  }

  const formatBudget = (budget) => {
    if (!budget) return '-'
    return new Intl.NumberFormat('th-TH').format(budget) + ' บาท'
  }

  const getStatusBadge = (status) => {
    const styles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-yellow-100 text-yellow-800', 
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      DRAFT: 'ร่าง',
      SUBMITTED: 'ส่งแล้ว',
      ACCEPTED: 'อนุมัติ',
      REJECTED: 'ปฏิเสธ'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || styles.DRAFT}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="จัดการโครงการวิจัย" 
        showAddButton={true}
        addButtonText="เพิ่มโครงการใหม่"
        onAddClick={() => {
          // Navigate to create project page
          window.location.href = '/research/create'
        }}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ค้นหา
            </label>
            <input
              type="text"
              placeholder="ชื่อโครงการ..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ปีงบประมาณ
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="2568">2568</option>
              <option value="2567">2567</option>
              <option value="2566">2566</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="DRAFT">ร่าง</option>
              <option value="SUBMITTED">ส่งแล้ว</option>
              <option value="ACCEPTED">อนุมัติ</option>
              <option value="REJECTED">ปฏิเสธ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">ไม่พบโครงการวิจัย</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อโครงการ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ปีงบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ระยะเวลา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.nameTh}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.nameEn}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.fiscalYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{formatDate(project.durationStart)}</div>
                        <div>ถึง {formatDate(project.durationEnd)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatBudget(project.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/research/view/${project.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ดู
                      </Link>
                      <Link
                        href={`/research/edit/${project.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
