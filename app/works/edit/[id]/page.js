"use client"

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import CreateConferenceForm from '@/components/CreateConferenceForm'
import CreatePublicationsForm from '@/components/CreatePublicationsForm'
import CreateFundingForm from '@/components/CreateFundingForm'
import CreateBookForm from '@/components/CreateBookForm'

export default function EditWorkPage() {
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
      year: '2024'
    }
  }
  
  const work = mockWork
  const loading = false
  const error = ''

  const initial = useMemo(() => {
    if (!work) return null
    const d = work.detail || {}
    if (work.type === 'CONFERENCE') {
      return { ...d, durationStart: d.durationStart?.slice(0,10), durationEnd: d.durationEnd?.slice(0,10), Project: work.Project }
    }
    if (work.type === 'BOOK') {
      return { ...d, occurredAt: d.occurredAt?.slice(0,10), Project: work.Project }
    }
    return { ...d, Project: work.Project }
  }, [work])

  if (loading) return <div className="p-6 text-gray-500">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!work) return null

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-800">แก้ไขผลงานวิจัย ({work.type})</div>
      {work.type === 'CONFERENCE' && (
        <CreateConferenceForm mode="edit" workId={id} initialData={initial} />
      )}
      {work.type === 'PUBLICATION' && (
        <CreatePublicationsForm mode="edit" workId={id} initialData={initial} />
      )}
      {work.type === 'FUNDING' && (
        <CreateFundingForm mode="edit" workId={id} initialData={initial} />
      )}
      {work.type === 'BOOK' && (
        <CreateBookForm mode="edit" workId={id} initialData={initial} />
      )}
    </div>
  )
}
