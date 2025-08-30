"use client"

// ใช้ SWR แทน useEffect สำหรับโหลดโปรไฟล์
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import SectionCard from './SectionCard'
import EducationItem from './EducationItem'
import { api } from '@/lib/api'

export default function EducationSection() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const { data: me, error: swrError } = useSWR('/profiles/me', api.get)
  useEffect(() => {
    if (!me) return
    try {
      const prof = me?.Profile?.[0] || me?.profile || {}
      const highDegree = prof?.highDegree || ''
      const academicRank = prof?.academicRank || ''
      const list = []
      if (highDegree) list.push({ degree: highDegree, school: me?.Faculty?.name || me?.Department?.name || '', period: '' })
      if (academicRank) list.push({ degree: academicRank, school: me?.Faculty?.name || me?.Department?.name || '', period: '' })
      setItems(list)
    } catch (e) {
      setError(e.message || 'ไม่สามารถโหลดประวัติการศึกษา')
    }
  }, [me])
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
