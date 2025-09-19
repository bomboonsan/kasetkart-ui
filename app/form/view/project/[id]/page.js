'use server'

import CreateResearchForm from '@/components/form/ProjectForm'

// แก้ไข: แสดง UI เดียวกับหน้าแก้ไข (ใช้ CreateResearchForm) แต่ไม่อนุญาตให้แก้ไข
// แนวทาง: render ฟอร์มเหมือนหน้า edit แต่ทับด้วย overlay ที่ปิดการรับ input/clicks ทำให้เป็น read-only
export default async function ViewProjectPage({ params }) {
  const resolved = await params
  const id = resolved?.id

  return (
    <div className="relative">
      {/* แสดงฟอร์มในโหมด edit เพื่อให้ UI เหมือนกัน */}
      <CreateResearchForm mode="edit" projectId={id} />

      {/*
        Overlay ป้องกันการคลิก/กรอกข้อมูล ทำให้ฟอร์มเป็น read-only โดยไม่แก้ component หลัก
        คอมเมนต์ไทยนี้อธิบายเหตุผลตามกฏการทำงาน
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-50"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  )
}
