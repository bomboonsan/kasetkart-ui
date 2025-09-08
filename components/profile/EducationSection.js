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
      // Normalize and dedupe incoming educations array
      const mapped = (educations || []).map((edu, idx) => {
        const documentId = edu?.documentId || edu?.id || undefined
        const degree = edu?.education_level?.name || (typeof edu?.education_level === 'string' ? edu.education_level : '') || edu?.name || 'ไม่ระบุวุฒิการศึกษา'
        return {
          degree,
          school: edu?.name || 'ไม่ระบุสถาบันการศึกษา',
          period: edu?.year ? `ปี ${edu.year}` : '',
          faculty: edu?.faculty || '',
          documentId,
          _key: documentId || `${degree}||${edu?.name || ''}||${edu?.year || ''}||${idx}`
        }
      })

      const dedupedMap = new Map()
      for (const it of mapped) {
        if (!dedupedMap.has(it.documentId || it._key)) dedupedMap.set(it.documentId || it._key, it)
      }
      setItems(Array.from(dedupedMap.values()))
    } catch (e) {
      setError('ไม่สามารถโหลดประวัติการศึกษา')
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
