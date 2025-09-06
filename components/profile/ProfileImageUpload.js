'use client'

import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Button from '@/components/Button'
import { uploadAPI, API_BASE, profileAPI } from '@/lib/api'

export default function ProfileImageUpload() {
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Fetch current user profile to get avatar
  const { data: profileRes, error: profileError } = useSWR('profile', () => profileAPI.getMyProfile())

  useEffect(() => {
    if (profileRes) {
      const res = profileRes?.data || profileRes || {}
      const profObj = res.profile || res.Profile?.[0] || res

      // Try to find avatar URL from various possible fields
      let avatarUrl = ''
      const tryPaths = [
        profObj?.avatarUrl?.data?.attributes?.url,
        profObj?.avatarUrl?.url,
        profObj?.profileImage?.data?.attributes?.url,
        profObj?.profile_image?.data?.attributes?.url,
        profObj?.picture?.data?.attributes?.url,
        profObj?.image?.data?.attributes?.url,
        profObj?.avatarUrl,
        profObj?.avatar_url,
      ]

      for (const p of tryPaths) {
        if (p) {
          avatarUrl = p
          break
        }
      }

      // If URL is relative, make it absolute
      if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
        const mediaBase = API_BASE.replace(/\/api\/?$/, '')
        avatarUrl = `${mediaBase}${avatarUrl}`
      }

      setImagePreview(avatarUrl || null)
    }
  }, [profileRes])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setError('')
      setUploading(true)

      // Upload file to Strapi
      const uploadResponse = await uploadAPI.uploadFiles([file])
      const uploadedFile = uploadResponse[0]

      if (!uploadedFile?.id) {
        throw new Error('อัปโหลดไฟล์ไม่สำเร็จ')
      }

      // Get current user & profile IDs from profile response
      const res = profileRes?.data || profileRes || {}
      const userId = res?.id

      if (!userId) {
        throw new Error('ไม่พบข้อมูลผู้ใช้')
      }

      // Try to find existing profile using correct schema - ใช้ documentId ใน Strapi v5
      let profileDocumentId = res?.profile?.documentId || res?.profile?.data?.documentId || res?.Profile?.[0]?.documentId || res?.Profile?.[0]?.data?.documentId

      // If no profile exists, try to find it by user ID
      if (!profileDocumentId) {
        const existingProfile = await profileAPI.findProfileByUserId(userId)
        profileDocumentId = existingProfile?.documentId
      }

      // Update or create profile with the uploaded file ID (ต้องส่งเป็น media ID)
      const profileData = { avatarUrl: uploadedFile.id }

      if (profileDocumentId) {
        // Update existing profile using collection endpoint with documentId
        await profileAPI.updateProfileData(profileDocumentId, profileData)
      } else {
        // Create new profile linked to user using collection endpoint
        await profileAPI.createProfile({ ...profileData, user: userId })
      }

      // Create full URL for preview
      let fullUrl = uploadedFile.url
      if (fullUrl && !/^https?:\/\//i.test(fullUrl)) {
        const mediaBase = API_BASE.replace(/\/api\/?$/, '')
        fullUrl = `${mediaBase}${fullUrl}`
      }

      setImagePreview(fullUrl)

      // Refresh profile data in all components
      mutate('profile')

    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'อัปโหลดรูปภาพไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  const generateInitials = () => {
    if (profileRes) {
      const res = profileRes?.data || profileRes || {}
      const profObj = res.profile || res.Profile?.[0] || res
      const firstName = profObj?.firstName || profObj?.firstNameTH || ''
      const lastName = profObj?.lastName || profObj?.lastNameTH || ''
      const email = res?.email || ''
      const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()

      if (displayName) {
        const parts = displayName.split(/[\s+]+/)
        return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '') || displayName[0]).toUpperCase()
      }
      return email ? email[0].toUpperCase() : 'U'
    }
    return 'U'
  }

  return (
    <div className="flex flex-row gap-5 items-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={() => setImagePreview(null)}
            />
          ) : (
            <div className="w-full h-full bg-blue-500 text-white text-2xl font-bold flex items-center justify-center rounded-full">
              {generateInitials()}
            </div>
          )}
        </div>

        {/* Camera icon overlay */}
        <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </div>
      </div>

      <div className="text-center space-x-2 space-y-3">
        <Button
          variant="primary"
          size="sm"
          onClick={() => document.querySelector('input[type="file"]').click()}
          disabled={uploading}
        >
          {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
        </Button>
        <p className="text-xs text-gray-500">JPG, PNG ขนาดไม่เกิน 10MB</p>
        {error && <div className="text-xs text-red-600">{error}</div>}
        {profileError && <div className="text-xs text-red-600">โหลดโปรไฟล์ไม่สำเร็จ</div>}
      </div>
    </div>
  )
}
