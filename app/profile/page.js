'use client'

import { useState } from 'react'
import useSWR from 'swr'
import ProfileHeader from '@/components/profile/ProfileHeader'
import EducationSection from '@/components/profile/EducationSection'
import ResearchPublicationsSection from '@/components/profile/ResearchPublicationsSection'
import { profileAPI } from '@/lib/api'

export default function Profile() {
  const [error, setError] = useState('')

  // ดึงข้อมูล Profile รวมทั้ง educations ในครั้งเดียว
  const { data: profileRes, error: swrError } = useSWR('profile', () => profileAPI.getMyProfile())
  if (swrError && !error) setError(swrError.message || 'โหลดโปรไฟล์ไม่สำเร็จ')

  const res = profileRes?.data || profileRes || {}
  const educations = res?.educations || []

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>
      )}
  <ProfileHeader profileData={profileRes} />
  <EducationSection educations={educations} />
  <ResearchPublicationsSection profileData={profileRes} />
    </div>
  );
}
