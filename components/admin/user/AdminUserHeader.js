"use client"

// ใช้ SWR ดึงข้อมูลผู้ใช้ตาม id
import Button from '@/components/Button'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

function initialsFrom(name, fallback) {
  const s = (name || '').trim()
  if (!s) return (fallback || 'U').slice(0, 2).toUpperCase()
  const parts = s.split(/[\s]+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '') || s[0]).toUpperCase()
}

export default function AdminUserHeader({ userId }) {
  const [error, setError] = useState('')
  // bind api.get so `this.request` is available inside ApiClient
  const { data: user, error: swrError } = useSWR(userId ? `/users/${userId}` : null, (key) => api.get(key), { revalidateOnMount: false, revalidateOnFocus: false })
  if (swrError && !error) setError(swrError.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ')

  // Normalize response shapes: some endpoints return { data: { ... } } while others return raw object
  const res = user?.data || user || {}
  const prof = res.profile || res.Profile?.[0] || res
  const firstName = prof?.firstName || prof?.firstNameTH || prof?.firstname || prof?.name || ''
  const lastName = prof?.lastName || prof?.lastNameTH || prof?.lastname || ''
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()
  const email = res?.email || prof?.email || ''
  const orgLine = [res?.Faculty?.name || res?.faculty?.name, res?.Department?.name || res?.department?.name].filter(Boolean).join(' • ')
  const jobType = prof?.jobType || ''
  const highDegree = prof?.highDegree || ''

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200 mb-4">{error}</div>
        )}
        <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex-shrink-0">
            {prof?.avatarUrl ? (
              <img src={prof.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center">
                {initialsFrom(displayName, email)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {displayName || email}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{orgLine || '-'}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>{email}</p>
              {jobType ? <p>Job Type: {jobType}</p> : null}
              {highDegree ? <p>Highest Degree: {highDegree}</p> : null}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href={`/dashboard/admin/user/edit/${userId}`}>
              <Button variant="outline">Edit user</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
