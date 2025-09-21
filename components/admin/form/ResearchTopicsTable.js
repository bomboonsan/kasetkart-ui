"use client"

import { useEffect, useState } from 'react'
import ResearchTopicRow from './ResearchTopicRow'
import { api } // Removed deprecated api-base import

export default function ResearchTopicsTable({ tab = 1 }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const pageSize = 10

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        
        if (tab === 1) {
          const res = await api.get(`/projects?page=${currentPage}&pageSize=${pageSize}`)
          const data = res.data || res.items || []
          
          // Set pagination info
          setTotalItems(res.total || data.length)
          setTotalPages(Math.ceil((res.total || data.length) / pageSize))
          
          const mapped = data.map(p => ({
            id: p.id,
            number: String(p.fiscalYear || ''),
            title: p.nameTh || p.nameEn || `Project #${p.id}`,
            budget: p.budget || 0,
            status: p.status || 'DRAFT',
            color: 'green',
            href: `/research/view/${p.id}`,
            editHref: `/research/edit/${p.id}`,
            owner: (() => {
              const partners = p.ProjectPartner || []
              const head = partners.find(pp => (pp.partnerType || '').includes('หัวหน้า'))
              const any = head || partners[0]
              return any ? (any.fullname || any.User?.email || '-') : '-'
            })()
          }))
          setItems(mapped)
        } else {
          const typeMap = { 2: 'CONFERENCE', 3: 'PUBLICATION', 4: 'FUNDING', 5: 'BOOK' }
          const type = typeMap[tab]
          const res = await api.get(`/works?type=${type}&page=${currentPage}&pageSize=${pageSize}`)
          const data = res.data || []
          
          // Set pagination info
          setTotalItems(res.total || data.length)
          setTotalPages(Math.ceil((res.total || data.length) / pageSize))
          
          const mapped = data.map(w => ({
            id: w.id,
            number: String(new Date(w.createdAt || Date.now()).getFullYear() + 543),
            title: `${w.type} #${w.id}`,
            budget: 0,
            status: w.status || 'DRAFT',
            color: 'green',
            href: `/works/view/${w.id}`,
            editHref: `/works/edit/${w.id}`,
            owner: (() => {
              const authors = w.WorkAuthor || []
              const corr = authors.find(a => a.isCorresponding)
              const a = corr || authors[0]
              return a ? (a.externalName || a.User?.email || '-') : '-'
            })()
          }))
          setItems(mapped)
        }
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    })()
  }, [tab, currentPage])

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [tab])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm rounded-md ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        ก่อนหน้า
      </button>
    )

    // First page if not in range
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-3 py-2 text-gray-500">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      )
    }

    // Last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-3 py-2 text-gray-500">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {totalPages}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        ถัดไป
      </button>
    )

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-700">
          แสดง {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} จาก {totalItems} รายการ
        </div>
        <div className="flex items-center space-x-2">
          {pages}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Table Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-100">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-1">No.</div>
          <div className="col-span-1">ปีงบประมาณ</div>
          <div className="col-span-3">ชื่อโครงการวิจัย หรือ ผลงาน</div>
          <div className="col-span-2">วันที่ครบกำหนด</div>
          <div className="col-span-2">งบประมาณ</div>
          <div className="col-span-1">ผู้รับผิดชอบ</div>
          <div className="col-span-1">สถานะ</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {loading && (
          <div className="px-6 py-8 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="px-6 py-4 text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            ไม่มีข้อมูล
          </div>
        )}
        {!loading && items.map((research, index) => (
          <ResearchTopicRow
            key={research.id}
            research={research}
            index={((currentPage - 1) * pageSize) + index}
          />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
