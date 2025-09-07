// ยูทิลิตี้สำหรับช่วยจัดการข้อมูลกับ Strapi v5 (documentId, payload cleaning)

// ตรวจว่าเป็นค่า non-empty (ยอมรับ 0, false แต่ไม่ยอมรับ undefined/null/'')
export const isNonEmpty = (v) => v !== undefined && v !== null && String(v) !== ''

// ลบ key ที่เป็น undefined ออกจาก object (กัน payload สกปรก)
export const stripUndefined = (obj = {}) => Object.fromEntries(
  Object.entries(obj).filter(([, v]) => v !== undefined)
)

// ดึง documentId (fallback ไป id ถ้าไม่มี)
export const getDocumentId = (x) => {
  if (!x) return ''
  if (typeof x === 'string') return x
  return x.documentId ?? x.id ?? ''
}

// ดึง id จริง (ใช้กับ relations ฝั่ง backend)
export const getId = (x) => {
  if (!x) return undefined
  if (typeof x === 'number') return x
  return x.id
}

// แปลง collection response -> options ใช้กับ select
export const normalizeCollection = (raw) => {
  const arr = raw?.data || raw || []
  return arr.map((x) => ({
    id: x?.documentId ?? x?.id,
    name: x?.name || x?.titleTH || x?.titleEN || x?.title || '',
    realId: x?.id,
  }))
}

// สร้างชื่อผู้ใช้จากโปรไฟล์/อีเมล สำหรับแสดงผล
export const toUserDisplayName = (user) => {
  if (!user) return ''
  const prof = Array.isArray(user.profile) ? user.profile[0] : user.profile
  const full = `${prof?.firstName || ''} ${prof?.lastName || ''}`.trim()
  return full || user.email || ''
}

// รวมบรรทัดหน่วยงานผู้ใช้
export const toUserOrgLine = (user) => {
  if (!user) return ''
  return [user.department?.name, user.faculty?.name, user.organization?.name]
    .filter(Boolean)
    .join(' ')
}

// แปลง Error จาก axios/Strapi -> ข้อความอ่านง่าย
export const parseApiError = (err, fallback = 'เกิดข้อผิดพลาด') =>
  err?.response?.data?.error?.message || err?.message || fallback
