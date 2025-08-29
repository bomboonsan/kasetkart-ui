"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { projectAPI } from '@/lib/api'
import ProjectView from '@/components/ProjectView'

export default function ProjectViewPage() {
  const params = useParams()
  const id = params?.id
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    (async () => {
      try {
        setLoading(true)
        const data = await projectAPI.getProject(id)
        setProject(data)
      } catch (err) {
        setError(err.message || 'ไม่สามารถโหลดข้อมูลโครงการ')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return <div className="p-6 text-gray-500">กำลังโหลดข้อมูล...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold text-gray-800">รายละเอียดโครงการ</div>
      <ProjectView project={project} />
    </div>
  )
}

