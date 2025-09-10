import AdminUserHeader from '@/components/admin/user/AdminUserHeader'
import AdminEducationSection from '@/components/admin/user/AdminEducationSection'
import AdminUserResearchPublicationsSection from '@/components/admin/user/AdminUserResearchPublicationsSection'
import { SWRConfig } from 'swr'
import { api, serverGet } from '@/lib/api-base'
import { profileAPI } from '@/lib/api/profile'

// Server component: fetch user + works using Strapi v5 documentId (with fallback search)
export default async function AdminUserViewPage({ params }) {
  const userId = params?.id

  let userData = null
  let worksData = null
  let userEduData = null
  let profileData = null
  let fetchError = ''

  // คอมเมนต์ (ไทย): แก้ไข - แปลงพารามิเตอร์ (อาจเป็น documentId) ให้เป็น numeric user id ก่อนใช้งาน
  // แล้วใช้ resolvedUserId ให้ทั่วทั้งเพจเพื่อให้ข้อมูลที่ส่งไปยัง client เหมือนกับหน้า /profile
  let resolvedUserId = userId
  if (userId && !/^[0-9]+$/.test(String(userId))) {
    try {
      const lookup = (typeof serverGet === 'function')
        ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&publicationState=preview&populate=`)
        : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&publicationState=preview&populate=`)
      const arr = lookup?.data || lookup || []
      const found = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
      if (found && (found.id || found.data?.id)) resolvedUserId = found.id || found.data.id
    } catch (e) {
      // ไม่สามารถ resolve -> เก็บค่าเดิมไว้ (อาจเป็น documentId)
      resolvedUserId = userId
    }
  }

  if (resolvedUserId) {
    try {
      // ดึง profile (จาก collection profiles) ด้วย numeric id ที่ resolve แล้ว
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

      // แล้วดึง user entity แบบ populate ทั้งหมด (เหมือน /profile)
      const baseEndpoint = `/users/${resolvedUserId}?populate=*&publicationState=preview`
      if (typeof serverGet === 'function') {
        const u = await serverGet(baseEndpoint)
        userData = u?.data || u || null
      } else {
        const u = await api.get(baseEndpoint)
        userData = u?.data || u || null
      }

      // ถ้ามี profile จาก profiles collection ให้เอามาทับ userData.profile
      if (profileData) {
        userData = userData || {}
        userData.profile = profileData
      }
    } catch (e) {
      // Fallback: ค้นหาผู้ใช้ด้วย documentId filter ถ้า direct lookup ไม่สำเร็จ
      try {
        const r = (typeof serverGet === 'function')
          ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&populate=*&publicationState=preview`)
          : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&populate=*&publicationState=preview`)
        const arr = r?.data || r || []
        userData = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
      } catch (e2) {
        fetchError = e2.message || e.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้'
        userData = null
      }
    }

    // Fetch educations using the resolved numeric id so AdminEducationSection has populated education_level
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
      // ignore education populate failure
    }

    try {
      // Works endpoint used by client components: provide same key as they request
      const w = (typeof serverGet === 'function')
        ? await serverGet(`/works?pageSize=100&userId=${encodeURIComponent(resolvedUserId)}&populate=*`)
        : await api.get(`/works?pageSize=100&userId=${encodeURIComponent(resolvedUserId)}&populate=*`)
      worksData = w?.data || w || null
    } catch (e) {
      worksData = null
    }
  }

  const fallback = {}
  // Provide a few fallback keys so client components that request different keys
  // (plain `/users/:id` or populated variants) will receive the server-side data.
  if (resolvedUserId && userData) {
    // คอมเมนต์ (ไทย): seed ด้วย resolved id (numeric) เพื่อให้ client components ที่เรียก `/users/:id` ได้ข้อมูลเหมือน /profile
    fallback[`/users/${resolvedUserId}`] = userData
    fallback[`/users/${resolvedUserId}?populate=*&publicationState=preview`] = userData
    // Also seed generic 'profile' key
    fallback['profile'] = userData
  }
  // Seed the profile:<id> key used by AdminUserHeader which calls
  // profileAPI.findProfileByUserId(userId) and expects a profile object.
  // Prefer the explicit profileData fetched above; fall back to userData.profile
  // or the userData object if necessary so client-side SWR won't refetch.
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

