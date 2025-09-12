'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fundingAPI } from '@/lib/api'
import ViewFormSection from './ViewFormSection'
import ViewFormField from './ViewFormField'
// ใช้ path alias (@/) แทน relative path
import { Button } from '@/components/ui'

export default function FundingView({ fundingId }) {
  const router = useRouter()
  const [funding, setFunding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFunding() {
      try {
        setLoading(true)
        const response = await fundingAPI.getFunding(fundingId)
        setFunding(response?.data || response)
      } catch (err) {
        setError(err?.message || 'ไม่สามารถโหลดข้อมูลการขอทุนได้')
      } finally {
        setLoading(false)
      }
    }

    if (fundingId) {
      loadFunding()
    }
  }, [fundingId])

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลด...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!funding) {
    return <div className="p-6 text-center">ไม่พบข้อมูลการขอทุน</div>
  }

  const getFundTypeLabel = (type) => {
    return type === 0 ? 'ตำรา ใช้สอนในรายวิชา' : 'หนังสือ(ชื่อไทย และชื่อภาษาอังกฤษ)'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลการขอทุนเขียนตำรา</h1>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/form/edit/funding/${fundingId}`)}
            >
              แก้ไข
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              กลับ
            </Button>
          </div>
        </div>

        <ViewFormSection title="ข้อมูลทั่วไป">
          <ViewFormField label="ลักษณะของผลงานวิชาการที่จะขอรับทุน" value={getFundTypeLabel(funding.fundType)} />
          <ViewFormField label="รายละเอียดเพิ่มเติม" value={funding.fundTypeText} />
          <ViewFormField label="คำอธิบายเนื้อหาของตำราหรือหนังสือ" value={funding.contentDesc} />
        </ViewFormSection>

        <ViewFormSection title="ประสบการณ์และวัตถุประสงค์">
          <ViewFormField 
            label="เอกสารทางวิชาการ ตำรา หรือ หนังสือที่ผู้ขอทุนเคยมีประสบการณ์แต่งมาแล้ว" 
            value={funding.pastPublications} 
          />
          <ViewFormField label="วัตถุประสงค์ของตำราหรือหนังสือ" value={funding.purpose} />
          <ViewFormField label="กลุ่มเป้าหมายของตำราหรือหนังสือ" value={funding.targetGroup} />
        </ViewFormSection>

        <ViewFormSection title="รายละเอียดโครงการ">
          <ViewFormField label="การแบ่งบทและรายละเอียดในแต่ละบทของตำรา/หนังสือ" value={funding.chapterDetails} />
          <ViewFormField label="จำนวนหน้า (ประมาณ)" value={funding.pages} type="number" />
          <ViewFormField label="ระยะเวลาที่จะใช้ในการเขียน" value={funding.duration} type="date" />
          <ViewFormField label="รายชื่อหนังสือและเอกสารอ้างอิง (บรรณานุกรม)" value={funding.references} />
        </ViewFormSection>

        {funding.writers && funding.writers.length > 0 && (
          <ViewFormSection title="ผู้แต่งร่วม">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">ภาควิชา</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">สังกัดคณะ/สถาบัน</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">โทรศัพท์</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">อีเมล</th>
                  </tr>
                </thead>
                <tbody>
                  {funding.writers.map((writer, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.fullName || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.department || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.faculty || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.phone || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{writer.email || '-'}</td>
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
