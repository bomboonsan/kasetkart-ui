export const PROFILE_FIELDS_FRAGMENT = `
  fragment ProfileFields on Profile {
    documentId
    firstNameTH
    lastNameTH
    firstNameEN
    lastNameEN
    academicPosition
    highDegree
    jobType
    telephoneNo
    biography
    avatarUrl {
      data {
        id
        attributes {
          url
          alternativeText
          mime
          width
          height
        }
      }
    }
  }
`

export const EDUCATION_FIELDS_FRAGMENT = `
  fragment EducationFields on Education {
    documentId
    name
    faculty
    year
    education_level {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
  }
`

export const LOOKUP_RELATION_FRAGMENT = `
  fragment LookupRelationFields on GenericMorph {
    ... on AcademicType {
      documentId
      name
    }
    ... on Department {
      documentId
      name
    }
    ... on Faculty {
      documentId
      name
    }
    ... on Organization {
      documentId
      name
    }
    ... on ParticipationType {
      documentId
      name
    }
  }
`

export const USER_RELATION_FIELDS_FRAGMENT = `
  fragment UserRelationFields on UsersPermissionsUser {
    documentId
    email
    username
    confirmed
    blocked
    profile {
      data {
        id
        attributes {
          ...ProfileFields
        }
      }
    }
    organization {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
    faculty {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
    department {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
    academic_type {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
    participation_type {
      data {
        id
        attributes {
          documentId
          name
        }
      }
    }
    educations {
      data {
        id
        attributes {
          ...EducationFields
        }
      }
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
  ${EDUCATION_FIELDS_FRAGMENT}
`

export const GET_MY_PROFILE_SIDEBAR = `
  query GetMyProfileSidebar {
    me {
      id
      documentId
      email
      username
      role {
        id
        name
        description
      }
      profile {
        data {
          id
          attributes {
            ...ProfileFields
          }
        }
      }
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
`

export const GET_MY_PROFILE = `
  query GetMyProfile {
    me {
      id
      ...UserRelationFields
    }
  }
  ${USER_RELATION_FIELDS_FRAGMENT}
`

export const GET_USER_BY_FILTERS = `
  query GetUserByFilters($filters: UsersPermissionsUserFiltersInput) {
    usersPermissionsUsers(filters: $filters, pagination: { limit: 1 }) {
      data {
        id
        attributes {
          ...UserRelationFields
        }
      }
    }
  }
  ${USER_RELATION_FIELDS_FRAGMENT}
`

export const GET_PROFILES = `
  query GetProfiles($filters: ProfileFiltersInput, $pagination: PaginationArg) {
    profiles(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...ProfileFields
          user {
            data {
              id
              attributes {
                documentId
                email
                username
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
`

export const GET_PROFILE_BY_ID = `
  query GetProfileById($id: ID!) {
    profile(id: $id) {
      data {
        id
        attributes {
          ...ProfileFields
          user {
            data {
              id
              attributes {
                documentId
                email
                username
              }
            }
          }
        }
      }
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
`

export const GET_PROFILE_BY_DOCUMENT_ID = `
  query GetProfileByDocumentId($documentId: ID!) {
    profile(documentId: $documentId) {
      data {
        id
        attributes {
          ...ProfileFields
          user {
            data {
              id
              attributes {
                documentId
                email
                username
              }
            }
          }
        }
      }
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
`
