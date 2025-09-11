'use client'

import EditPublicationsForm from '@/components/EditPublicationsForm'

export default function ViewPublicationPage({ params }) {
  // ใช้คอมโพเนนต์ฟอร์มแบบเดียวกับหน้าแก้ไข แต่ตั้งเป็น readonly เพื่อแสดงข้อมูล
  return <EditPublicationsForm mode="edit" workId={params.id} readonly={true} />
}
