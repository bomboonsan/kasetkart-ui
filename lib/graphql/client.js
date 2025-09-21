import { STRAPI_GRAPHQL_ENDPOINT } from '@/lib/config/api'
import { tokenManager } from '@/lib/auth/token-manager'

async function resolveAuthToken(explicitToken) {
  if (explicitToken) return explicitToken

  if (typeof window === 'undefined') {
    return process.env.NEXT_ADMIN_JWT || process.env.STRAPI_ADMIN_JWT || null
  }

  const immediate = tokenManager.getToken()
  if (immediate) return immediate

  try {
    return await tokenManager.getSessionToken()
  } catch (error) {
    return null
  }
}

function buildGraphQLErrorMessage(response, result) {
  const statusPart = response ? `HTTP ${response.status}` : 'Network error'
  const errorMessages = []

  if (result?.errors?.length) {
    for (const error of result.errors) {
      if (error?.message) {
        const path = error?.path?.length ? ` (${error.path.join('.')})` : ''
        errorMessages.push(`${error.message}${path}`)
      }
    }
  }

  if (result?.data === undefined && !errorMessages.length && result) {
    errorMessages.push(JSON.stringify(result))
  }

  const suffix = errorMessages.length ? `: ${errorMessages.join(' | ')}` : ''
  return `${statusPart}${suffix}`
}

export async function executeGraphQL({ query, variables = {}, operationName, headers = {}, token, skipAuth = false } = {}) {
  if (!query) {
    throw new Error('GraphQL query is required')
  }

  console.log('🔍 GraphQL Request:', {
    endpoint: STRAPI_GRAPHQL_ENDPOINT,
    operationName: operationName || 'Unknown',
    variables: variables || {},
    hasAuth: !skipAuth && !!await resolveAuthToken(token)
  })

  const resolvedToken = skipAuth ? null : await resolveAuthToken(token)

  const response = await fetch(STRAPI_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
    body: JSON.stringify({ query, variables, operationName }),
  }).catch((error) => {
    console.error('❌ GraphQL Network Error:', error)
    throw new Error(`GraphQL request failed: ${error.message || error}`)
  })

  const result = await response.json().catch(async () => {
    const text = await response.text().catch(() => '')
    return text ? { errors: [{ message: text }] } : null
  })

  console.log('📝 GraphQL Response:', {
    status: response.status,
    ok: response.ok,
    hasData: !!result?.data,
    hasErrors: !!result?.errors,
    errors: result?.errors?.map(e => e.message) || []
  })

  if (!response.ok || result?.errors) {
    console.error('❌ GraphQL Error Details:', result?.errors)
    throw new Error(buildGraphQLErrorMessage(response, result))
  }

  return result?.data ?? null
}

export const graphqlClient = {
  execute: executeGraphQL,
}

