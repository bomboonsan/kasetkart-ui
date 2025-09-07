// ยูทิลิตี้ช่วยงานฟอร์ม: ลดโค้ดซ้ำ และทำให้อ่านง่าย

// สร้าง handler มาตรฐานสำหรับ onChange ของฟิลด์
export const createHandleChange = (setFormData) => (field, value) =>
  setFormData((prev) => ({ ...prev, [field]: value }))

// wrapper สำหรับงาน async ที่ต้องมี loading state
export const withLoading = (setLoading, fn) => async (...args) => {
  setLoading(true)
  try {
    return await fn(...args)
  } finally {
    setLoading(false)
  }
}
