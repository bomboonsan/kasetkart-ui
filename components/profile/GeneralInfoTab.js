"use client"

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { profileAPI, orgAPI, eduAPI } from '@/lib/api'
import ProfileImageUpload from './ProfileImageUpload'
import FormField from '@/components/FormField'
import FormSelect from '@/components/FormSelect'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { Trash2 } from 'lucide-react'
import SweetAlert2 from 'react-sweetalert2'
import { createHandleChange } from '@/utils/form'

export default function GeneralInfoTab() {
  const [swalProps, setSwalProps] = useState({})
  const [formData, setFormData] = useState({
    // คอมเมนต์ (ไทย): ฟิลด์สำหรับฟอร์มโปรไฟล์ จะแม็ปเข้ากับ schema ใน Strapi ตามชนิดฟิลด์
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    academic_type: '',
    participation_type: '',
    email: '',
    phone: '',
    nameEn: '',
    academicPosition: '',
    department: '',
    faculty: '',
    organization: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState([])
  const [academicTypes, setAcademicTypes] = useState([])
  const [participationTypes, setParticipationTypes] = useState([])
  const [faculties, setFaculties] = useState([])
  const [organizations, setOrganizations] = useState([])

  const handleInputChange = createHandleChange(setFormData)

  const handleSave = async () => {
    try {
      setError('')
      setLoading(true)

      const res = profileRes?.data || profileRes || {}
      const userId = res?.id

      if (!userId) throw new Error('ไม่พบข้อมูลผู้ใช้ (userId)')

      // เตรียมข้อมูลสำหรับ profile (collection type)
      const profileBody = {
        firstNameTH: formData.firstName?.trim() || '',
        lastNameTH: formData.lastName?.trim() || '',
        firstNameEN: formData.firstNameEn?.trim() || '',
        lastNameEN: formData.lastNameEn?.trim() || '',
        telephoneNo: formData.phone?.trim() || '',
        academicPosition: formData.academicPosition?.trim() || '',
        highDegree: formData.highDegree?.trim() || '',
      }

      // เตรียมข้อมูลสำหรับ user (relations + email)
      // Strapi v5: ใช้ documentId สำหรับ relations
      const userBody = {}
      if (formData.email) userBody.email = formData.email
      if (formData.department) userBody.department = formData.department
      if (formData.faculty) userBody.faculty = formData.faculty
      if (formData.organization) userBody.organization = formData.organization
      if (formData.academic_type) userBody.academic_type = formData.academic_type
      if (formData.participation_type) userBody.participation_type = formData.participation_type

      // Find existing profile หรือสร้างใหม่ - ใช้ documentId ใน Strapi v5
      let profileDocumentId = res?.profile?.documentId || res?.profile?.data?.documentId || res?.Profile?.[0]?.documentId || res?.Profile?.[0]?.data?.documentId

      if (!profileDocumentId) {
        const existingProfile = await profileAPI.findProfileByUserId(userId)
        profileDocumentId = existingProfile?.documentId
      }

      // อัปเดต/สร้าง profile ด้วย collection endpoint และ documentId
      if (profileDocumentId) {
        await profileAPI.updateProfileData(profileDocumentId, profileBody)
      } else {
        await profileAPI.createProfile({ ...profileBody, user: userId })
      }

      // อัปเดต user เพื่อผูก relations และอีเมล
      if (Object.keys(userBody).length > 0) {
        await profileAPI.updateProfile(userId, userBody)
      }

      // Refresh the profile data
      mutate('profile')

      setSwalProps({ show: true, icon: 'success', title: 'บันทึกโปรไฟล์สำเร็จ', timer: 1600, showConfirmButton: false })
    } catch (err) {
      setError(err?.message || 'บันทึกโปรไฟล์ไม่สำเร็จ')
      setSwalProps({ show: true, icon: 'error', title: 'บันทึกโปรไฟล์ไม่สำเร็จ', text: err?.message || '', timer: 2200 })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // TODO: Implement cancel logic or navigate back
  // no-op cancel for now
  }

  // คอมเมนต์ (ไทย): โครงสร้าง state สำหรับวุฒิการศึกษาจริง (Strapi: education)
  const [educations, setEducations] = useState([])
  const [originalEducations, setOriginalEducations] = useState([])
  const [removedEducationIds, setRemovedEducationIds] = useState([])

  const addEducation = () => {
    // คอมเมนต์ (ไทย): เพิ่มรายการการศึกษาใหม่แบบว่าง ตรงตาม schema ของ Strapi v5 (ใช้ documentId)
    const tempId = `temp_${Date.now()}_${Math.random()}`
    setEducations(prev => [...prev, {
      documentId: undefined,
      education_level: '',
      name: '',
      faculty: '',
      year: '',
      _tempId: tempId
    }])
  }

  // Load profile and populate form fields
  const { data: profileRes, error: swrError } = useSWR('profile', () => profileAPI.getMyProfile())
  const { data: organizationsRes, error: orgError } = useSWR('organizations', () => orgAPI.getOrganizations())
  const { data: facultiesRes, error: facError } = useSWR('faculties', () => orgAPI.getFaculties())
  const { data: departmentsRaw, error: depError } = useSWR('departments', () => orgAPI.getDepartments())
  const { data: academicTypesRaw, error: acadError } = useSWR('academic-types', () => orgAPI.getAcademicType())
  const { data: participationTypesRaw, error: partError } = useSWR('participation-types', () => orgAPI.getParticipationTypes())
  const { data: eduLevelsRaw, error: eduLvlErr } = useSWR('education-levels', () => orgAPI.getEducationLevels())

  if (swrError && !error) setError(swrError.message || 'โหลดโปรไฟล์ไม่สำเร็จ')

  useEffect(() => {
    const res = profileRes?.data || profileRes || {}
    const profObj = res.profile || res.Profile?.[0] || res
    if (!profileRes) return

    // คอมเมนต์ (ไทย): map ฟิลด์จาก profile และ user
    // Strapi v5: ใช้ documentId สำหรับแสดงค่าใน select (frontend) แต่เก็บ id ไว้สำหรับบันทึก (backend)
    setFormData(prev => ({
      ...prev,
      firstName: profObj?.firstNameTH || profObj?.firstName || '',
      lastName: profObj?.lastNameTH || profObj?.lastName || '',
      firstNameEn: profObj?.firstNameEN || profObj?.firstNameEn || '',
      lastNameEn: profObj?.lastNameEN || profObj?.lastNameEn || '',
      phone: profObj?.telephoneNo || '',
      email: res?.email || profObj?.email || '',
      nameEn: profObj ? `${profObj?.firstNameEN || profObj?.firstNameEn || profObj?.firstName || ''} ${profObj?.lastNameEN || profObj?.lastNameEn || profObj?.lastName || ''}`.trim() : '',
      academicPosition: profObj?.academicPosition || profObj?.position || '',
      highDegree: profObj?.highDegree || '',
      academic_type: res?.academic_type?.documentId || '',
      participation_type: res?.participation_type?.documentId || '',
      department: res?.department?.documentId || '',
      faculty: res?.faculty?.documentId || '',
      organization: res?.organization?.documentId || '',
    }))

    // ดึงวุฒิการศึกษาที่ populate มาด้วย (Strapi v5: ใช้ documentId สำหรับแสดงผล, id สำหรับบันทึก)
    // แก้ไข: ป้องกันการ duplicate โดยเช็คว่า educations ที่มีอยู่แล้วต่างจาก response หรือไม่
    const eduArr = res?.educations || []

    // Normalize and dedupe educations from various Strapi shapes
    const normalizeAndDedupe = (arr) => {
      const mapped = (arr || []).map((e, index) => {
        const documentId = e?.documentId || e?.id || undefined
        // education_level may be an object or a documentId string
        const education_level = typeof e?.education_level === 'object'
          ? (e.education_level.documentId || e.education_level.id || '')
          : (e?.education_level || '')
        const education_level_name = typeof e?.education_level === 'object' ? (e.education_level.name || '') : ''
        return {
          documentId,
          education_level,
          education_level_name,
          name: e?.name || '',
          faculty: e?.faculty || '',
          year: e?.year || '',
          _tempId: documentId ? `edu_${documentId}` : `edu_temp_${Date.now()}_${index}`
        }
      })

      // dedupe by documentId when present, otherwise by composite key
      const map = new Map()
      for (const item of mapped) {
        const key = item.documentId || `${item.education_level}||${item.name}||${item.year}`
        if (!map.has(key)) map.set(key, item)
      }
      return Array.from(map.values())
    }

    const normalized = normalizeAndDedupe(eduArr)

    // อัพเดตเฉพาะเมื่อข้อมูลเปลี่ยนแปลงจริงๆ เพื่อป้องกัน duplicate
    setEducations(prev => {
      const prevString = JSON.stringify(prev.map(e => ({ documentId: e.documentId, education_level: e.education_level, name: e.name, faculty: e.faculty, year: e.year })))
      const newString = JSON.stringify(normalized.map(e => ({ documentId: e.documentId, education_level: e.education_level, name: e.name, faculty: e.faculty, year: e.year })))
      return prevString !== newString ? normalized : prev
    })
    setOriginalEducations(normalized)
    setRemovedEducationIds([])
  }, [profileRes])

  useEffect(() => {
    // คอมเมนต์ (ไทย): แปลงรูปแบบ response ของ Strapi v5
    // ใช้ documentId สำหรับ value ใน select และ id สำหรับบันทึกข้อมูล
    const normalize = (raw) => {
      const arr = raw?.data || raw || []
      return arr.map(x => ({
        id: x?.documentId, // ใช้ documentId เป็น value ใน select
        name: x?.name, // Strapi v5 ไม่มี attributes แล้ว
        realId: x?.id // เก็บ id จริงไว้สำหรับบันทึก
      }))
    }

    // Departments
    const departments = normalize(departmentsRaw)
    if (depError) console.error('departments load error:', depError)
    setDepartments(departments)

    // Academic Types
    const academicTypes = normalize(academicTypesRaw)
    if (acadError) console.error('academic types load error:', acadError)
    setAcademicTypes(academicTypes)

    // Participation Types
    const participationTypes = normalize(participationTypesRaw)
    if (partError) console.error('participation types load error:', partError)
    setParticipationTypes(participationTypes)

    // Faculties
    const faculties = normalize(facultiesRes)
    if (facError) console.error('faculties load error:', facError)
    setFaculties(faculties)

    // Organizations
    const organizations = normalize(organizationsRes)
    if (orgError) console.error('organizations load error:', orgError)
    setOrganizations(organizations)

  }, [departmentsRaw, academicTypesRaw, participationTypesRaw, facultiesRes, organizationsRes])

  const updateEducation = (index, field, value) => {

    setEducations(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  const removeEducation = (index) => {
    // คอมเมนต์ (ไทย): ถ้ามี documentId แสดงว่าเป็นข้อมูลเดิม ให้จำ documentId ไว้เพื่อลบที่ backend ด้วย (Strapi v5)
    setEducations(prev => {
      const target = prev[index]
      if (target?.documentId) {
        setRemovedEducationIds(ids => [...ids, target.documentId])
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  // debug logs removed

  return (
    <>
      <SweetAlert2 {...swalProps} didClose={() => setSwalProps({})} />
      <div className='bg-white rounded-lg shadow-sm'>

        <div className="space-y-8 p-6">
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
          )}
          {loading ? (
            <div className="text-sm text-gray-500">กำลังโหลด...</div>
          ) : (
            <>
              {/* Profile Image Section */}
              <div className="space-y-4 lg:space-y-0 lg:space-x-8">
                <div className="">
                  <ProfileImageUpload />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="ชื่อ"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      placeholder="กรุณาระบุชื่อ"
                    />
                    <FormField
                      label="นามสกุล"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      placeholder="กรุณาระบุนามสกุล"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="First Name (EN)"
                      value={formData.firstNameEn}
                      onChange={(value) => handleInputChange('firstNameEn', value)}
                      placeholder="First name in English"
                    />
                    <FormField
                      label="Last Name (EN)"
                      value={formData.lastNameEn}
                      onChange={(value) => handleInputChange('lastNameEn', value)}
                      placeholder="Last name in English"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="เบอร์ติดต่อ"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder=""
                    />
                    <FormField
                      label="อีเมล"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      placeholder="กรุณาระบุอีเมล"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="ตำแหน่งทางวิชาการ"
                      value={formData.academicPosition}
                      onChange={(value) => handleInputChange('academicPosition', value)}
                      placeholder=""
                    />
                    <FormField
                      label="HighDegree"
                      value={formData.highDegree}
                      onChange={(value) => handleInputChange('highDegree', value)}
                      placeholder="เช่น Ph.D., M.Sc., B.Eng."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="ประเภทอาจารย์"
                      value={formData.academic_type}
                      onChange={(value) => handleInputChange('academic_type', value)}
                      options={[{ value: '', label: 'เลือกประเภทอาจารย์' }, ...academicTypes.map(at => ({ value: at.id, label: at.name }))]}
                    />
                    <SelectField
                      label="ประเภทการเข้าร่วม"
                      value={formData.participation_type}
                      onChange={(value) => handleInputChange('participation_type', value)}
                      options={[{ value: '', label: 'เลือกประเภทการเข้าร่วม' }, ...participationTypes.map(pt => ({ value: pt.id, label: pt.name }))]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SelectField
                      label="ภาควิชา"
                      value={formData.department}
                      onChange={(value) => handleInputChange('department', value)}
                      options={[{ value: '', label: 'เลือกภาควิชา' }, ...departments.map(dep => ({ value: dep.id, label: dep.name }))]}
                    />
                    <SelectField
                      label="คณะ"
                      value={formData.faculty}
                      onChange={(value) => handleInputChange('faculty', value)}
                      options={[{ value: '', label: 'เลือกคณะ' }, ...faculties.map(fac => ({ value: fac.id, label: fac.name }))]}
                    />
                    <SelectField
                      label="มหาวิทยาลัย/หน่วยงาน"
                      value={formData.organization}
                      onChange={(value) => handleInputChange('organization', value)}
                      options={[{ value: '', label: 'เลือกมหาวิทยาลัย/หน่วยงาน' }, ...organizations.map(org => ({ value: org.id, label: org.name }))]}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-start space-x-4">
                <Button variant="primary" onClick={handleSave}>
                  บันทึก
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  ยกเลิก
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm mt-6'>
        <div className="space-y-6 p-6">
          <h2 className='text-lg text-gray-900'>วุฒิการศึกษา</h2>

          <div className="space-y-4">
            {educations.map((edu, idx) => (
              <div key={edu.documentId || edu._tempId || `edu-${idx}`} className="grid grid-cols-12 gap-4 items-end pb-4 border-b last:border-b-0">
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">ระดับวุฒิการศึกษา</label>
                  <select
                    value={edu.education_level}
                    onChange={(e) => updateEducation(idx, 'education_level', e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="">เลือกระดับวุฒิการศึกษา</option>
                    {(eduLevelsRaw?.data || eduLevelsRaw || []).map((lv) => (
                      <option key={lv.documentId} value={lv.documentId}>
                        {lv.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FormField
                    label="ชื่อสถาบันการศึกษา"
                    value={edu.name}
                    onChange={(value) => updateEducation(idx, 'name', value)}
                    placeholder="กรุณาระบุชื่อสถาบันการศึกษา"
                  />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <FormField
                    label="คณะ/สาขา"
                    value={edu.faculty}
                    onChange={(value) => updateEducation(idx, 'faculty', value)}
                    placeholder="กรุณาระบุสาขาวิชา"
                  />
                </div>

                <div className="col-span-9 md:col-span-1">
                  <FormField
                    label="ปีที่สำเร็จ"
                    value={edu.year}
                    onChange={(value) => updateEducation(idx, 'year', value)}
                    placeholder="ปี"
                  />
                </div>

                <div className="col-span-3 md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                    aria-label={`ลบวุฒิการศึกษา ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>เพิ่มวุฒิการศึกษา</span>
            </button>

            <Button
              variant="primary"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError('')
                  const res = profileRes?.data || profileRes || {}
                  const userId = res?.id
                  if (!userId) throw new Error('ไม่พบผู้ใช้ (userId) สำหรับบันทึกวุฒิการศึกษา')

                  // อัปเดต/สร้างทีละรายการ - Strapi v5: แปลง documentId กลับเป็น id สำหรับบันทึก
                  for (const e of educations) {
                    // หา id จริงของ education_level จาก documentId
                    let educationLevelId = e.education_level
                    if (e.education_level) {
                      const eduLevel = (eduLevelsRaw?.data || eduLevelsRaw || []).find(lv => lv.documentId === e.education_level)
                      educationLevelId = eduLevel?.id || e.education_level
                    }

                    const payload = {
                      education_level: educationLevelId || null,
                      name: e.name?.trim() || '',
                      faculty: e.faculty?.trim() || '',
                      year: e.year ? Number(e.year) : null,
                      users_permissions_user: userId,
                    }
                    if (e.documentId) {
                      await eduAPI.update(e.documentId, payload)
                    } else {
                      await eduAPI.create(payload)
                    }
                  }

                  // ลบรายการที่ถูกลบใน UI - ใช้ documentId
                  for (const removedDocumentId of removedEducationIds) {
                    await eduAPI.remove(removedDocumentId)
                  }

                  // Refresh profile data to get updated educations
                  mutate('profile')

                  // Reset removed education IDs
                  setRemovedEducationIds([])

                  setSwalProps({ show: true, icon: 'success', title: 'บันทึกวุฒิการศึกษาสำเร็จ', timer: 1600, showConfirmButton: false })
                } catch (err) {
                  setError(err?.message || 'บันทึกวุฒิการศึกษาไม่สำเร็จ')
                  setSwalProps({ show: true, icon: 'error', title: 'บันทึกวุฒิการศึกษาไม่สำเร็จ', text: err?.message || '', timer: 2200 })
                } finally {
                  setLoading(false)
                }
              }}
            >
              บันทึก
            </Button>
            <Button variant="outline" onClick={() => { /* cancel edit */ }}>
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
