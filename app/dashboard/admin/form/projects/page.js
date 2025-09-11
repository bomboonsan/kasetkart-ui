'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { projectAPI } from '@/lib/api/project'
import Button from '@/components/Button'
import PageHeader from '@/components/PageHeader'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(10)
  
  const [searchTitle, setSearchTitle] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // คอมเมนต์ (ไทย): แก้ไขโดยการห่อ fetchProjects ด้วย useCallback และเพิ่มเข้าไปใน dependency array ของ useEffect
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const params = {
        'pagination[page]': currentPage,
        'pagination[pageSize]': pageSize,
        sort: `${sortBy}:${sortOrder}`,
        populate: '*'
      }

      if (searchTitle.trim()) {
        params['filters[$or][0][nameTH][$containsi]'] = searchTitle.trim()
        params['filters[$or][1][nameEN][$containsi]'] = searchTitle.trim()
      }

      const response = await projectAPI.getProjects(params)
      
      const data = response?.data || response || []
      const meta = response?.meta || {}
      const pagination = meta.pagination || {}
      
      setProjects(data)
      setTotalItems(pagination.total || data.length)
      setTotalPages(pagination.pageCount || Math.ceil((pagination.total || data.length) / pageSize))
      
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลโครงการได้')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchTitle, sortBy, sortOrder])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProjects()
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('th-TH')
  }

  const getStatusColor = (publishedAt) => {
    return publishedAt 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (publishedAt) => {
    return publishedAt ? 'เผยแพร่' : 'ร่าง'
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <PageHeader title="จัดการโครงการวิจัย" showAddButton={false} />
        <Link href="/dashboard/admin">
          <Button variant="outline">กลับหน้าหลัก</Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาจากชื่อโครงการ..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(':')
                setSortBy(field)
                setSortOrder(order)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt:desc">วันที่สร้าง (ใหม่ล่าสุด)</option>
              <option value="createdAt:asc">วันที่สร้าง (เก่าสุด)</option>
              <option value="updatedAt:desc">วันที่แก้ไข (ใหม่ล่าสุด)</option>
              <option value="updatedAt:asc">วันที่แก้ไข (เก่าสุด)</option>
              <option value="publishedAt:desc">วันที่เผยแพร่ (ใหม่ล่าสุด)</option>
              <option value="publishedAt:asc">วันที่เผยแพร่ (เก่าสุด)</option>
              <option value="fiscalYear:desc">ปีงบประมาณ (ใหม่ล่าสุด)</option>
              <option value="fiscalYear:asc">ปีงบประมาณ (เก่าสุด)</option>
            </select>
            <Button type="submit" variant="primary">ค้นหา</Button>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>แสดง {projects.length} รายการ จากทั้งหมด {totalItems} รายการ</span>
        <span>หน้า {currentPage} จาก {totalPages}</span>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchProjects} className="mt-4">ลองใหม่</Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>ไม่พบข้อมูลโครงการ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('nameTh')}
                  >
                    ชื่อโครงการ
                    {sortBy === 'nameTh' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('fiscalYear')}
                  >
                    ปีงบประมาณ
                    {sortBy === 'fiscalYear' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งบประมาณ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('publishedAt')}
                  >
                    วันที่เผยแพร่
                    {sortBy === 'publishedAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('updatedAt')}
                  >
                    วันที่แก้ไข
                    {sortBy === 'updatedAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.documentId || project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.nameTH || project.nameEN || 'ไม่ระบุชื่อ'}
                        </div>
                        {project.nameEN && project.nameTH && (
                          <div className="text-sm text-gray-500">{project.nameEN}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {project.fiscalYear || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {project.budget ? project.budget.toLocaleString() : '-'} บาท
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.publishedAt)}`}>
                        {getStatusText(project.publishedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(project.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(project.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/form/view/project/${project.documentId || project.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link 
                          href={`/form/edit/project/${project.documentId || project.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          แก้ไข
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ก่อนหน้า
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ถัดไป
          </Button>
        </div>
      )}
    </div>
  )
}