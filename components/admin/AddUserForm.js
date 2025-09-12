'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { orgAPI } from '@/lib/api/lookup'
import { userAPI, uploadAPI } from '@/lib/api/admin'
import { API_BASE, api } from '@/lib/api-base'
import Image from 'next/image';
import dynamic from 'next/dynamic'
const SweetAlert2 = dynamic(() => import('react-sweetalert2'), { ssr: false })

export default function AddUserForm() {
  const [swalProps, setSwalProps] = useState({})
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'USER',
    organization: '',
    faculty: '',
    department: '',
    academic_type: '',
    participation_type: '',
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    phone: '',
    academicPosition: '',
    avatarUrl: ''
  })
  
  const [organizations, setOrganizations] = useState([])
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [academicTypes, setAcademicTypes] = useState([])
  const [participationTypes, setParticipationTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // Load data using SWR like in GeneralInfoTab
  const { data: organizationsRes, error: orgError } = useSWR('organizations', () => orgAPI.getOrganizations())
  const { data: facultiesRes, error: facError } = useSWR('faculties', () => orgAPI.getFaculties())
  const { data: departmentsRaw, error: depError } = useSWR('departments', () => orgAPI.getDepartments())
  const { data: academicTypesRaw, error: acadError } = useSWR('academic-types', () => orgAPI.getAcademicType())
  const { data: participationTypesRaw, error: partError } = useSWR('participation-types', () => orgAPI.getParticipationTypes())

  useEffect(() => {
    // Normalize data like in GeneralInfoTab - use documentId for UI, keep realId for saving
    const normalize = (raw) => {
      const arr = raw?.data || raw || []
      return arr.map(x => ({
        id: x?.documentId, // ใช้ documentId เป็น value ใน select
        name: x?.name,
        realId: x?.id // เก็บ id จริงไว้สำหรับบันทึก
      }))
    }

    setOrganizations(normalize(organizationsRes))
    setFaculties(normalize(facultiesRes))
    setDepartments(normalize(departmentsRaw))
    setAcademicTypes(normalize(academicTypesRaw))
    setParticipationTypes(normalize(participationTypesRaw))
  }, [organizationsRes, facultiesRes, departmentsRaw, academicTypesRaw, participationTypesRaw])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Convert documentId to numeric id for relations like in GeneralInfoTab
      const convertToId = (docId, list) => {
        if (!docId) return undefined
        const item = list.find(x => x.id === docId)
        return item?.realId || docId
      }

      const payload = {
        email: form.email,
        password: form.password || 'defaultPassword123',
        role: form.role,
        organizationID: convertToId(form.organization, organizations),
        facultyId: convertToId(form.faculty, faculties), 
        departmentId: convertToId(form.department, departments),
        academic_type: convertToId(form.academic_type, academicTypes),
        participation_type: convertToId(form.participation_type, participationTypes),
      }

  // creating user with payload

      const user = await userAPI.createUser(payload)
      
      // Handle response - user might be in data field or directly returned
      const userId = user?.data?.id || user?.id
      if (!userId) {
        throw new Error('ไม่สามารถดึง user ID จากการสร้าง user ได้')
      }

  // created user with ID
      
      // Create profile data
      const profileData = {
        firstNameTH: form.firstName || '',
        lastNameTH: form.lastName || '',
        firstNameEN: form.firstNameEn || '',
        lastNameEN: form.lastNameEn || '',
        telephoneNo: form.phone || '',
        academicPosition: form.academicPosition || '',
        highDegree: form.highDegree || '',
        ...(form.avatarUrl && { avatarUrl: form.avatarUrl })
      }

      if (Object.keys(profileData).length > 0) {
        await userAPI.upsertUserProfile(userId, profileData)
      }

      setSwalProps({ show: true, icon: 'success', title: 'สร้างผู้ใช้สำเร็จ', timer: 1600, showConfirmButton: false })
      
      // Reset form
      setForm({
        email: '', password: '', role: 'USER', organization: '', faculty: '', department: '',
        academic_type: '', participation_type: '', firstName: '', lastName: '', firstNameEn: '', 
        lastNameEn: '', highDegree: '', phone: '', academicPosition: '', avatarUrl: ''
      })
    } catch (err) {
  setError(err.message || 'สร้างผู้ใช้ไม่สำเร็จ')
  setSwalProps({ show: true, icon: 'error', title: 'สร้างผู้ใช้ไม่สำเร็จ', text: err.message || '', timer: 2200 })
    } finally {
      setLoading(false)
    }
  }

  const dataLoaded = organizations.length > 0 && faculties.length > 0 && departments.length > 0 && academicTypes.length > 0 && participationTypes.length > 0

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      {/* {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
      )} */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
            {form.avatarUrl ? (
                            <Image src={form.avatarUrl} alt="preview" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </label>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">รูปโปรไฟล์</label>
          <p className="text-xs text-gray-500 mb-3">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
          
          <div className="flex gap-2">
            <label htmlFor="avatar-input" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <FormField
          label="อีเมล"
          type="email"
          value={form.email}
          onChange={(v) => onChange('email', v)}
          required
        />
        <FormField
          label="รหัสผ่าน"
          type="password"
          value={form.password}
          onChange={(v) => onChange('password', v)}
        required
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
          placeholder="เช่น Ph.D., M.Sc., B.Eng."
          required
        />
        <SelectField
          label="ประเภทอาจารย์"
          value={form.academic_type}
          onChange={(v) => onChange('academic_type', v)}
          required
          options={[{ value: '', label: 'เลือกประเภทอาจารย์' }, ...academicTypes.map(at => ({ value: at.id, label: at.name }))]}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="ประเภทการเข้าร่วม"
          value={form.participation_type}
          onChange={(v) => onChange('participation_type', v)}
          required
          options={[{ value: '', label: 'เลือกประเภทการเข้าร่วม' }, ...participationTypes.map(pt => ({ value: pt.id, label: pt.name }))]}
        />
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
  </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">        
        <SelectField
          label="มหาวิทยาลัย/หน่วยงาน"
          value={form.organization}
          onChange={(v) => onChange('organization', v)}
          required
          options={[{ value: '', label: 'เลือกมหาวิทยาลัย/หน่วยงาน' }, ...organizations.map(org => ({ value: org.id, label: org.name }))]}
        />
        <SelectField
          label="คณะ"
          value={form.faculty}
          onChange={(v) => onChange('faculty', v)}
          required
          options={[{ value: '', label: 'เลือกคณะ' }, ...faculties.map(fac => ({ value: fac.id, label: fac.name }))]}
        />
        <SelectField
          label="ภาควิชา"
          value={form.department}
          onChange={(v) => onChange('department', v)}
          required
          options={[{ value: '', label: 'เลือกภาควิชา' }, ...departments.map(dep => ({ value: dep.id, label: dep.name }))]}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'กำลังสร้าง...' : 'สร้างผู้ใช้'}
        </Button>
      </div>
    </form>
  )
}
