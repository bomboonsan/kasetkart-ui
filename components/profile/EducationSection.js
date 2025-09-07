"use client"

import { useEffect, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import EducationItem from '@/components/EducationItem'

export default function EducationSection({ educations = [] }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  // แปลงข้อมูล educations จาก Strapi เป็นรูปแบบที่ EducationItem ต้องการ
  useEffect(() => {
    try {
      const transformedItems = educations.map(edu => ({
        degree: edu?.education_level?.name || edu.name || 'ไม่ระบุวุฒิการศึกษา',
        school: edu?.name || 'ไม่ระบุสถาบันการศึกษา',
        period: edu?.year ? `ปี ${edu.year}` : '',
        faculty: edu?.faculty || '',
        documentId: edu?.documentId
      }))
      setItems(transformedItems)
    } catch (e) {
      setError('ไม่สามารถโหลดประวัติการศึกษา')
      console.error('Education section error:', e)
    }
  }, [educations])

  return (
    <SectionCard title="ประวัติการศึกษา">
      <div className="space-y-6">
        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500">ยังไม่มีข้อมูลการศึกษา</div>
        ) : (
          items.map((item, index) => (
            <EducationItem
              key={item.documentId || `edu-${index}`}
              degree={item.degree}
              school={item.school}
              period={item.period}
              faculty={item.faculty}
            />
          ))
        )}
      </div>
    </SectionCard>
  )
}
