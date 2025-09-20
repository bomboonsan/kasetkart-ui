// Shared API utilities for common operations
import { api } from '../api-base'

/**
 * Get current user ID from API
 * @returns {Promise<string|number>} User ID
 * @throws {Error} If user cannot be retrieved
 */
export async function getCurrentUserId() {
  const userRes = await api.get('/users/me')
  const userId = userRes.data?.id || userRes.id
  if (!userId) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้')
  return userId
}

/**
 * Filter projects by user participation in research_partners
 * @param {Object} projects - Projects response from API
 * @param {string|number} userId - User ID to filter by
 * @returns {Array} Filtered projects
 */
export function filterProjectsByUserId(projects, userId) {
  const list = projects?.data || projects || []
  return Array.isArray(list) 
    ? list.filter(project => 
        (project.research_partners || []).some(partner => 
          partner.users_permissions_user?.id === userId))
    : []
}

/**
 * Filter items by user ownership (for funding, works, etc.)
 * @param {Object} items - Items response from API
 * @param {string|number} userId - User ID to filter by
 * @returns {Array} Filtered items
 */
export function filterItemsByUserId(items, userId) {
  const list = items?.data || items || []
  return Array.isArray(list) 
    ? list.filter(item => {
        const owners = item.users_permissions_user || item.authors || item.presenters || item.user || []
        return Array.isArray(owners) 
          ? owners.some(o => o?.id === userId) 
          : owners?.id === userId
      })
    : []
}

/**
 * Filter conferences by project research participation
 * @param {Object} conferences - Conferences response from API
 * @param {string|number} userId - User ID to filter by
 * @returns {Array} Filtered conferences
 */
export function filterConferencesByProjectParticipation(conferences, userId) {
  const list = conferences?.data || conferences || []
  return Array.isArray(list)
    ? list.filter(conference => 
        (conference.project_research?.research_partners || []).some(partner => 
          partner.users_permissions_user?.id === userId))
    : []
}

/**
 * Build URL search params from object
 * @param {Object} params - Parameters object
 * @returns {URLSearchParams} Search params instance
 */
export function buildSearchParams(params = {}) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }
  return searchParams
}

/**
 * Build URL search params with user filter
 * @param {string|number} userId - User ID
 * @param {Object} additionalParams - Additional parameters
 * @returns {URLSearchParams} Search params with user filter
 */
export function buildUserFilterParams(userId, additionalParams = {}) {
  const searchParams = buildSearchParams(additionalParams)
  searchParams.set('filters[users_permissions_user][id][$eq]', userId)
  return searchParams
}