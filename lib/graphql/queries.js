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

// Lookup Queries
export const GET_ORGANIZATIONS = `
  query GetOrganizations($filters: OrganizationFiltersInput, $pagination: PaginationArg) {
    organizations(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_FACULTIES = `
  query GetFaculties($filters: FacultyFiltersInput, $pagination: PaginationArg) {
    faculties(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_DEPARTMENTS = `
  query GetDepartments($filters: DepartmentFiltersInput, $pagination: PaginationArg) {
    departments(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_ACADEMIC_TYPES = `
  query GetAcademicTypes($filters: AcademicTypeFiltersInput, $pagination: PaginationArg) {
    academicTypes(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_EDUCATION_LEVELS = `
  query GetEducationLevels($filters: EducationLevelFiltersInput, $pagination: PaginationArg) {
    educationLevels(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_PARTICIPATION_TYPES = `
  query GetParticipationTypes($filters: ParticipationTypeFiltersInput, $pagination: PaginationArg) {
    participationTypes(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_IC_TYPES = `
  query GetIcTypes($filters: IcTypeFiltersInput, $pagination: PaginationArg) {
    icTypes(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_IMPACTS = `
  query GetImpacts($filters: ImpactFiltersInput, $pagination: PaginationArg) {
    impacts(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_SDGS = `
  query GetSdgs($filters: SdgFiltersInput, $pagination: PaginationArg) {
    sdgs(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          documentId
          name
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
`

export const GET_EDUCATIONS_BY_USER = `
  query GetEducationsByUser($filters: EducationFiltersInput, $pagination: PaginationArg) {
    educations(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...EducationFields
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

// Project Research Queries
export const PROJECT_RESEARCH_FIELDS_FRAGMENT = `
  fragment ProjectResearchFields on ProjectResearch {
    documentId
    title
    description
    objectives
    methodology
    expectedResults
    budget
    startDate
    endDate
    status
    researchType
    researchCategory
  }
`

export const PROJECT_PARTNER_FIELDS_FRAGMENT = `
  fragment ProjectPartnerFields on ProjectPartner {
    documentId
    role
    contribution
    users_permissions_user {
      data {
        id
        attributes {
          documentId
          email
          username
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
    }
  }
  ${PROFILE_FIELDS_FRAGMENT}
`

export const GET_PROJECT_RESEARCHES = `
  query GetProjectResearches($filters: ProjectResearchFiltersInput, $pagination: PaginationArg) {
    projectResearches(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...ProjectResearchFields
          research_partners {
            data {
              id
              attributes {
                ...ProjectPartnerFields
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
  ${PROJECT_RESEARCH_FIELDS_FRAGMENT}
  ${PROJECT_PARTNER_FIELDS_FRAGMENT}
`

export const GET_PROJECT_RESEARCH_BY_ID = `
  query GetProjectResearchById($id: ID!) {
    projectResearch(id: $id) {
      data {
        id
        attributes {
          ...ProjectResearchFields
          research_partners {
            data {
              id
              attributes {
                ...ProjectPartnerFields
              }
            }
          }
        }
      }
    }
  }
  ${PROJECT_RESEARCH_FIELDS_FRAGMENT}
  ${PROJECT_PARTNER_FIELDS_FRAGMENT}
`

export const GET_PROJECT_RESEARCH_BY_DOCUMENT_ID = `
  query GetProjectResearchByDocumentId($documentId: ID!) {
    projectResearch(documentId: $documentId) {
      data {
        id
        attributes {
          ...ProjectResearchFields
          research_partners {
            data {
              id
              attributes {
                ...ProjectPartnerFields
              }
            }
          }
        }
      }
    }
  }
  ${PROJECT_RESEARCH_FIELDS_FRAGMENT}
  ${PROJECT_PARTNER_FIELDS_FRAGMENT}
`

export const GET_PROJECT_PARTNERS = `
  query GetProjectPartners($filters: ProjectPartnerFiltersInput, $pagination: PaginationArg) {
    projectPartners(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...ProjectPartnerFields
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
  ${PROJECT_PARTNER_FIELDS_FRAGMENT}
`

// Project Funding Queries
export const PROJECT_FUNDING_FIELDS_FRAGMENT = `
  fragment ProjectFundingFields on ProjectFunding {
    documentId
    title
    amount
    currency
    fundingSource
    fundingType
    startDate
    endDate
    status
    description
  }
`

export const GET_PROJECT_FUNDINGS = `
  query GetProjectFundings($filters: ProjectFundingFiltersInput, $pagination: PaginationArg) {
    projectFundings(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...ProjectFundingFields
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
  ${PROJECT_FUNDING_FIELDS_FRAGMENT}
`

export const GET_PROJECT_FUNDING_BY_ID = `
  query GetProjectFundingById($id: ID!) {
    projectFunding(id: $id) {
      data {
        id
        attributes {
          ...ProjectFundingFields
        }
      }
    }
  }
  ${PROJECT_FUNDING_FIELDS_FRAGMENT}
`

export const GET_PROJECT_FUNDING_BY_DOCUMENT_ID = `
  query GetProjectFundingByDocumentId($documentId: ID!) {
    projectFunding(documentId: $documentId) {
      data {
        id
        attributes {
          ...ProjectFundingFields
        }
      }
    }
  }
  ${PROJECT_FUNDING_FIELDS_FRAGMENT}
`

// Works Queries
export const WORK_BOOK_FIELDS_FRAGMENT = `
  fragment WorkBookFields on WorkBook {
    documentId
    title
    isbn
    publisher
    publicationDate
    pageCount
    language
    description
    authors
  }
`

export const WORK_CONFERENCE_FIELDS_FRAGMENT = `
  fragment WorkConferenceFields on WorkConference {
    documentId
    title
    conferenceName
    location
    conferenceDate
    presentationType
    description
    project_research {
      data {
        id
        attributes {
          ...ProjectResearchFields
        }
      }
    }
  }
  ${PROJECT_RESEARCH_FIELDS_FRAGMENT}
`

export const WORK_PUBLICATION_FIELDS_FRAGMENT = `
  fragment WorkPublicationFields on WorkPublication {
    documentId
    title
    journal
    volume
    issue
    pages
    publicationDate
    doi
    abstractText
    keywords
    authors
  }
`

export const GET_WORK_BOOKS = `
  query GetWorkBooks($filters: WorkBookFiltersInput, $pagination: PaginationArg) {
    workBooks(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...WorkBookFields
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
  ${WORK_BOOK_FIELDS_FRAGMENT}
`

export const GET_WORK_BOOK_BY_ID = `
  query GetWorkBookById($id: ID!) {
    workBook(id: $id) {
      data {
        id
        attributes {
          ...WorkBookFields
        }
      }
    }
  }
  ${WORK_BOOK_FIELDS_FRAGMENT}
`

export const GET_WORK_BOOK_BY_DOCUMENT_ID = `
  query GetWorkBookByDocumentId($documentId: ID!) {
    workBook(documentId: $documentId) {
      data {
        id
        attributes {
          ...WorkBookFields
        }
      }
    }
  }
  ${WORK_BOOK_FIELDS_FRAGMENT}
`

export const GET_WORK_CONFERENCES = `
  query GetWorkConferences($filters: WorkConferenceFiltersInput, $pagination: PaginationArg) {
    workConferences(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...WorkConferenceFields
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
  ${WORK_CONFERENCE_FIELDS_FRAGMENT}
`

export const GET_WORK_CONFERENCE_BY_ID = `
  query GetWorkConferenceById($id: ID!) {
    workConference(id: $id) {
      data {
        id
        attributes {
          ...WorkConferenceFields
        }
      }
    }
  }
  ${WORK_CONFERENCE_FIELDS_FRAGMENT}
`

export const GET_WORK_CONFERENCE_BY_DOCUMENT_ID = `
  query GetWorkConferenceByDocumentId($documentId: ID!) {
    workConference(documentId: $documentId) {
      data {
        id
        attributes {
          ...WorkConferenceFields
        }
      }
    }
  }
  ${WORK_CONFERENCE_FIELDS_FRAGMENT}
`

export const GET_WORK_PUBLICATIONS = `
  query GetWorkPublications($filters: WorkPublicationFiltersInput, $pagination: PaginationArg) {
    workPublications(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          ...WorkPublicationFields
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
  ${WORK_PUBLICATION_FIELDS_FRAGMENT}
`

export const GET_WORK_PUBLICATION_BY_ID = `
  query GetWorkPublicationById($id: ID!) {
    workPublication(id: $id) {
      data {
        id
        attributes {
          ...WorkPublicationFields
        }
      }
    }
  }
  ${WORK_PUBLICATION_FIELDS_FRAGMENT}
`

export const GET_WORK_PUBLICATION_BY_DOCUMENT_ID = `
  query GetWorkPublicationByDocumentId($documentId: ID!) {
    workPublication(documentId: $documentId) {
      data {
        id
        attributes {
          ...WorkPublicationFields
        }
      }
    }
  }
  ${WORK_PUBLICATION_FIELDS_FRAGMENT}
`

// Dashboard-specific queries for personnel and research statistics
export const GET_ALL_USERS_FOR_DASHBOARD = `
  query GetAllUsersForDashboard($filters: UsersPermissionsUserFiltersInput, $pagination: PaginationArg) {
    usersPermissionsUsers(filters: $filters, pagination: $pagination) {
      data {
        id
        attributes {
          academic_type {
            data {
              id
              attributes {
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
`
