'use server'

import CreateResearchForm from '@/components/CreateResearchForm'
import ProjectForm from '@/components/form/ProjectForm'

// แก้ไข: เปลี่ยนเป็น Server Component และ await params ก่อนใช้งาน
export default async function EditProjectPage({ params }) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  // ส่ง prop ชื่อ projectId เพื่อความสอดคล้องกับ ProjectForm
  return <ProjectForm mode="edit" projectId={id} />
}
