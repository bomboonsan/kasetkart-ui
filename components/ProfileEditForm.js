'use client'

import { useState, useEffect, useCallback } from 'react'
import ProfileEditTabs from './ProfileEditTabs'
import GeneralInfoTab from './GeneralInfoTab'
import WorkInfoTab from './WorkInfoTab'
import SystemAccessTab from './SystemAccessTab'
import { Button } from '@/components/ui'
// ใช้ path alias (@/) เพื่อลดความซับซ้อนของ relative path และคงความยืดหยุ่น
// ปรับ import หลัง modular API
import { profileAPI } from '@/lib/api/profile'
import { orgAPI, eduAPI } from '@/lib/api/lookup'

// โครงสร้างข้อมูลเริ่มต้นสำหรับฟอร์ม
const initialFormData = {
  // จาก Content-Type: Profile
  profileId: null,
  firstNameTH: '',
  lastNameTH: '',
  firstNameEN: '',
  lastNameEN: '',
  telephoneNo: '',
  biography: '',
  experience: '',
  specialization: '',
  // จาก Content-Type: User
  userId: null,
  email: '',
  // Relations (เก็บเป็น ID)
  department: null,
  faculty: null,
  organization: null,
  academic_type: null,
  participation_type: null,
};

export default function ProfileEditForm() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // State สำหรับข้อมูลในฟอร์มทั้งหมด
  const [formData, setFormData] = useState(initialFormData)
  // State สำหรับข้อมูลตั้งต้นที่ดึงมาจาก API เพื่อใช้เปรียบเทียบ
  const [initialDBData, setInitialDBData] = useState(null)

  // State สำหรับข้อมูล Educations
  const [educations, setEducations] = useState([])
  const [initialEducations, setInitialEducations] = useState([])

  // State สำหรับตัวเลือกใน Dropdown ทั้งหมด
  const [options, setOptions] = useState({
    departments: [],
    faculties: [],
    organizations: [],
    academicTypes: [],
    participationTypes: [],
    educationLevels: [],
  })

  // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมดที่ต้องใช้ในฟอร์ม
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // ดึงข้อมูลพร้อมกันทั้งหมดด้วย Promise.all
      const [
        userResponse,
        departmentsResponse,
        facultiesResponse,
        organizationsResponse,
        academicTypesResponse,
        participationTypesResponse,
        eduLevelsResponse,
      ] = await Promise.all([
        profileAPI.getMyProfile(),
        orgAPI.getDepartments(),
        orgAPI.getFaculties(),
        orgAPI.getOrganizations(),
        orgAPI.getAcademicTypes(),
        orgAPI.getParticipationTypes(),
        orgAPI.getEducationLevels(),
      ])

      // จัดการข้อมูลผู้ใช้และโปรไฟล์
      if (userResponse) {
        const userData = {
          // Profile fields
          profileId: userResponse.profile?.id,
          firstNameTH: userResponse.profile?.firstNameTH || '',
          lastNameTH: userResponse.profile?.lastNameTH || '',
          firstNameEN: userResponse.profile?.firstNameEN || '',
          lastNameEN: userResponse.profile?.lastNameEN || '',
          telephoneNo: userResponse.profile?.telephoneNo || '',
          biography: userResponse.profile?.biography || '',
          experience: userResponse.profile?.experience || '',
          specialization: userResponse.profile?.specialization || '',
          // User fields
          userId: userResponse.id,
          email: userResponse.email || '',
          // Relational fields (เก็บเฉพาะ id)
          department: userResponse.department?.id || null,
          faculty: userResponse.faculty?.id || null,
          organization: userResponse.organization?.id || null,
          academic_type: userResponse.academic_type?.id || null,
          participation_type: userResponse.participation_type?.id || null,
        }
        setFormData(userData)
        setInitialDBData(userData) // บันทึกข้อมูลตั้งต้น

        const userEducations = userResponse.educations || []
        setEducations(userEducations)
        setInitialEducations(JSON.parse(JSON.stringify(userEducations))) // Deep copy
      }

      // ฟังก์ชันสำหรับแปลงข้อมูล API เป็น options object
      const mapToOptions = (res) => 
        res.data.map((item) => ({ value: item.id, label: item.attributes.name }))

      // จัดการข้อมูลสำหรับ Dropdowns
      setOptions({
        departments: departmentsResponse ? mapToOptions(departmentsResponse) : [],
        faculties: facultiesResponse ? mapToOptions(facultiesResponse) : [],
        organizations: organizationsResponse ? mapToOptions(organizationsResponse) : [],
        academicTypes: academicTypesResponse ? mapToOptions(academicTypesResponse) : [],
        participationTypes: participationTypesResponse ? mapToOptions(participationTypesResponse) : [],
        educationLevels: eduLevelsResponse ? mapToOptions(eduLevelsResponse) : [],
      })

    } catch (err) {
      // Use state-based error handling instead of logging to console
      setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handler สำหรับอัปเดตข้อมูลในฟอร์ม
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handler สำหรับอัปเดตข้อมูล Educations
  const handleEducationsChange = (updatedEducations) => {
    setEducations(updatedEducations)
  }

  // ฟังก์ชันสำหรับยกเลิกการแก้ไข
  const handleCancel = () => {
    setFormData(initialDBData) // คืนค่าฟอร์มเป็นข้อมูลตั้งต้น
    setEducations(initialEducations) // คืนค่า educations เป็นข้อมูลตั้งต้น
  }

  // ฟังก์ชันสำหรับบันทึกข้อมูลทั้งหมด
  const handleSave = async () => {
    if (!formData.userId || !formData.profileId) {
      setError("ข้อมูลผู้ใช้ไม่สมบูรณ์ ไม่สามารถบันทึกได้")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const updatePromises = []

      // 1. อัปเดต Content-Type: Profile
      const profileData = {
        firstNameTH: formData.firstNameTH,
        lastNameTH: formData.lastNameTH,
        firstNameEN: formData.firstNameEN,
        lastNameEN: formData.lastNameEN,
        telephoneNo: formData.telephoneNo,
        biography: formData.biography,
        experience: formData.experience,
        specialization: formData.specialization,
      }
      updatePromises.push(profileAPI.updateProfileData(formData.profileId, profileData))

      // 2. อัปเดต Content-Type: User (พร้อม Relations)
      const userData = {
        email: formData.email,
        department: formData.department,
        faculty: formData.faculty,
        organization: formData.organization,
        academic_type: formData.academic_type,
        participation_type: formData.participation_type,
      }
      updatePromises.push(profileAPI.updateProfile(formData.userId, userData))

      // 3. จัดการข้อมูล Educations (Create, Update, Delete)
      const initialEduIds = initialEducations.map(edu => edu.id)
      const currentEduIds = educations.map(edu => edu.id).filter(id => id)

      const toDelete = initialEducations.filter(edu => !currentEduIds.includes(edu.id))
      const toUpdate = educations.filter(edu => edu.id && initialEduIds.includes(edu.id))
      const toCreate = educations.filter(edu => !edu.id)

      toDelete.forEach(edu => updatePromises.push(eduAPI.remove(edu.id)))
      toUpdate.forEach(edu => {
        const { id, ...data } = edu
        data.education_level = data.education_level?.id || data.education_level
        updatePromises.push(eduAPI.update(id, data))
      })
      toCreate.forEach(edu => {
        const { id, ...data } = edu
        data.users_permissions_user = formData.userId
        data.education_level = data.education_level?.id || data.education_level
        updatePromises.push(eduAPI.create(data))
      })

      // รอให้ทุกอย่างเสร็จสิ้น
      await Promise.all(updatePromises)

      // ดึงข้อมูลใหม่ทั้งหมดเพื่ออัปเดต UI ให้ตรงกัน
      await fetchData()

      alert("บันทึกข้อมูลสำเร็จ!")

    } catch (err) {
      // Use state-based error handling instead of logging to console
      setError(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${err.message}`)
      alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const renderTabContent = () => {
    const commonProps = {
      formData,
      options,
      onFormChange: handleFormChange,
    }
    switch (activeTab) {
      case 'general':
        return <GeneralInfoTab {...commonProps} />
      case 'work':
        return (
          <WorkInfoTab
            {...commonProps}
            educations={educations}
            onEducationsChange={handleEducationsChange}
          />
        )
      case 'security':
        return <SystemAccessTab />
      default:
        return <GeneralInfoTab {...commonProps} />
    }
  }

  if (isLoading) {
    return <div className="text-center p-8">กำลังโหลดข้อมูลโปรไฟล์...</div>
  }

  if (error && !initialDBData) {
    return <div className="text-red-500 text-center p-8">{error}</div>
  }

  return (
    <>
      <ProfileEditTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {renderTabContent()}
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50 rounded-b-lg">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลทั้งหมด'}
          </Button>
        </div>
      </div>
    </>
  )
}