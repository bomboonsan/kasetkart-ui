function setNestedValue(target, path, value) {
  let current = target
  for (let i = 0; i < path.length; i += 1) {
    const segment = path[i]
    const isLast = i === path.length - 1
    const key = Array.isArray(current) ? Number(segment) : segment

    if (isLast) {
      if (Array.isArray(current)) {
        current[key] = value
      } else {
        current[key] = value
      }
      return
    }

    if (Array.isArray(current)) {
      if (!current[key]) {
        const nextSegment = path[i + 1]
        current[key] = isNumeric(nextSegment) ? [] : {}
      }
      current = current[key]
      continue
    }

    if (!current[key]) {
      const nextSegment = path[i + 1]
      current[key] = isNumeric(nextSegment) ? [] : {}
    }

    current = current[key]
  }
}

function isNumeric(value) {
  return /^\d+$/.test(String(value))
}

function formatSegment(segment) {
  if (segment.startsWith('$')) return segment.slice(1)
  return segment
}

export function restParamsToGraphQLArgs(params = {}) {
  const filters = {}
  const pagination = {}
  const sort = []
  const publicationState = params.publicationState || params['publicationState'] || undefined

  for (const [rawKey, rawValue] of Object.entries(params)) {
    if (rawKey.startsWith('filters[')) {
      const inner = rawKey.slice(8, -1) // remove filters[ and trailing ]
      const segments = inner.split('][').map(formatSegment)
      setNestedValue(filters, segments, rawValue)
      continue
    }

    if (rawKey.startsWith('pagination[')) {
      const key = rawKey.slice(11, -1)
      pagination[key] = Number(rawValue) || rawValue
      continue
    }

    if (rawKey.startsWith('sort[')) {
      const index = Number(rawKey.slice(5, -1))
      sort[index] = rawValue
      continue
    }
  }

  return {
    filters: Object.keys(filters).length ? filters : undefined,
    pagination: Object.keys(pagination).length ? pagination : undefined,
    sort: sort.filter(Boolean).length ? sort.filter(Boolean) : undefined,
    publicationState,
  }
}
