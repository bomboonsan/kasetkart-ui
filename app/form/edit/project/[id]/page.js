'use server'

import CreateResearchForm from '@/components/CreateResearchForm'

// แก้ไข: เปลี่ยนเป็น Server Component และ await params ก่อนใช้งาน
export default async function EditProjectPage({ params }) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  // ส่ง prop ชื่อ projectId เพื่อความสอดคล้องกับ CreateResearchForm
  return <CreateResearchForm mode="edit" projectId={id} />
}
