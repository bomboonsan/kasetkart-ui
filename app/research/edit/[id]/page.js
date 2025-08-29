"use client"

import ProjectForm from '@/components/ProjectForm'
import { useParams } from 'next/navigation'

export default function EditProjectPage() {
  const params = useParams()
  const id = params?.id
  if (!id) return null
  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-800">แก้ไขโครงการวิจัย</div>
      <ProjectForm projectId={id} readonly={false} />
    </div>
  )
}

