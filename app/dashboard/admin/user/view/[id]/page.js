import AdminUserHeader from '@/components/admin/user/AdminUserHeader'
import AdminEducationSection from '@/components/admin/user/AdminEducationSection'
import AdminUserWorksSection from '@/components/admin/user/AdminUserWorksSection'
import { SWRConfig } from 'swr'
import { api, serverGet } from '@/lib/api'

// Server component: fetch user + works using Strapi v5 documentId (with fallback search)
export default async function AdminUserViewPage({ params }) {
  const userId = params?.id

  let userData = null
  let worksData = null
  let fetchError = ''

  if (userId) {
    try {
      // Prefer server-side authenticated fetch when available
      if (typeof serverGet === 'function') {
        const u = await serverGet(`/users/${userId}?populate=*&publicationState=preview`)
        userData = u?.data || u || null
      } else {
        const u = await api.get(`/users/${userId}?populate=*&publicationState=preview`)
        userData = u?.data || u || null
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
  if (userId && userData) fallback[`/users/${userId}`] = userData
  if (userId && worksData) fallback[`/works?pageSize=100&userId=${userId}`] = worksData

  return (
    <SWRConfig value={{ fallback }}>
      <div className="space-y-6">
        {fetchError ? (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{fetchError}</div>
        ) : null}
        <AdminUserHeader userId={userId} />
        <AdminEducationSection userId={userId} />
        <AdminUserWorksSection userId={userId} />
      </div>
    </SWRConfig>
  )
}

