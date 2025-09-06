'use client'

import { useState, useEffect } from 'react'
import TextAreaField from './TextAreaField'
import Button from './Button'
import EducationSection from './EducationSection' // Using the dedicated component
import { profileAPI, eduAPI, orgAPI } from '../lib/api'

export default function WorkInfoTab() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    biography: '',
    experience: '',
    specialization: '',
  })
  const [educations, setEducations] = useState([])
  const [educationLevels, setEducationLevels] = useState([])
  const [initialEducations, setInitialEducations] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [userResponse, eduLevelsResponse] = await Promise.all([
          profileAPI.getMyProfile(),
          orgAPI.getEducationLevels(),
        ])

        if (userResponse) {
          setUser(userResponse)
          setFormData({
            biography: userResponse.profile?.biography || '',
            experience: userResponse.profile?.experience || '',
            specialization: userResponse.profile?.specialization || '',
          })
          const userEducations = userResponse.educations || []
          setEducations(userEducations)
          setInitialEducations(JSON.parse(JSON.stringify(userEducations))) // Deep copy for comparison
        }

        if (eduLevelsResponse && Array.isArray(eduLevelsResponse.data)) {
          const levelOptions = eduLevelsResponse.data.map(level => ({
            value: level.id,
            label: level.attributes.name,
          }))
          setEducationLevels(levelOptions)
        }

        setError(null)
      } catch (err) {
        console.error("Failed to fetch work info data:", err)
        setError("ไม่สามารถดึงข้อมูลได้")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEducationsChange = (updatedEducations) => {
    setEducations(updatedEducations)
  }

  const handleSave = async () => {
    if (!user || !user.profile) {
      console.error("User or profile data is missing.")
      setError("ข้อมูลผู้ใช้ไม่สมบูรณ์")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Update the text fields in the profile
      await profileAPI.updateProfileData(user.profile.id, {
        biography: formData.biography,
        experience: formData.experience,
        specialization: formData.specialization,
      })

      // 2. Sync educations (Create, Update, Delete)
      const initialIds = initialEducations.map(edu => edu.id)
      const currentIds = educations.map(edu => edu.id).filter(id => id) // Filter out new items without an id

      // Items to delete
      const toDelete = initialEducations.filter(edu => !currentIds.includes(edu.id))
      // Items to update
      const toUpdate = educations.filter(edu => edu.id && initialIds.includes(edu.id))
      // Items to create
      const toCreate = educations.filter(edu => !edu.id)

      const promises = []

      toDelete.forEach(edu => promises.push(eduAPI.remove(edu.id)))
      toUpdate.forEach(edu => {
        const { id, ...data } = edu
        // Ensure relation data is in the correct format
        data.education_level = data.education_level?.id || data.education_level
        promises.push(eduAPI.update(id, data))
      })
      toCreate.forEach(edu => {
        const { id, ...data } = edu
        data.users_permissions_user = user.id
        data.education_level = data.education_level?.id || data.education_level
        promises.push(eduAPI.create(data))
      })

      await Promise.all(promises)

      // Refetch data to get the latest state
      const userResponse = await profileAPI.getMyProfile()
      if (userResponse) {
        const userEducations = userResponse.educations || []
        setEducations(userEducations)
        setInitialEducations(JSON.parse(JSON.stringify(userEducations)))
      }

      alert("บันทึกข้อมูลสำเร็จ!")
    } catch (err) {
      console.error("Failed to save work info:", err)
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
      alert("เกิดข้อผิดพลาด: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return <div>กำลังโหลดข้อมูล...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประวัติย่อ (Biography)</h3>
        <TextAreaField
          value={formData.biography}
          onChange={(value) => handleInputChange('biography', value)}
          placeholder="กรุณาระบุประวัติย่อของคุณ..."
          rows={4}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประสบการณ์ (Experience)</h3>
        <TextAreaField
          value={formData.experience}
          onChange={(value) => handleInputChange('experience', value)}
          placeholder="กรุณาระบุประสบการณ์การทำงานของคุณ..."
          rows={4}
        />
      </div>

       <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ความเชี่ยวชาญ (Specialization)</h3>
        <TextAreaField
          value={formData.specialization}
          onChange={(value) => handleInputChange('specialization', value)}
          placeholder="กรุณาระบุความเชี่ยวชาญของคุณ..."
          rows={4}
        />
      </div>

      <EducationSection 
        educations={educations}
        educationLevels={educationLevels}
        onChange={handleEducationsChange}
        userId={user?.id}
      />

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" disabled={isLoading}>
          ยกเลิก
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
        </Button>
      </div>
    </div>
  )
}