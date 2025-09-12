"use client"

import { Button } from '@/components/ui'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { API_BASE } from '@/lib/api-base'
import { profileAPI } from '@/lib/api'
import AdminUserStats from '@/components/admin/user/AdminUserStats'

function initials(name, fallback) {
  const s = (name || '').trim()
  if (!s) return (fallback || 'U').slice(0, 2).toUpperCase()

  // return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '') || s[0]).toUpperCase()
}

export default function AdminUserHeader({ userId }) {
  const [error, setError] = useState('')

  // Use SWR to fetch profile by user id. Server page seeds `profile` fallback (or profile:<id>) so this will be instant.
  const { data: profileRes, error: swrError } = useSWR(
    userId ? `profile:${userId}` : null,
    () => profileAPI.findProfileByUserId(userId),
    { revalidateOnMount: false, revalidateOnFocus: false }
  )

  console.log('AdminUserHeader userId', userId, profileRes, swrError)

  if (swrError && !error) setError(swrError.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')

  const res = profileRes?.data || profileRes || {}
  console.log('AdminUserHeader profile res', res)
  const profObj = res.profile || res.Profile?.[0] || res
  

  const firstName = profObj?.firstName || profObj?.firstNameTH || profObj?.firstname || profObj?.name || ''
  const lastName = profObj?.lastName || profObj?.lastNameTH || profObj?.lastname || ''
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()
  const email = res?.email || profObj?.email || ''
  const departmentName = profObj?.department?.name || res?.Department?.name || res?.department?.name || '-'
  const facultyName = res?.Faculty?.name || res?.faculty?.name || ''
  const jobType = profObj?.jobType || ''
  const highDegree = profObj?.highDegree || ''

  // Resolve avatar URL from several common Strapi response shapes
  let avatarUrl = ''
  try {
    const candidates = []
    if (profObj?.avatarUrl?.url) candidates.push(profObj.avatarUrl.url)
    if (profObj?.avatarUrl) candidates.push(profObj.avatarUrl)
    if (profObj?.avatar?.data?.attributes?.url) candidates.push(profObj.avatar.data.attributes.url)
    if (profObj?.profileImage?.data?.attributes?.url) candidates.push(profObj.profileImage.data.attributes.url)
    for (const c of candidates) {
      if (c) { avatarUrl = c; break }
    }

    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      const mediaBase = (API_BASE || 'http://localhost:1337/api').replace(/\/api\/?$/, '')
      avatarUrl = `${mediaBase}${avatarUrl}`
    }
  } catch (e) {
    // ignore
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200 mb-4">{error}</div>
        )}
        <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image src={avatarUrl} alt={displayName || 'avatar'} width={96} height={96} className="object-cover w-24 h-24 rounded-full" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-primary text-white text-2xl font-bold flex items-center justify-center rounded-full">
                  {initials(displayName, email)}
                </div>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {displayName || email}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{[facultyName, departmentName].filter(Boolean).join(' • ')}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>{email}</p>
              {jobType ? <p>Job Type: {jobType}</p> : null}
              {highDegree ? <p>Highest Degree: {highDegree}</p> : null}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link href={`/dashboard/admin/user/edit/${userId}`} passHref>
              <Button variant="outline">Edit user</Button>
            </Link>
          </div>
        </div>
      </div>
      <AdminUserStats userId={userId} />
    </div>
  )
}
