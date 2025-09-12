"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { worksAPI } from '@/lib/api/works'
import { Button } from '@/components/ui'
import PageHeader from '@/components/PageHeader'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(10)
  
  // Filter states
  const [searchTitle, setSearchTitle] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchBooks()
  }, [currentPage, searchTitle, sortBy, sortOrder])

  const fetchBooks = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Use API helper to fetch current user's books
      const response = await worksAPI.getMyBooks()
      let list = response?.data || response || []

      // Client-side search across titleTH/titleEN
      if (searchTitle.trim()) {
        const q = searchTitle.trim().toLowerCase()
        list = list.filter(b => (String(b.titleTH || b.titleTh || '').toLowerCase().includes(q) || String(b.titleEN || b.titleEn || '').toLowerCase().includes(q)))
      }

      // Client-side sort
      function camelCase(s) { return s.replace(/[:_-].|\s+./g, x => x.slice(-1).toUpperCase()) }
      const compare = (a, b) => {
        const av = a?.[sortBy] || a?.[camelCase(sortBy)] || ''
        const bv = b?.[sortBy] || b?.[camelCase(sortBy)] || ''
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        if (/updatedAt|createdAt|occurredAt/.test(sortBy)) return (new Date(av)) - (new Date(bv))
        if (typeof av === 'number' && typeof bv === 'number') return av - bv
        return String(av).localeCompare(String(bv))
      }

      list.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)))

      const total = list.length
      const pageCount = Math.max(1, Math.ceil(total / pageSize))
      const start = (currentPage - 1) * pageSize
      const paged = list.slice(start, start + pageSize)

      setBooks(paged)
      setTotalItems(total)
      setTotalPages(pageCount)
      
    } catch (err) {
  setError('ไม่สามารถโหลดข้อมูลหนังสือและตำราได้')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBooks()
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

  const formatBookType = (type) => {
    const typeMap = {
      0: 'หนังสือ',
      1: 'ตำรา',
      2: 'คู่มือ',
      3: 'อื่นๆ'
    }
    return typeMap[type] || 'ไม่ระบุ'
  }

  const formatBookLevel = (level) => {
    const levelMap = {
      0: 'มหาวิทยาลัย',
      1: 'ระดับชาติ',
      2: 'ระดับนานาชาติ',
      3: 'อื่นๆ'
    }
    return levelMap[level] || 'ไม่ระบุ'
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <PageHeader title="หนังสือและตำรา" showAddButton={false} />
        <Link href="/form/create/book">
          <Button variant="primary">เพิ่มหนังสือและตำราใหม่</Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาจากชื่อหนังสือ..."
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
              <option value="occurredAt:desc">วันที่เผยแพร่ (ใหม่ล่าสุด)</option>
              <option value="occurredAt:asc">วันที่เผยแพร่ (เก่าสุด)</option>
            </select>
            <Button type="submit" variant="primary">ค้นหา</Button>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>แสดง {books.length} รายการ จากทั้งหมด {totalItems} รายการ</span>
        <span>หน้า {currentPage} จาก {totalPages}</span>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchBooks} className="mt-4">ลองใหม่</Button>
          </div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>ไม่พบข้อมูลหนังสือและตำรา</p>
            <Link href="/form/create/book">
              <Button className="mt-4">เพิ่มหนังสือและตำราแรก</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('titleTH')}
                  >
                    ชื่อหนังสือ
                    {sortBy === 'titleTH' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ระดับ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนหน้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('occurredAt')}
                  >
                    วันที่เผยแพร่
                    {sortBy === 'occurredAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.documentId || book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {book.titleTH || book.titleEN || 'ไม่ระบุชื่อ'}
                        </div>
                        {book.titleEN && book.titleTH && (
                          <div className="text-sm text-gray-500">{book.titleEN}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatBookType(book.bookType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatBookLevel(book.level)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {book.isbn || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {book.pages || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        book.publishedAt 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.publishedAt ? 'เผยแพร่' : 'ร่าง'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(book.occurredAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/form/view/book/${book.documentId || book.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link 
                          href={`/form/edit/book/${book.documentId || book.id}`}
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
