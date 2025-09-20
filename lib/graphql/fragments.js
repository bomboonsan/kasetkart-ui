// GraphQL Fragments for reusable field selections in Strapi v5

// Basic Media Fragment
export const MEDIA_FRAGMENT = `
  fragment MediaFragment on UploadFile {
    id
    documentId
    name
    alternativeText
    caption
    width
    height
    url
    previewUrl
    mime
    size
  }
`;

// Basic User Fragment
export const USER_BASIC_FRAGMENT = `
  fragment UserBasic on UsersPermissionsUser {
    id
    documentId
    username
    email
    confirmed
    blocked
    createdAt
    updatedAt
  }
`;

// Complete Profile Fragment
export const PROFILE_COMPLETE_FRAGMENT = `
  fragment ProfileComplete on Profile {
    id
    documentId
    firstNameTH
    lastNameTH
    firstNameEN
    lastNameEN
    academicPosition
    citizenId
    passportId
    phoneNumber
    lineId
    avatarUrl {
      ...MediaFragment
    }
    createdAt
    updatedAt
  }
  ${MEDIA_FRAGMENT}
`;

// User with Profile Fragment
export const USER_WITH_PROFILE_FRAGMENT = `
  fragment UserWithProfile on UsersPermissionsUser {
    ...UserBasic
    profile {
      ...ProfileComplete
    }
    role {
      id
      documentId
      name
      description
      type
    }
  }
  ${USER_BASIC_FRAGMENT}
  ${PROFILE_COMPLETE_FRAGMENT}
`;

// Organization Basic Fragment
export const ORGANIZATION_BASIC_FRAGMENT = `
  fragment OrganizationBasic on Organization {
    id
    documentId
    name
    nameEN
    code
    description
  }
`;

// Faculty with Organization Fragment
export const FACULTY_WITH_ORG_FRAGMENT = `
  fragment FacultyWithOrg on Faculty {
    id
    documentId
    name
    nameEN
    code
    organization {
      ...OrganizationBasic
    }
  }
  ${ORGANIZATION_BASIC_FRAGMENT}
`;

// Department with Faculty Fragment
export const DEPARTMENT_WITH_FACULTY_FRAGMENT = `
  fragment DepartmentWithFaculty on Department {
    id
    documentId
    name
    nameEN
    code
    faculty {
      ...FacultyWithOrg
    }
    organization {
      ...OrganizationBasic
    }
  }
  ${FACULTY_WITH_ORG_FRAGMENT}
`;

// Complete User Fragment (with all relations)
export const USER_COMPLETE_FRAGMENT = `
  fragment UserComplete on UsersPermissionsUser {
    ...UserWithProfile
    organization {
      ...OrganizationBasic
    }
    faculty {
      ...FacultyWithOrg
    }
    department {
      ...DepartmentWithFaculty
    }
    academic_type {
      id
      documentId
      name
      description
    }
    participation_type {
      id
      documentId
      name
      description
    }
  }
  ${USER_WITH_PROFILE_FRAGMENT}
  ${DEPARTMENT_WITH_FACULTY_FRAGMENT}
`;

// Project Basic Fragment
export const PROJECT_BASIC_FRAGMENT = `
  fragment ProjectBasic on ProjectResearch {
    id
    documentId
    title
    titleEN
    description
    descriptionEN
    startDate
    endDate
    status
    budget
    currency
    createdAt
    updatedAt
  }
`;

// Project with Owner Fragment
export const PROJECT_WITH_OWNER_FRAGMENT = `
  fragment ProjectWithOwner on ProjectResearch {
    ...ProjectBasic
    owner {
      ...UserWithProfile
    }
    organization {
      ...OrganizationBasic
    }
    faculty {
      ...FacultyWithOrg
    }
    department {
      ...DepartmentWithFaculty
    }
  }
  ${PROJECT_BASIC_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  ${DEPARTMENT_WITH_FACULTY_FRAGMENT}
`;

// Funding Basic Fragment
export const FUNDING_BASIC_FRAGMENT = `
  fragment FundingBasic on ProjectFunding {
    id
    documentId
    title
    titleEN
    fundingAgency
    fundingAgencyEN
    amount
    currency
    startDate
    endDate
    status
    description
    descriptionEN
    createdAt
    updatedAt
  }
`;

// Funding with Project Fragment
export const FUNDING_WITH_PROJECT_FRAGMENT = `
  fragment FundingWithProject on ProjectFunding {
    ...FundingBasic
    owner {
      ...UserWithProfile
    }
    project {
      ...ProjectBasic
    }
  }
  ${FUNDING_BASIC_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  ${PROJECT_BASIC_FRAGMENT}
`;

// Work Book Fragment
export const WORK_BOOK_FRAGMENT = `
  fragment WorkBookFragment on WorkBook {
    id
    documentId
    title
    titleEN
    isbn
    publisher
    publisherEN
    publicationDate
    pages
    language
    abstract
    abstractEN
    createdAt
    updatedAt
  }
`;

// Work Conference Fragment
export const WORK_CONFERENCE_FRAGMENT = `
  fragment WorkConferenceFragment on WorkConference {
    id
    documentId
    title
    titleEN
    conferenceName
    conferenceNameEN
    venue
    venueEN
    startDate
    endDate
    abstract
    abstractEN
    presentationType
    createdAt
    updatedAt
  }
`;

// Work Publication Fragment
export const WORK_PUBLICATION_FRAGMENT = `
  fragment WorkPublicationFragment on WorkPublication {
    id
    documentId
    title
    titleEN
    journalName
    journalNameEN
    volume
    issue
    pages
    doi
    publicationDate
    abstract
    abstractEN
    keywords
    keywordsEN
    createdAt
    updatedAt
  }
`;

// Work with Authors Fragment (for books, conferences, publications)
export const WORK_WITH_AUTHORS_FRAGMENT = `
  fragment WorkWithAuthors on WorkBook {
    ...WorkBookFragment
    authors {
      ...UserWithProfile
    }
  }
  ${WORK_BOOK_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
`;

// Lookup fragments for reference data
export const LOOKUP_BASIC_FRAGMENT = `
  fragment LookupBasic on Education {
    id
    documentId
    name
    nameEN
    description
  }
`;

export const SDG_FRAGMENT = `
  fragment SDGFragment on SDG {
    id
    documentId
    name
    description
    icon {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;