function getAttr(entity) {
  if (!entity) return null
  if (entity.attributes) return entity.attributes
  return entity
}

function normalizeUploadFile(fileEntity) {
  const entity = fileEntity?.data || fileEntity
  if (!entity) return null
  const attributes = getAttr(entity)
  return {
    id: entity.id || attributes?.id || null,
    documentId: attributes?.documentId || null,
    url: attributes?.url || '',
    alternativeText: attributes?.alternativeText || '',
    caption: attributes?.caption || '',
    mime: attributes?.mime || '',
    width: attributes?.width || null,
    height: attributes?.height || null,
  }
}

export function normalizeProfile(profileEntity) {
  if (!profileEntity) return null

  const entity = profileEntity?.data || profileEntity
  const attributes = getAttr(entity)

  if (!attributes) return null

  let user = null
  if (attributes.user) {
    const userEntity = attributes.user.data || attributes.user
    const userAttrs = getAttr(userEntity)
    if (userAttrs) {
      user = {
        id: Number(userEntity.id) || userAttrs.id || null,
        documentId: userAttrs.documentId || null,
        email: userAttrs.email || '',
        username: userAttrs.username || '',
      }
    }
  }

  return {
    id: Number(entity.id) || attributes.id || null,
    documentId: attributes.documentId || null,
    firstNameTH: attributes.firstNameTH || '',
    lastNameTH: attributes.lastNameTH || '',
    firstNameEN: attributes.firstNameEN || '',
    lastNameEN: attributes.lastNameEN || '',
    academicPosition: attributes.academicPosition || '',
    highDegree: attributes.highDegree || '',
    jobType: attributes.jobType || '',
    telephoneNo: attributes.telephoneNo || '',
    biography: attributes.biography || '',
    avatarUrl: normalizeUploadFile(attributes.avatarUrl) || attributes.avatarUrl || null,
    user,
  }
}

function normalizeLookup(entity) {
  if (!entity) return null
  const data = entity?.data || entity
  if (!data) return null
  const attributes = getAttr(data)
  return {
    id: Number(data.id) || attributes?.id || null,
    documentId: attributes?.documentId || null,
    name: attributes?.name || '',
  }
}

function normalizeEducation(entity) {
  if (!entity) return null
  const data = entity?.data || entity
  const attributes = getAttr(data)
  if (!attributes) return null
  return {
    id: Number(data.id) || attributes.id || null,
    documentId: attributes.documentId || null,
    name: attributes.name || '',
    faculty: attributes.faculty || '',
    year: attributes.year || '',
    education_level: normalizeLookup(attributes.education_level),
  }
}

function normalizeCollection(collection, normalizer) {
  if (!collection) return []
  const list = collection?.data || collection
  if (!Array.isArray(list)) return []
  return list.map((item) => normalizer(item)).filter(Boolean)
}

export function normalizeUser(userEntity) {
  if (!userEntity) return null

  if (userEntity.attributes || userEntity.data) {
    const data = userEntity.data || userEntity
    const attrs = getAttr(data)
    if (!attrs) return null

    return {
      id: Number(data.id) || attrs.id || null,
      documentId: attrs.documentId || null,
      email: attrs.email || '',
      username: attrs.username || '',
      confirmed: Boolean(attrs.confirmed),
      blocked: Boolean(attrs.blocked),
      profile: normalizeProfile(attrs.profile),
      organization: normalizeLookup(attrs.organization),
      faculty: normalizeLookup(attrs.faculty),
      department: normalizeLookup(attrs.department),
      academic_type: normalizeLookup(attrs.academic_type),
      participation_type: normalizeLookup(attrs.participation_type),
      educations: normalizeCollection(attrs.educations, normalizeEducation),
    }
  }

  return {
    id: Number(userEntity.id) || userEntity.id || null,
    documentId: userEntity.documentId || null,
    email: userEntity.email || '',
    username: userEntity.username || '',
    confirmed: Boolean(userEntity.confirmed),
    blocked: Boolean(userEntity.blocked),
    profile: normalizeProfile(userEntity.profile),
    organization: normalizeLookup(userEntity.organization),
    faculty: normalizeLookup(userEntity.faculty),
    department: normalizeLookup(userEntity.department),
    academic_type: normalizeLookup(userEntity.academic_type),
    participation_type: normalizeLookup(userEntity.participation_type),
    educations: normalizeCollection(userEntity.educations, normalizeEducation),
    role: userEntity.role ? {
      id: userEntity.role.id || null,
      name: userEntity.role.name || '',
      description: userEntity.role.description || '',
    } : null,
  }
}

export function normalizeProfileCollection(collection) {
  const items = normalizeCollection(collection, normalizeProfile)
  const meta = collection?.meta || null
  return { data: items, meta }
}

export function normalizeUserCollection(collection) {
  const items = normalizeCollection(collection, normalizeUser)
  const meta = collection?.meta || null
  return { data: items, meta }
}
