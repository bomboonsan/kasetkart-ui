"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import SectionCard from '@/components/SectionCard'
import EducationItem from '@/components/EducationItem'
import { api } from '@/lib/api'

export default function AdminEducationSection({ userId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  // Fetch target user with nested educations (mirror profile page pattern)
  const { data: u, error: swrError } = useSWR(
    userId ? `/users/${userId}?populate[educations][populate]=education_level&publicationState=preview` : null,
    (k) => api.get(k),
    { revalidateOnMount: false, revalidateOnFocus: false }
  )

  useEffect(() => {
    if (!u) return
    try {
      const res = u?.data || u || {}
      const educations = res?.educations || []
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
      setError(e.message || 'โหลดข้อมูลการศึกษาไม่สำเร็จ')
    }
  }, [u])

  useEffect(() => {
    if (swrError) setError(swrError.message || 'ไม่สามารถโหลดประวัติการศึกษา')
  }, [swrError])

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
