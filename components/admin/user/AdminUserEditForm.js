"use client"

import { useEffect, useState } from 'react'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { orgAPI, userAPI } from '@/lib/api'

const JOB_TYPES = [
  { value: '', label: 'เลือกประเภทอาจารย์' },
  { value: 'SA', label: 'SA' },
  { value: 'PA', label: 'PA' },
  { value: 'SP', label: 'SP' },
  { value: 'IP', label: 'IP' },
  { value: 'A', label: 'A' },
]

export default function AdminUserEditForm({ userId }) {
  const [form, setForm] = useState({
    email: '',
    role: 'USER',
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
  })
  const [orgs, setOrgs] = useState([])
  const [faculties, setFaculties] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const [u, orgRes, facRes, deptRes] = await Promise.all([
          userAPI.getUser(userId),
          orgAPI.getOrganizations(),
          orgAPI.getFaculties(),
          orgAPI.getAllDepartments(),
        ])
        const orgOptions = [{ value: '', label: 'เลือกมหาวิทยาลัย' }].concat((orgRes?.data || []).map(o => ({ value: String(o.id), label: o.name })))
        const facultyOptions = [{ value: '', label: 'เลือกคณะ (Faculty)' }].concat((facRes?.data || []).map(f => ({ value: String(f.id), label: f.name })))
        const deptOptions = [{ value: '', label: 'เลือกภาควิชา' }].concat((deptRes?.data || []).map(d => ({ value: String(d.id), label: d.name })))
        setOrgs(orgOptions); setFaculties(facultyOptions); setDepts(deptOptions)

        const p = u?.Profile?.[0] || {}
        setForm({
          email: u.email || '',
          role: u.role || 'USER',
          organizationID: u.organizationID ? String(u.organizationID) : '',
          facultyId: u.facultyId ? String(u.facultyId) : '',
          departmentId: u.departmentId ? String(u.departmentId) : '',
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          firstNameEn: p.firstNameEn || '',
          lastNameEn: p.lastNameEn || '',
          highDegree: p.highDegree || '',
          academicRank: p.academicRank || '',
          jobType: p.jobType || '',
          phone: p.phone || '',
        })
      } catch (e) {
        setError(e.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    })()
  }, [userId])

  async function handleSave(e) {
    e.preventDefault()
    try {
      setError('')
      // update user
      await userAPI.updateUser(userId, {
        role: form.role,
        organizationID: form.organizationID ? parseInt(form.organizationID) : undefined,
        facultyId: form.facultyId ? parseInt(form.facultyId) : undefined,
        departmentId: form.departmentId ? parseInt(form.departmentId) : undefined,
      })
      // upsert profile
      await userAPI.upsertUserProfile(userId, {
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        firstNameEn: form.firstNameEn || undefined,
        lastNameEn: form.lastNameEn || undefined,
        highDegree: form.highDegree || undefined,
        academicRank: form.academicRank || undefined,
        jobType: form.jobType || undefined,
        phone: form.phone || undefined,
      })
      alert('บันทึกข้อมูลผู้ใช้สำเร็จ')
    } catch (e) {
      setError(e.message || 'บันทึกไม่สำเร็จ')
    }
  }

  if (loading) return <div className="p-6">กำลังโหลด...</div>

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="อีเมล" type="email" value={form.email} onChange={(v) => onChange('email', v)} disabled />
        <SelectField label="สิทธิ์ (Role)" value={form.role} onChange={(v) => onChange('role', v)} required options={[{ value: 'USER', label: 'USER' },{ value: 'ADMIN', label: 'ADMIN' },{ value: 'SUPERADMIN', label: 'SUPERADMIN' }]} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField label="มหาวิทยาลัย" value={form.organizationID} onChange={(v) => onChange('organizationID', v)} options={orgs} />
        <SelectField label="คณะ (Faculty)" value={form.facultyId} onChange={(v) => onChange('facultyId', v)} options={faculties} />
        <SelectField label="ภาควิชา" value={form.departmentId} onChange={(v) => onChange('departmentId', v)} options={depts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="ชื่อ" value={form.firstName} onChange={(v) => onChange('firstName', v)} />
        <FormField label="นามสกุล" value={form.lastName} onChange={(v) => onChange('lastName', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="First Name (EN)" value={form.firstNameEn} onChange={(v) => onChange('firstNameEn', v)} />
        <FormField label="Last Name (EN)" value={form.lastNameEn} onChange={(v) => onChange('lastNameEn', v)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="วุฒิสูงสุด (High Degree)" value={form.highDegree} onChange={(v) => onChange('highDegree', v)} />
        <FormField label="ตำแหน่งทางวิชาการ" value={form.academicRank} onChange={(v) => onChange('academicRank', v)} />
        <SelectField label="ประเภทอาจารย์" value={form.jobType} onChange={(v) => onChange('jobType', v)} options={JOB_TYPES} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="เบอร์ติดต่อ" value={form.phone} onChange={(v) => onChange('phone', v)} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">บันทึก</Button>
      </div>
    </form>
  )
}

