"use client"

import { useEffect, useState } from 'react'
import SectionCard from '@/components/SectionCard'
import EducationItem from '@/components/EducationItem'
import { userAPI } from '@/lib/api'

export default function AdminEducationSection({ userId }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const u = await userAPI.getUser(userId)
        const prof = u?.Profile?.[0] || {}
        const list = []
        if (prof.highDegree) list.push({ degree: prof.highDegree, school: u?.Faculty?.name || u?.Department?.name || '', period: '' })
        if (prof.academicRank) list.push({ degree: prof.academicRank, school: u?.Faculty?.name || u?.Department?.name || '', period: '' })
        setItems(list)
      } catch (e) {
        setError(e.message || 'ไม่สามารถโหลดประวัติการศึกษา')
      }
    })()
  }, [userId])

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

