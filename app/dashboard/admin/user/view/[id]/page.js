import AdminUserHeader from '@/components/admin/user/AdminUserHeader'
import AdminEducationSection from '@/components/admin/user/AdminEducationSection'
import AdminUserResearchPublicationsSection from '@/components/admin/user/AdminUserResearchPublicationsSection'
import { SWRConfig } from 'swr'
import { api, serverGet } from '@/lib/api-base'
import { profileAPI } from '@/lib/api/profile'

// Server component: fetch user + works using Strapi v5 documentId (with fallback search)
// คอมเมนต์ (ไทย): แก้ไข async function ให้ไม่ access params.id โดยตรงในทันที
export default async function AdminUserViewPage({ params }) {
  let userData = null
  let worksData = null
  let userEduData = null
  let profileData = null
  let fetchError = ''

  // คอมเมนต์ (ไทย): เปลี่ยนมาใช้ params.id โดยตรง และ resolve หา numeric id
  // Next.js dynamic params may be a promise-like object — await it first
  const resolvedParams = await params
  let resolvedUserId = resolvedParams?.id
  if (resolvedParams?.id && !/^[0-9]+$/.test(String(resolvedParams.id))) {
    try {
      const lookup = (typeof serverGet === 'function')
        ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(resolvedParams.id)}&publicationState=preview&populate=`)
        : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(resolvedParams.id)}&publicationState=preview&populate=`)
      const arr = lookup?.data || lookup || []
      const found = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
      if (found && (found.id || found.data?.id)) resolvedUserId = found.id || found.data.id
    } catch (e) {
      resolvedUserId = resolvedParams?.id
    }
  }

  if (resolvedUserId) {
    try {
      try {
        if (typeof serverGet === 'function') {
          const p = await serverGet(`/profiles?filters[user][id][$eq]=${resolvedUserId}&publicationState=preview&populate=*`)
          const parr = p?.data || p || []
          profileData = Array.isArray(parr) ? (parr[0] || null) : (parr || null)
        } else {
          const p = await profileAPI.findProfileByUserId(resolvedUserId)
          profileData = p || null
        }
      } catch (pe) {
        profileData = null
      }

      const baseEndpoint = `/users/${resolvedUserId}?populate=*&publicationState=preview`
      if (typeof serverGet === 'function') {
        const u = await serverGet(baseEndpoint)
        userData = u?.data || u || null
      } else {
        const u = await api.get(baseEndpoint)
        userData = u?.data || u || null
      }

      if (profileData) {
        userData = userData || {}
        userData.profile = profileData
      }
    } catch (e) {
      try {
        const r = (typeof serverGet === 'function')
          ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(resolvedParams?.id)}&populate=*&publicationState=preview`)
          : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(resolvedParams?.id)}&populate=*&publicationState=preview`)
        const arr = r?.data || r || []
        userData = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
      } catch (e2) {
        fetchError = e2.message || e.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้'
        userData = null
      }
    }

    try {
      const eduEndpoint = `/users/${resolvedUserId}?populate[educations][populate]=education_level&publicationState=preview`
      if (typeof serverGet === 'function') {
        const uEdu = await serverGet(eduEndpoint)
        userEduData = uEdu?.data || uEdu || null
      } else {
        const uEdu = await api.get(eduEndpoint)
        userEduData = uEdu?.data || uEdu || null
      }
    } catch (e) {
      // ignore
    }

    try {
      const w = (typeof serverGet === 'function')
        ? await serverGet(`/works?pageSize=100&userId=${encodeURIComponent(resolvedUserId)}&populate=*`)
        : await api.get(`/works?pageSize=100&userId=${encodeURIComponent(resolvedUserId)}&populate=*`)
      worksData = w?.data || w || null
    } catch (e) {
      worksData = null
    }
  }

  const fallback = {}
  if (resolvedUserId && userData) {
    fallback[`/users/${resolvedUserId}`] = userData
    fallback[`/users/${resolvedUserId}?populate=*&publicationState=preview`] = userData
    fallback['profile'] = userData
  }
  if (resolvedUserId) {
    const profFallback = profileData || (userData && userData.profile) || userData || null
    if (profFallback) fallback[`profile:${resolvedUserId}`] = profFallback
    if (worksData) fallback[`/works?pageSize=100&userId=${resolvedUserId}`] = worksData
    if (userEduData) fallback[`/users/${resolvedUserId}?populate[educations][populate]=education_level&publicationState=preview`] = userEduData
  }

  return (
    <SWRConfig value={{ fallback }}>
      <div className="space-y-6">
        {fetchError ? (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{fetchError}</div>
        ) : null}
        <AdminUserHeader userId={resolvedUserId} />
        <AdminEducationSection userId={resolvedUserId} />
        <AdminUserResearchPublicationsSection userId={resolvedUserId} />
      </div>
    </SWRConfig>
  )
}