'use client'

import { useEffect, useState } from 'react'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { orgAPI, userAPI, uploadAPI, API_BASE } from '@/lib/api'

export default function AddUserForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'USER',
    organizationID: '',
    facultyId: '',
    departmentId: '',
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    jobType: '',
    phone: '',
    academicPosition: '',
    avatarUrl: ''
  })
  const [orgs, setOrgs] = useState([])
  const [faculties, setFaculties] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const [orgRes, facultiesRes, deptRes] = await Promise.all([
          orgAPI.getOrganizations(),
          orgAPI.getFaculties(),
          orgAPI.getAllDepartments(),
        ])
        const orgOptions = [{ value: '', label: 'เลือกหน่วยงาน' }].concat(
          (orgRes?.data || []).map(o => ({ value: String(o.id), label: o.name }))
        )
        const facultyOptions = [{ value: '', label: 'เลือกคณะ (Faculty)' }].concat(
          (facultiesRes?.data || []).map(f => ({ value: String(f.id), label: f.name }))
        )
        const deptOptions = [{ value: '', label: 'เลือกภาควิชา' }].concat(
          (deptRes?.data || []).map(d => ({ value: String(d.id), label: d.name }))
        )
        setOrgs(orgOptions)
        setFaculties(facultyOptions)
        setDepts(deptOptions)
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลหน่วยงาน/ภาควิชาไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: form.role,
        organizationID: form.organizationID ? parseInt(form.organizationID) : undefined,
        facultyId: form.facultyId ? parseInt(form.facultyId) : undefined,
        departmentId: form.departmentId ? parseInt(form.departmentId) : undefined,
      }
      const user = await userAPI.createUser(payload)
      // upsert profile
      const profile = {
        ...(form.firstName ? { firstName: form.firstName } : {}),
        ...(form.lastName ? { lastName: form.lastName } : {}),
        ...(form.firstNameEn ? { firstNameEn: form.firstNameEn } : {}),
        ...(form.lastNameEn ? { lastNameEn: form.lastNameEn } : {}),
        ...(form.highDegree ? { highDegree: form.highDegree } : {}),
        ...(form.jobType ? { jobType: form.jobType } : {}),
        ...(form.academicPosition ? { academicRank: form.academicPosition } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
        ...(form.avatarUrl ? { avatarUrl: form.avatarUrl } : {}),
      }
      if (Object.keys(profile).length > 0) {
        await userAPI.upsertUserProfile(user.id, profile)
      }
      alert('สร้างผู้ใช้สำเร็จ')
      setForm({ email: '', password: '', role: 'USER', organizationID: '', facultyId: '', departmentId: '', firstName: '', lastName: '', firstNameEn: '', lastNameEn: '', highDegree: '', jobType: '', phone: '', academicPosition: '', avatarUrl: '' })
    } catch (err) {
      setError(err.message || 'สร้างผู้ใช้ไม่สำเร็จ')
    }
  }

  if (loading) return <div className="p-6 text-gray-500">กำลังโหลด...</div>

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="อีเมล"
          type="email"
          value={form.email}
          onChange={(v) => onChange('email', v)}
          required
        />
        <FormField
          label="รหัสผ่าน (ไม่เป็นจำ)"
          type="password"
          value={form.password}
          onChange={(v) => onChange('password', v)}
        // required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="ชื่อ"
          value={form.firstName}
          onChange={(v) => onChange('firstName', v)}
          required
        />
        <FormField
          label="นามสกุล"
          value={form.lastName}
          onChange={(v) => onChange('lastName', v)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          value={form.firstNameEn}
          onChange={(v) => onChange('firstNameEn', v)}
          required
        />
        <FormField
          label="Last Name"
          value={form.lastNameEn}
          onChange={(v) => onChange('lastNameEn', v)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="ตำแหน่งทางวิชาการ"
          value={form.academicPosition}
          onChange={(v) => onChange('academicPosition', v)}
          required
        />
        <FormField
          label="เบอร์ติดต่อ"
          value={form.phone}
          onChange={(v) => onChange('phone', v)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="HighDegree"
          value={form.highDegree}
          onChange={(v) => onChange('highDegree', v)}
          required
        />
        <FormField
          // Dashboard SA PA SP IP A
          label="ประเภทอาจารย์ * select"
          value={form.jobType}
          onChange={(v) => onChange('jobType', v)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">รูปโปรไฟล์</label>
        <input type="file" accept="image/*" onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          try {
            const [att] = await uploadAPI.uploadFiles([f])
            const full = `${API_BASE}${att.url}`
            onChange('avatarUrl', full)
          } catch (err) {
            setError(err.message || 'อัปโหลดรูปไม่สำเร็จ')
          }
        }} />
        {form.avatarUrl && (
          <img src={form.avatarUrl} alt="preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
        )}
      </div>      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField
          label="สิทธิ์ (Role)"
          value={form.role}
          onChange={(v) => onChange('role', v)}
          required
          options={[
            { value: 'USER', label: 'USER' },
            { value: 'ADMIN', label: 'ADMIN' },
            { value: 'SUPERADMIN', label: 'SUPERADMIN' },
          ]}
        />
        <SelectField
          label="มหาวิทยาลัย"
          value={form.organizationID}
          onChange={(v) => onChange('organizationID', v)}
          required
          options={orgs}
        />
        <SelectField
          label="คณะ (Faculty)"
          value={form.facultyId}
          onChange={(v) => onChange('facultyId', v)}
          required
          options={faculties}
        />
        <SelectField
          label="ภาควิชา"
          value={form.departmentId}
          onChange={(v) => onChange('departmentId', v)}
          required
          options={depts}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">สร้างผู้ใช้</Button>
      </div>
    </form>
  )
}
