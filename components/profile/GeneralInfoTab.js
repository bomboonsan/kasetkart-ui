"use client"

import { useEffect, useState } from 'react'
import ProfileImageUpload from './ProfileImageUpload'
import FormField from '@/components/FormField'
import SelectField from '@/components/SelectField'
import Button from '@/components/Button'
import { Trash2 } from "lucide-react"
import { api } from '@/lib/api'

export default function GeneralInfoTab() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    highDegree: '',
    jobType: '',
    email: '',
    phone: '',
    nameEn: '',
    academicPosition: '',
    department: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    ;(async () => {
      try {
        const me = await api.get('/profiles/me')
        const prof = me?.Profile?.[0] || me?.profile || {}
        setFormData(prev => ({
          ...prev,
          firstName: prof.firstName || '',
          lastName: prof.lastName || '',
          firstNameEn: prof.firstNameEn || '',
          lastNameEn: prof.lastNameEn || '',
          highDegree: prof.highDegree || '',
          jobType: prof.jobType || '',
          phone: prof.phone || '',
          academicPosition: prof.academicRank || '',
          email: me.email || '',
          department: me.Department?.name || me.department?.name || ''
        }))
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSave = async () => {
    try {
      setError('')
      await api.patch('/profiles/me', {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        firstNameEn: formData.firstNameEn || undefined,
        lastNameEn: formData.lastNameEn || undefined,
        highDegree: formData.highDegree || undefined,
        jobType: formData.jobType || undefined,
        phone: formData.phone || undefined,
        academicRank: formData.academicPosition || undefined,
      })
      alert('บันทึกโปรไฟล์สำเร็จ')
    } catch (err) {
      setError(err.message || 'บันทึกโปรไฟล์ไม่สำเร็จ')
    }
  }

  const handleCancel = () => {
    // TODO: Implement cancel logic or navigate back
    console.log('Cancel edit')
  }

  const [educations, setEducations] = useState([
    { degree: '', institution: 'มหาวิทยาลัยเกษตรศาสตร์', major: 'Accounting & Finance', year: '2010' },
    { degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเกษตรศาสตร์', major: 'Accounting & Finance', year: '2010' },
    { degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเกษตรศาสตร์', major: 'Accounting & Finance', year: '2024' }
  ])

  const addEducation = () => {
    setEducations(prev => [...prev, { degree: '', institution: '', major: '', year: '' }])
  }

  const updateEducation = (index, field, value) => {
    setEducations(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e))
  }

  const removeEducation = (index) => {
    setEducations(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <>
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
                  label="ตำแหน่งทางวิชาการ"
                  value={formData.academicPosition}
                  onChange={(value) => handleInputChange('academicPosition', value)}
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
                  label="เบอร์ติดต่อ"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder=""
                />
                <FormField
                  label="ภาควิชา"
                  value={formData.department}
                  onChange={(value) => handleInputChange('department', value)}
                  placeholder="กรุณาระบุภาควิชา"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="วุฒิการศึกษาสูงสุด (High Degree)"
                  value={formData.highDegree}
                  onChange={(value) => handleInputChange('highDegree', value)}
                  placeholder="เช่น Ph.D., M.Sc., B.Eng."
                />
                <FormField
                  label="ประเภทอาจารย์ (Job Type)"
                  value={formData.jobType}
                  onChange={(value) => handleInputChange('jobType', value)}
                  placeholder="เช่น SA, PA, SP, IP, A"
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
              <div key={idx} className="grid grid-cols-12 gap-4 items-end pb-4 border-b last:border-b-0">
                <div className="col-span-12 md:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">ระดับวุฒิการศึกษา</label>
                  <select
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
                  >
                    <option value="">เลือกระดับวุฒิการศึกษา</option>
                    <option value="ปริญญาตรี">ปริญญาตรี</option>
                    <option value="ปริญญาโท">ปริญญาโท</option>
                    <option value="ปริญญาเอก">ปริญญาเอก</option>
                  </select>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <FormField
                    label="ชื่อสถาบันการศึกษา"
                    value={edu.institution}
                    onChange={(value) => updateEducation(idx, 'institution', value)}
                    placeholder="กรุณาระบุชื่อสถาบันการศึกษา"
                  />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <FormField
                    label="สาขาวิชา"
                    value={edu.major}
                    onChange={(value) => updateEducation(idx, 'major', value)}
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

            <Button variant="primary" onClick={() => { console.log('Save educations', educations) }}>
              บันทึก
            </Button>
            <Button variant="outline" onClick={() => { console.log('Cancel educations edit') }}>
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
