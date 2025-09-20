import { profileAPI } from './profile'

async function resolveCurrentUser() {
  const result = await profileAPI.getMyProfile()
  return result?.data || result || null
}

export async function getCurrentUserId() {
  const user = await resolveCurrentUser()
  const userId = user?.id
  if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
  return userId
}

export function filterProjectsByUserId(projects, userId) {
  const list = projects?.data || projects || []
  return Array.isArray(list)
    ? list.filter((project) => {
        const partners = project.research_partners || []
        return partners.some((partner) => partner?.users_permissions_user?.id === userId)
      })
    : []
}

export function filterItemsByUserId(items, userId) {
  const list = items?.data || items || []
  return Array.isArray(list)
    ? list.filter((item) => {
        const owners = item.users_permissions_user || item.authors || item.presenters || item.user || []
        if (Array.isArray(owners)) {
          return owners.some((owner) => owner?.id === userId)
        }
        return owners?.id === userId
      })
    : []
}

export function filterConferencesByProjectParticipation(conferences, userId) {
  const list = conferences?.data || conferences || []
  return Array.isArray(list)
    ? list.filter((conference) => {
        const partners = conference.project_research?.research_partners || []
        return partners.some((partner) => partner?.users_permissions_user?.id === userId)
      })
    : []
}

export function buildSearchParams(params = {}) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }
  return searchParams
}

export function buildUserFilterParams(userId, additionalFilters = {}) {
  return {
    ...additionalFilters,
    users_permissions_user: { id: { eq: userId } },
  }
}
