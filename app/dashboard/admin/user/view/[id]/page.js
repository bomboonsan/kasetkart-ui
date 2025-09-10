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

  if (userId) {
      try {
        // Determine numeric user id for profile lookup. If route param is a documentId,
        // resolve to the real numeric id first by querying users?filters[documentId]...
        let targetUserId = userId
        if (!/^[0-9]+$/.test(String(userId))) {
          try {
            const lookup = (typeof serverGet === 'function')
              ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&publicationState=preview&populate=`)
              : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&publicationState=preview&populate=`)
            const arr = lookup?.data || lookup || []
            const found = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
            if (found && (found.id || found.data?.id)) {
              targetUserId = found.id || found.data.id
            }
          } catch (_) {
            // couldn't resolve documentId -> id, keep original userId
          }
        }

        // Now look up profile using the real numeric user id
        try {
          if (typeof serverGet === 'function') {
            const p = await serverGet(`/profiles?filters[user][id][$eq]=${targetUserId}&publicationState=preview&populate=*`)
            const parr = p?.data || p || []
            profileData = Array.isArray(parr) ? (parr[0] || null) : (parr || null)
          } else {
            // reuse helper when on client fallback (unlikely on server)
            const p = await profileAPI.findProfileByUserId(targetUserId)
            profileData = p || null
          }
        } catch (pe) {
          profileData = null
        }

        // Then fetch the user object (populated) and merge profile into it so client components
        // that expect /users/:id or 'profile' shapes receive a unified object.
        const baseEndpoint = `/users/${targetUserId}?populate=*&publicationState=preview`
        if (typeof serverGet === 'function') {
          const u = await serverGet(baseEndpoint)
          userData = u?.data || u || null
        } else {
          const u = await api.get(baseEndpoint)
          userData = u?.data || u || null
        }

        // Merge profileData into userData.profile (profile from profiles collection wins)
        if (profileData) {
          // If userData is null, start with an object that looks like the user's shape
          userData = userData || {}
          userData.profile = profileData
        }
      } catch (e) {
      // Fallback: try to find user by documentId filter (in case the direct route isn't enabled)
      try {
        const r = (typeof serverGet === 'function')
          ? await serverGet(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&populate=*&publicationState=preview`)
          : await api.get(`/users?filters[documentId][$eq]=${encodeURIComponent(userId)}&populate=*&publicationState=preview`)
        // response shape may include data array
        const arr = r?.data || r || []
        userData = Array.isArray(arr) ? (arr[0] || null) : (arr || null)
      } catch (e2) {
        fetchError = e2.message || e.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้'
        userData = null
      }
    }

    // Separate fetch for educations with nested education_level to seed SWR cache for AdminEducationSection
    if (userId) {
    try {
      const eduEndpoint = `/users/${userId}?populate[educations][populate]=education_level&publicationState=preview`
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
    }

    try {
      // Works endpoint used by client components: provide same key as they request
      const w = (typeof serverGet === 'function')
        ? await serverGet(`/works?pageSize=100&userId=${encodeURIComponent(userId)}&populate=*`)
        : await api.get(`/works?pageSize=100&userId=${encodeURIComponent(userId)}&populate=*`)
      worksData = w?.data || w || null
    } catch (e) {
      // If /works is not available, leave null and client will fetch as usual
      worksData = null
    }
  }

  const fallback = {}
  // Provide a few fallback keys so client components that request different keys
  // (plain `/users/:id` or populated variants) will receive the server-side data.
  if (userId && userData) {
    fallback[`/users/${userId}`] = userData
    fallback[`/users/${userId}?populate=*&publicationState=preview`] = userData
  // Also seed the generic 'profile' SWR key so components that rely on 'profile'
  // (the public profile page) will render identically when this admin page is shown.
  fallback['profile'] = userData
  }
  // Seed the profile:<id> key used by AdminUserHeader which calls
  // profileAPI.findProfileByUserId(userId) and expects a profile object.
  // Prefer the explicit profileData fetched above; fall back to userData.profile
  // or the userData object if necessary so client-side SWR won't refetch.
  if (userId) {
    const profFallback = profileData || (userData && userData.profile) || userData || null
    if (profFallback) fallback[`profile:${userId}`] = profFallback
  }
  if (userId && worksData) fallback[`/works?pageSize=100&userId=${userId}`] = worksData
  if (userId && userEduData) fallback[`/users/${userId}?populate[educations][populate]=education_level&publicationState=preview`] = userEduData

  return (
    <SWRConfig value={{ fallback }}>
      <div className="space-y-6">
        {fetchError ? (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{fetchError}</div>
        ) : null}
        <AdminUserHeader userId={userId} />
  <AdminEducationSection userId={userId} />
  <AdminUserResearchPublicationsSection userId={userId} />
      </div>
    </SWRConfig>
  )
}

