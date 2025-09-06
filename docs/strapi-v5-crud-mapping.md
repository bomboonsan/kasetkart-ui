# Strapi v5 CRUD และ Relations Mapping Guide

## ภาพรวม

เอกสารนี้อธิบายวิธีการทำ CRUD และ mapping ข้อมูลที่มี relations ใน Strapi v5 โดยเฉพาะการจัดการกับ `documentId` และ `id` ที่แตกต่างกัน

## ความแตกต่างสำคัญใน Strapi v5

### 1. documentId vs id

- **documentId**: ใช้สำหรับ API endpoints และการแสดงผลใน frontend
- **id**: ใช้สำหรับ relations และการบันทึกข้อมูล backend

```javascript
// Response จาก Strapi v5
{
  "data": {
    "documentId": "clkgylmcc000008lcdd868feh", // ใช้สำหรับ API calls
    "id": 123, // ใช้สำหรับ relations
    "name": "Computer Science"
  }
}
```

### 2. Response Format เปลี่ยนแปลง

- Strapi v4: `{ data: { id, attributes: { name } } }`
- Strapi v5: `{ data: { documentId, id, name } }` (ไม่มี attributes)

## วิธีการ Mapping ที่ถูกต้อง

### 1. การ Normalize ข้อมูลสำหรับ Select Options

```javascript
const normalize = (raw) => {
  const arr = raw?.data || raw || []
  return arr.map(x => ({
    id: x?.documentId, // ใช้ documentId เป็น value ใน select
    name: x?.name, // Strapi v5 ไม่มี attributes แล้ว
    realId: x?.id // เก็บ id จริงไว้สำหรับบันทึก
  }))
}
```

### 2. การ Map ข้อมูลจาก Backend มาแสดงใน Form

```javascript
// ใช้ documentId สำหรับแสดงค่าใน select
setFormData(prev => ({
  ...prev,
  academic_type: res?.academic_type?.documentId || '',
  department: res?.department?.documentId || '',
  faculty: res?.faculty?.documentId || '',
}))
```

### 3. การแปลงข้อมูลก่อนบันทึกไป Backend

```javascript
const setIf = (key, val) => {
  if (val !== undefined && val !== null && val !== '') {
    // หา realId จาก documentId ที่เลือกไว้
    let realId = val
    if (key === 'department') {
      const dept = departments.find(d => d.id === val)
      realId = dept?.realId || val
    }
    // ... อื่นๆ
    userBody[key] = realId // ใช้ id จริงสำหรับบันทึก
  }
}
```

## API Endpoints ใน Strapi v5

### Collection Types

```javascript
// GET - ดึงข้อมูลทั้งหมด
GET /api/profiles?populate=*&publicationState=preview

// GET - ดึงข้อมูลรายการเดียว (ใช้ documentId)
GET /api/profiles/:documentId?populate=*&publicationState=preview

// POST - สร้างข้อมูลใหม่
POST /api/profiles
Body: { data: { name: "...", user: userId } }

// PUT - อัปเดตข้อมูล (ใช้ documentId)
PUT /api/profiles/:documentId
Body: { data: { name: "..." } }

// DELETE - ลบข้อมูล (ใช้ documentId)
DELETE /api/profiles/:documentId
```

### Relations ใน Payload

```javascript
// สำหรับ one-to-one relations
{
  data: {
    academic_type: 123, // ใช้ id (ไม่ใช่ documentId)
    department: 456
  }
}

// สำหรับ one-to-many relations
{
  data: {
    education_level: 789, // ใช้ id
    users_permissions_user: 999
  }
}
```

## ปัญหาและการแก้ไข

### 1. Select ไม่แสดงค่าที่ถูกต้อง

**สาเหตุ**: ใช้ `id` แทน `documentId` ใน value

**วิธีแก้**:
```javascript
// ❌ ผิด
academic_type: res?.academic_type?.id

// ✅ ถูก
academic_type: res?.academic_type?.documentId
```

### 2. บันทึกไม่สำเร็จ

**สาเหตุ**: ส่ง `documentId` แทน `id` ใน relations

**วิธีแก้**:
```javascript
// แปลง documentId กลับเป็น id ก่อนบันทึก
const realId = departments.find(d => d.id === formData.department)?.realId
```

### 3. API calls ไม่สำเร็จ

**สาเหตุ**: ใช้ `id` แทน `documentId` ใน endpoints

**วิธีแก้**:
```javascript
// ❌ ผิด
PUT /api/profiles/123

// ✅ ถูก
PUT /api/profiles/clkgylmcc000008lcdd868feh
```

## Best Practices

1. **เสมอใช้ `publicationState=preview`** เพื่อดู draft content
2. **เก็บทั้ง `documentId` และ `id`** ใน state
3. **ใช้ `documentId` สำหรับ UI, `id` สำหรับ relations**
4. **Populate relations ที่จำเป็น** เท่านั้น
5. **Handle edge cases** เช่น ข้อมูลไม่มี, null values

## ตัวอย่างการใช้งานจริง

```javascript
// Component state
const [formData, setFormData] = useState({
  academic_type: '', // เก็บ documentId
})

// Normalize options
const academicTypes = raw?.data?.map(x => ({
  id: x.documentId, // value สำหรับ select
  name: x.name,
  realId: x.id // เก็บไว้สำหรับบันทึก
}))

// บันทึกข้อมูล
const realAcademicTypeId = academicTypes.find(
  at => at.id === formData.academic_type
)?.realId

await api.put(`/users/${userId}`, {
  academic_type: realAcademicTypeId // ใช้ id จริง
})
```

## สรุป

การทำ CRUD ใน Strapi v5 ต้องระวังเรื่อง:
1. ใช้ `documentId` สำหรับ API endpoints และ UI
2. ใช้ `id` สำหรับ relations และการบันทึก
3. แปลงข้อมูลให้ถูกต้องก่อนส่งไป backend
4. ใช้ `publicationState=preview` สำหรับ draft content
