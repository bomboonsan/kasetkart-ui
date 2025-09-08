"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import SectionCard from '@/components/SectionCard'
import EducationItem from '@/components/EducationItem'
import { api } from '@/lib/api'

export default function AdminEducationSection({ userId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const { data: u, error: swrError } = useSWR(
    userId ? `/users/${userId}` : null,
    (k) => api.get(k),
    { revalidateOnMount: false, revalidateOnFocus: false }
  )

  useEffect(() => {
    if (!u) return
    try {
      const res = u?.data || u || {}
      const prof = res.profile || res.Profile?.[0] || res || {}
      const list = []
      if (prof.highDegree) list.push({ degree: prof.highDegree, school: res?.Faculty?.name || res?.Department?.name || '', period: '' })
      if (prof.academicRank) list.push({ degree: prof.academicRank, school: res?.Faculty?.name || res?.Department?.name || '', period: '' })
      setItems(list)
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
