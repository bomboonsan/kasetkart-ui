"use client"

import { useParams } from 'next/navigation'
import WorkView from '@/components/WorkView'

export default function WorkViewPage() {
  const params = useParams()
  const id = params?.id
  
  // Mock data แทน API call
  const mockWork = {
    id: id,
    type: 'PUBLICATION',
    status: 'ACTIVE',
    detail: {
      titleTh: 'ตัวอย่างงานตีพิมพ์ภาษาไทย',
      titleEn: 'Example Publication Work',
      journal: 'วารสารตัวอย่าง',
      volume: '10',
      issue: '2',
      pages: '123-145',
      year: '2024',
      doi: '10.1234/example',
      abstract: 'บทคัดย่อตัวอย่าง'
    },
    Project: {
      nameTh: 'โครงการตัวอย่าง',
      nameEn: 'Example Project'
    }
  }
  
  const work = mockWork
  const loading = false
  const error = ''

  if (loading) {
    return <div className="p-6 text-gray-500">กำลังโหลดข้อมูล...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-800">รายละเอียดผลงานวิจัย</div>
      <WorkView work={work} />
    </div>
  )
}

