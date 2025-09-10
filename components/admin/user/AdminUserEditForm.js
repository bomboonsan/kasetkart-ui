"use client"

// ใช้ SWR ดึงข้อมูล user/organizations/faculties/departments
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { orgAPI } from '@/lib/api/lookup'
import { userAPI, uploadAPI } from '@/lib/api/admin'
import { profileAPI } from '@/lib/api/profile'
import { API_BASE, api } from '@/lib/api-base'
import SweetAlert2 from 'react-sweetalert2'

const JOB_TYPES = [
  { value: '', label: 'เลือกประเภทอาจารย์' },
  { value: 'SA', label: 'SA' },
  { value: 'PA', label: 'PA' },
  { value: 'SP', label: 'SP' },
  { value: 'IP', label: 'IP' },
  { value: 'A', label: 'A' },
]

export default function AdminUserEditForm({ userId }) {
  const [swalProps, setSwalProps] = useState({})
  const [form, setForm] = useState({
    email: '',
    role: 'USER',
  // เปลี่ยนเป็นเก็บ documentId แบบเดียวกับหน้า /profile/edit
  organizationID: '', // documentId ของ organization
  facultyId: '', // documentId ของ faculty
  departmentId: '', // documentId ของ department
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    academicRank: '',
    jobType: '',
    phone: '',
    avatarUrl: '',
  })
  const [orgs, setOrgs] = useState([])
  const [faculties, setFaculties] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // ดึงข้อมูลด้วย SWR
  // ดึงข้อมูล user โดย populate ให้ได้ Profile และ relations (documentId) ให้มากที่สุด
  const { data: u, error: uErr } = useSWR(userId ? `/users/${userId}?populate[profile][populate]=*&populate[organization]=*&populate[faculty]=*&populate[department]=*&populate[academic_type]=*&populate[participation_type]=*&populate[educations]=*` : null, (k) => api.get(k))
  const { data: orgRes } = useSWR('/organizations', (k) => api.get(k))
  const { data: facRes } = useSWR('/faculties', (k) => api.get(k))
  const { data: deptRes } = useSWR('/departments', (k) => api.get(k))

  useEffect(() => {
    try {
  // คอมเมนต์ (ไทย): ให้ใช้ documentId เป็น value ของ select เพื่อสอดคล้องกับหน้า /profile/edit
  const orgOptions = [{ value: '', label: 'เลือกมหาวิทยาลัย' }].concat((orgRes?.data || []).map(o => ({ value: String(o.documentId || o.id), label: o.name })))
  const facultyOptions = [{ value: '', label: 'เลือกคณะ (Faculty)' }].concat((facRes?.data || []).map(f => ({ value: String(f.documentId || f.id), label: f.name })))
  const deptOptions = [{ value: '', label: 'เลือกภาควิชา' }].concat((deptRes?.data || []).map(d => ({ value: String(d.documentId || d.id), label: d.name })))
      setOrgs(orgOptions); setFaculties(facultyOptions); setDepts(deptOptions)
    } catch {}
  }, [orgRes, facRes, deptRes])

  useEffect(() => {
    if (!u) return
    setLoading(true)
    try {
      // คอมเมนต์ (ไทย): ใช้ข้อมูลจาก User entity เป็นหลัก (เหมือนหน้า /profile/edit)
      const profileObj = u?.profile || u?.Profile?.[0] || {}
      // ดึงค่า documentId ของ relations ถ้ามี (หน้า profile ใช้ documentId เป็นค่า select)
      const orgDoc = u?.organization?.documentId || u?.organizationID || null
      const facDoc = u?.faculty?.documentId || u?.facultyId || null
      const depDoc = u?.department?.documentId || u?.departmentId || null

      setForm({
        email: u.email || '',
        role: u.role || 'USER',
        organizationID: orgDoc ? String(orgDoc) : '',
        facultyId: facDoc ? String(facDoc) : '',
        departmentId: depDoc ? String(depDoc) : '',
        firstName: profileObj.firstName || profileObj.firstNameTH || '',
        lastName: profileObj.lastName || profileObj.lastNameTH || '',
        firstNameEn: profileObj.firstNameEn || profileObj.firstNameEN || '',
        lastNameEn: profileObj.lastNameEn || profileObj.lastNameEN || '',
        highDegree: profileObj.highDegree || '',
        academicRank: profileObj.academicRank || profileObj.academicPosition || '',
        jobType: profileObj.jobType || '',
        phone: profileObj.phone || profileObj.telephoneNo || '',
        avatarUrl: profileObj.avatarUrl || '',
      })
    } catch (e) {
      setError(e.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [u])

  async function handleSave(e) {
    e.preventDefault()
    try {
      setError('')
      // อัปเดต non-relation fields ของ User โดยไม่แตะ relations ตรงๆ
      await userAPI.updateUser(userId, {
        role: form.role,
      })

      // upsert profile data (Profile entity) เหมือนหน้า /profile/edit
      await userAPI.upsertUserProfile(userId, {
        firstNameTH: form.firstName || undefined,
        lastNameTH: form.lastName || undefined,
        firstNameEN: form.firstNameEn || undefined,
        lastNameEN: form.lastNameEn || undefined,
        highDegree: form.highDegree || undefined,
        academicPosition: form.academicRank || undefined,
        telephoneNo: form.phone || undefined,
        avatarUrl: form.avatarUrl || undefined,
      })

      // อัปเดต relations ผ่าน endpoint ที่ออกแบบมาสำหรับ Strapi v5 (รองรับ documentId)
      // รูปแบบ Strapi v5: to-one relation -> { set: [documentId] } , เคลียร์ -> { set: [] }
      const toSet = (val) => (val ? { set: [val] } : { set: [] })
      // คอมเมนต์ (ไทย): ส่ง payload แบบ Strapi v5 (to-one relations ใช้ { set: [documentId] })
      const relationsPayload = {
        userId: userId,
        organization: form.organizationID ? toSet(form.organizationID) : toSet(null),
        organization_documentId: form.organizationID ? form.organizationID : undefined,
        faculty: form.facultyId ? toSet(form.facultyId) : toSet(null),
        faculty_documentId: form.facultyId ? form.facultyId : undefined,
        department: form.departmentId ? toSet(form.departmentId) : toSet(null),
        department_documentId: form.departmentId ? form.departmentId : undefined,
      }
      // เรียก API เฉพาะสำหรับ relation เพื่อให้ backend map documentId -> id และอัปเดตอย่างปลอดภัย
      await profileAPI.updateUserRelations(relationsPayload)
      setSwalProps({ show: true, icon: 'success', title: 'บันทึกข้อมูลผู้ใช้สำเร็จ', timer: 1600, showConfirmButton: false })
    } catch (e) {
      setError(e.message || 'บันทึกไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกไม่สำเร็จ', text: e.message || '', timer: 2200 })
    }
  }

  if (loading) return <div className="p-6">กำลังโหลด...</div>

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          {/* Hidden file input - keeping existing upload logic */}
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              try {
                const [att] = await uploadAPI.uploadFiles([f])
                const full = `${API_BASE}${att.url}`
                onChange('avatarUrl', full)
              } catch (err) {
                setError(err.message || 'อัปโหลดรูปไม่สำเร็จ')
              }
            }}
          />

          {/* Camera icon overlay button */}
          <label htmlFor="avatar-input" className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors" title="อัปโหลดรูปโปรไฟล์">
            <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">รูปโปรไฟล์</label>
          <p className="text-xs text-gray-500 mb-3">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>

          <div className="flex gap-2">
            <label htmlFor="avatar-input" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              เลือกไฟล์
            </label>

            {form.avatarUrl && (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => onChange('avatarUrl', '')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                ลบรูป
              </button>
            )}
          </div>

          {form.avatarUrl && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              ✓ อัปโหลดสำเร็จ
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="ชื่อ" value={form.firstName} onChange={(v) => onChange('firstName', v)} />
        <FormField label="นามสกุล" value={form.lastName} onChange={(v) => onChange('lastName', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="First Name (EN)" value={form.firstNameEn} onChange={(v) => onChange('firstNameEn', v)} />
        <FormField label="Last Name (EN)" value={form.lastNameEn} onChange={(v) => onChange('lastNameEn', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="อีเมล" type="email" value={form.email} onChange={(v) => onChange('email', v)} disabled />
        <FormField label="ตำแหน่งทางวิชาการ" value={form.academicRank} onChange={(v) => onChange('academicRank', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="เบอร์ติดต่อ" value={form.phone} onChange={(v) => onChange('phone', v)} />
        <SelectField label="ประเภทอาจารย์" value={form.jobType} onChange={(v) => onChange('jobType', v)} options={JOB_TYPES} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="วุฒิสูงสุด (High Degree)" value={form.highDegree} onChange={(v) => onChange('highDegree', v)} />
        <FormField label="ตำแหน่งทางวิชาการ" value={form.academicRank} onChange={(v) => onChange('academicRank', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField label="ภาควิชา" value={form.departmentId} onChange={(v) => onChange('departmentId', v)} options={depts} />
        <SelectField label="คณะ (Faculty)" value={form.facultyId} onChange={(v) => onChange('facultyId', v)} options={faculties} />
        <SelectField label="มหาวิทยาลัย" value={form.organizationID} onChange={(v) => onChange('organizationID', v)} options={orgs} />
      </div>     
      
      <div>
        <SelectField label="สิทธิ์ (Role)" value={form.role} onChange={(v) => onChange('role', v)} required options={[{ value: 'USER', label: 'USER' }, { value: 'ADMIN', label: 'ADMIN' }, { value: 'SUPERADMIN', label: 'SUPERADMIN' }]} />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">รูปโปรไฟล์</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            try {
              const [att] = await uploadAPI.uploadFiles([f])
              const full = `${API_BASE}${att.url}`
              onChange('avatarUrl', full)
            } catch (err) {
              setError(err.message || 'อัปโหลดรูปไม่สำเร็จ')
            }
          }}
        />
        {form.avatarUrl && (
          <img src={form.avatarUrl} alt="preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
        )}
      </div> */}

      

      <div className="flex justify-end">
        <Button type="submit" variant="primary">บันทึก</Button>
      </div>
    </form>
  )
}
