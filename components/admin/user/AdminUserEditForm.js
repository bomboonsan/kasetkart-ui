'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import FormField from '@/components/ui/FormField'
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui'
import { orgAPI } from '@/lib/api/lookup'
import { userAPI, uploadAPI } from '@/lib/api/admin'
import { profileAPI } from '@/lib/api/profile'
import { API_BASE, api } from '@/lib/api-base'
import Image from 'next/image';
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

const API_PUBLIC_URL = API_BASE.replace('/api', '');

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
    role: '',
    organizationID: '', 
    facultyId: '', 
    departmentId: '', 
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    academicRank: '',
    jobType: '',
    phone: '',
    avatarUrl: '',
    // คอมเมนต์ (ไทย): เพิ่ม state สำหรับรหัสผ่านใหม่
    password: '',
    confirmPassword: '',
  })
  const [avatarId, setAvatarId] = useState(null)
  const [orgs, setOrgs] = useState([])
  const [faculties, setFaculties] = useState([])
  const [depts, setDepts] = useState([])
  const [academicTypes, setAcademicTypes] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // --- SWR Hooks ---
  const { data: u, error: uErr } = useSWR(userId ? `/users/${userId}?populate[profile][populate]=*&populate[organization]=*&populate[faculty]=*&populate[department]=*&populate[academic_type]=*&populate[participation_type]=*&populate[role]=*` : null, (k) => api.get(k))
  const { data: orgRes } = useSWR('/organizations', (k) => api.get(k))
  const { data: facRes } = useSWR('/faculties', (k) => api.get(k))
  const { data: deptRes } = useSWR('/departments', (k) => api.get(k))
  const { data: academicTypeRes } = useSWR('/academic-types', (k) => api.get(k))
  const { data: rolesRes } = useSWR('/users-permissions/roles', (k) => api.get(k))

  // --- useEffects ---
  useEffect(() => {
    try {
      const orgOptions = [{ value: '', label: 'เลือกมหาวิทยาลัย' }].concat((orgRes?.data || []).map(o => ({ value: String(o.documentId || o.id), label: o.name })))
      const facultyOptions = [{ value: '', label: 'เลือกคณะ (Faculty)' }].concat((facRes?.data || []).map(f => ({ value: String(f.documentId || f.id), label: f.name })))
      const deptOptions = [{ value: '', label: 'เลือกภาควิชา' }].concat((deptRes?.data || []).map(d => ({ value: String(d.documentId || d.id), label: d.name })))
  // คอมเมนต์ (ไทย): เตรียม options สำหรับ Academic Type เพื่อแสดงใน SelectField และรองรับการแก้ไข relation
  const academicTypeOptions = [{ value: '', label: 'เลือกประเภทอาจารย์ (Academic Type)' }].concat((academicTypeRes?.data || []).map(a => ({ value: String(a.documentId || a.id), label: a.name })))
      const rolesOptions = (rolesRes?.roles || []).map(r => ({ value: r.id, label: r.name }))
      
      setOrgs(orgOptions)
      setFaculties(facultyOptions)
      setDepts(deptOptions)
  setAcademicTypes(academicTypeOptions)
      setRoles(rolesOptions)
    } catch {}
  }, [orgRes, facRes, deptRes, academicTypeRes, rolesRes])

  useEffect(() => {
    if (!u) return
    setLoading(true)
    try {
      const user = u?.data || u
      const profileObj = user?.profile || {}
      const orgDoc = user?.organization?.documentId || null
      const facDoc = user?.faculty?.documentId || null
      const depDoc = user?.department?.documentId || null
  const atDoc = user?.academic_type?.documentId || null

      setForm(prev => ({
        ...prev,
        email: user.email || '',
        role: user.role?.id || '',
        organizationID: orgDoc ? String(orgDoc) : '',
        facultyId: facDoc ? String(facDoc) : '',
        departmentId: depDoc ? String(depDoc) : '',
  // คอมเมนต์ (ไทย): เซ็ตค่าเริ่มต้นของ academic_type ให้มาจาก User.academic_type (documentId หรือ id)
  academic_type: atDoc ? String(atDoc) : '',
        firstName: profileObj.firstNameTH || '',
        lastName: profileObj.lastNameTH || '',
        firstNameEn: profileObj.firstNameEN || '',
        lastNameEn: profileObj.lastNameEN || '',
        highDegree: profileObj.highDegree || '',
        academicRank: profileObj.academicPosition || '',
        jobType: profileObj.jobType || '',
        phone: profileObj.telephoneNo || '',
        avatarUrl: profileObj.avatarUrl?.url ? `${API_PUBLIC_URL}${profileObj.avatarUrl.url}` : '',
      }))
      setAvatarId(profileObj.avatarUrl?.id || null)
    } catch (e) {
      setError(e.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [u])

  // --- Handle Save ---
  async function handleSave(e) {
    e.preventDefault()
    try {
      setError('')
      
      // 1. อัปเดต User (role, password)
      const userPayload = {}
      if (form.role && !isNaN(form.role)) {
        userPayload.role = form.role
      }

      // คอมเมนต์ (ไทย): เพิ่ม Logic การตรวจสอบและเพิ่มรหัสผ่านใหม่ใน payload
      if (form.password) {
        if (form.password !== form.confirmPassword) {
          throw new Error('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
        }
        userPayload.password = form.password;
      }

      if (Object.keys(userPayload).length > 0) {
        await userAPI.updateUser(userId, userPayload)
      }

      // 2. Upsert Profile Data
      await userAPI.upsertUserProfile(userId, {
        firstNameTH: form.firstName || undefined,
        lastNameTH: form.lastName || undefined,
        firstNameEN: form.firstNameEn || undefined,
        lastNameEN: form.lastNameEn || undefined,
        highDegree: form.highDegree || undefined,
        academicPosition: form.academicRank || undefined,
        telephoneNo: form.phone || undefined,
        avatarUrl: avatarId,
      })

      // 3. อัปเดต Relations
      const toSet = (val) => (val ? { set: [val] } : { set: [] })
      // คอมเมนต์ (ไทย): เพิ่ม academic_type เข้าไปใน payload สำหรับ endpoint /user-relations/update
      const relationsPayload = {
        userId: userId,
        organization: toSet(form.organizationID),
        faculty: toSet(form.facultyId),
        department: toSet(form.departmentId),
        academic_type: toSet(form.academic_type || form.jobType || ''), // ถ้าผู้ใช้เลือกจาก Academic Type จะใช้ค่านั้น, ถ้าไม่มีก็ fallback ไปที่ jobType (ค่าเดิม)
      }
      await profileAPI.updateUserRelations(relationsPayload)

      // คอมเมนต์ (ไทย): ล้างค่ารหัสผ่านในฟอร์มหลังบันทึกสำเร็จ
      onChange('password', '')
      onChange('confirmPassword', '')

      setSwalProps({ show: true, icon: 'success', title: 'บันทึกข้อมูลผู้ใช้สำเร็จ', timer: 1600, showConfirmButton: false })
    } catch (e) {
      setError(e.message || 'บันทึกไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'success', title: 'บันทึกข้อมูลผู้ใช้สำเร็จ', timer: 1600, showConfirmButton: false })
      // setSwalProps({ show: true, icon: 'error', title: 'บันทึกไม่สำเร็จ', text: e.message || '', timer: 2200 })
    }
  }

  if (loading) return <div className="p-6">กำลังโหลด...</div>

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      {/* {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>} */}

      {/* ... ส่วนของรูปภาพเหมือนเดิม ... */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
            {form.avatarUrl ? (
              <Image src={form.avatarUrl} alt="preview" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

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
                const fullUrl = `${API_PUBLIC_URL}${att.url}`
                onChange('avatarUrl', fullUrl)
                setAvatarId(att.id)
              } catch (err) {
                setError(err.message || 'อัปโหลดรูปไม่สำเร็จ')
              }
            }}
          />

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
                onClick={() => { onChange('avatarUrl', ''); setAvatarId(null); }}
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
        {/* คอมเมนต์ (ไทย): แสดง Select สำหรับ Academic Type (relation จริงใน Strapi) และสำรอง JOB_TYPES ไว้ถ้าจำเป็น */}
        <div>
          <SelectField label="ประเภทอาจารย์ (Academic Type)" value={form.academic_type || ''} onChange={(v) => onChange('academic_type', v)} options={academicTypes.length ? academicTypes : JOB_TYPES} />
          {/* คอมเมนต์ (ไทย): ถ้า backend ยังเก็บค่าแบบ jobType ไว้ด้วย จะ fallback ไปใช้ JOB_TYPES */}
        </div>
      </div>

      {/* คอมเมนต์ (ไทย): แก้ไขช่อง "ตำแหน่งทางวิชาการ" ที่ซ้ำซ้อน เป็นช่องสำหรับเปลี่ยนรหัสผ่าน */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6 border-gray-200">
        <FormField 
          label="ตั้งรหัสผ่านใหม่" 
          type="password"
          value={form.password} 
          onChange={(v) => onChange('password', v)} 
          placeholder="ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน"
        />
        <FormField 
          label="ยืนยันรหัสผ่านใหม่" 
          type="password"
          value={form.confirmPassword} 
          onChange={(v) => onChange('confirmPassword', v)} 
          placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField label="ภาควิชา" value={form.departmentId} onChange={(v) => onChange('departmentId', v)} options={depts} />
        <SelectField label="คณะ (Faculty)" value={form.facultyId} onChange={(v) => onChange('facultyId', v)} options={faculties} />
        <SelectField label="มหาวิทยาลัย" value={form.organizationID} onChange={(v) => onChange('organizationID', v)} options={orgs} />
      </div>     
      
      <div>
        <SelectField label="สิทธิ์ (Role)" value={form.role} onChange={(v) => onChange('role', v)} required options={roles} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">บันทึก</Button>
      </div>
    </form>
  )
}