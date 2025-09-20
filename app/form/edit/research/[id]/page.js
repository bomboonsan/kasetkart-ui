'use server'

import ResearchForm from '@/components/ResearchForm'

// แก้ไข: เปลี่ยนเป็น Server Component และ await params ตามคำเตือนของ Next.js
// เพื่อให้แน่ใจว่า params.id ถูก resolve ก่อนส่งไปยัง client component
export default async function EditResearchPage({ params }) {
  // await params เพื่อรองรับกรณีที่ params เป็น Promise-like ตาม docs
  const resolvedParams = await params
  const projectId = resolvedParams?.id

  return <ResearchForm mode="edit" projectId={projectId} />
}
