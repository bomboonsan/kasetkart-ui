"use client"
// ใช้ SWR ดึงข้อมูลโปรไฟล์ของตนเองแทน useEffect ตรง ๆ
import Button from './Button'
import ProfileStats from "@/components/ProfileStats";
import Link from 'next/link';
import { useState } from 'react'
import useSWR from 'swr'
import { profileAPI } from '@/lib/api/profile'
import { API_BASE } from '@/lib/api-base'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

function initials(name, fallback) {
  const s = (name || '').trim()
  if (!s) return (fallback || 'U').slice(0, 2).toUpperCase()
  const parts = s.split(/[\s]+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '') || s[0]).toUpperCase()
}

export default function ProfileHeader() {
  const [error, setError] = useState('')
  const { data: session } = useSession()
  const user = session?.user
  const profObj = user?.profile || {}
  const firstName = profObj.firstNameTH || profObj.firstName || ''
  const lastName = profObj.lastNameTH || profObj.lastName || ''
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()
  const email = user?.email || ''
  const departmentName = profObj?.department || '-'
  let avatarUrl = profObj?.avatarUrl || ''
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    const mediaBase = API_BASE.replace(/\/api\/?$/, '')
    avatarUrl = `${mediaBase}${avatarUrl}`
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
            <p className="text-lg text-gray-600 mb-2">{departmentName}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>{email}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link href="/profile/edit">
              <Button variant="outline">Edit profile</Button>
            </Link>
          </div>
        </div>
      </div>
      <ProfileStats />
    </div>
  );
}
