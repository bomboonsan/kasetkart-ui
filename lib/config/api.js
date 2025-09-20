const rawUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'

// Normalize base URL without trailing slash and without legacy /api suffix
const normalized = (() => {
  if (!rawUrl) return 'http://localhost:1337'
  const trimmed = rawUrl.replace(/\/$/, '')
  return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed
})()

export const STRAPI_BASE_URL = normalized
export const STRAPI_REST_ENDPOINT = `${normalized}/api`
export const STRAPI_GRAPHQL_ENDPOINT = `${normalized}/graphql`
export const STRAPI_MEDIA_ENDPOINT = normalized
