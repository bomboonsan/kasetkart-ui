"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import SectionCard from '@/components/SectionCard'
import EducationItem from '@/components/EducationItem'
import { api } from '@/lib/api'

export default function AdminEducationSection({ userId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const { data: u, error: swrError } = useSWR(userId ? `/users/${userId}` : null, (k) => api.get(k), { revalidateOnMount: false, revalidateOnFocus: false })
  useEffect(() => {
    if (!u) return
    try {
      const prof = u?.Profile?.[0] || {}
      const list = []
      if (prof.highDegree) list.push({ degree: prof.highDegree, school: u?.Faculty?.name || u?.Department?.name || '', period: '' })
      if (prof.academicRank) list.push({ degree: prof.academicRank, school: u?.Faculty?.name || u?.Department?.name || '', period: '' })
      setItems(list)
    } catch (e) {
      setError(e.message || 'ไม่สามารถโหลดประวัติการศึกษา')
    }
  }, [u])
  useEffect(() => { if (swrError) setError(swrError.message || 'ไม่สามารถโหลดประวัติการศึกษา') }, [swrError])

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
              key={index}
              degree={item.degree}
              school={item.school}
              period={item.period}
            />
          ))
        )}
      </div>
    </SectionCard>
  )
}
