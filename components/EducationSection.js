"use client"

// Mock data instead of SWR
import { useEffect, useState } from 'react'
import SectionCard from './SectionCard'
import EducationItem from './EducationItem'

export default function EducationSection() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  // Mock profile data
  useEffect(() => {
    const mockProfile = {
      highDegree: 'ปริญญาเอก',
      academicRank: 'ผู้ช่วยศาสตราจารย์'
    }
    
    try {
      const list = []
      if (mockProfile.highDegree) list.push({ degree: mockProfile.highDegree, school: 'มหาวิทยาลัยเกษตรศาสตร์', period: '' })
      if (mockProfile.academicRank) list.push({ degree: mockProfile.academicRank, school: 'มหาวิทยาลัยเกษตรศาสตร์', period: '' })
      setItems(list)
    } catch (e) {
      setError('ไม่สามารถโหลดประวัติการศึกษา')
    }
  }, [])

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
