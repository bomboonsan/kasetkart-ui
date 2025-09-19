'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { worksAPI } from '@/lib/api'
import ViewFormSection from './ViewFormSection'
import ViewFormField from './ViewFormField'
// ใช้ path alias (@/) แทน relative path
import Button from '@/components/Button'

export default function BookView({ bookId }) {
  const router = useRouter()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true)
        const response = await worksAPI.getBook(bookId)
        setBook(response?.data || response)
      } catch (err) {
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลหนังสือ/ตำราได้')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      loadBook()
    }
  }, [bookId])

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!book) {
    return <div className="p-6 text-center">ไม่พบข้อมูลหนังสือ/ตำรา</div>
  }

  const getBookTypeLabel = (type) => {
    return type === 0 ? 'หนังสือ' : 'ตำรา'
  }

  const getLevelLabel = (level) => {
    return level === 0 ? 'ระดับชาติ' : 'ระดับนานาชาติ'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลหนังสือและตำรา</h1>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/form/edit/book/${bookId}`)}
            >
              แก้ไข
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              กลับ
            </Button>
          </div>
        </div>

        <ViewFormSection title="ข้อมูลทั่วไป">
          <ViewFormField label="ประเภทผลงาน" value={getBookTypeLabel(book.bookType)} />
          <ViewFormField label="ชื่อผลงาน (ไทย)" value={book.titleTH} />
          <ViewFormField label="ชื่อผลงาน (อังกฤษ)" value={book.titleEN} />
          <ViewFormField label="ระดับของผลงาน" value={getLevelLabel(book.level)} />
        </ViewFormSection>

        <ViewFormSection title="รายละเอียด">
          <ViewFormField label="รายละเอียดเบื้องต้นของหนังสือ หรือ ตำรา" value={book.detail} />
          <ViewFormField label="วันที่เกิดผลงาน" value={book.publicationDate} type="date" />
        </ViewFormSection>

        {book.project_funding && (
          <ViewFormSection title="โครงการขอทุนที่เกี่ยวข้อง">
            <ViewFormField 
              label="โครงการขอทุน" 
              value={book.project_funding.fundTypeText || book.project_funding.contentDesc || 'โครงการขอทุน'} 
            />
          </ViewFormSection>
        )}

        {book.writers && book.writers.length > 0 && (
          <ViewFormSection title="ผู้แต่ง">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">อีเมล</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">สังกัด</th>
                  </tr>
                </thead>
                <tbody>
                  {book.writers.map((writer, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.name || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.email || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.affiliation || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ViewFormSection>
        )}

      </div>
    </div>
  )
}
