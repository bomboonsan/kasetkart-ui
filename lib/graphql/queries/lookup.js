// GraphQL queries for lookup/reference data
import { gql } from 'graphql-request'

// Basic organization/lookup fragment
export const LOOKUP_FRAGMENT = gql`
  fragment LookupFragment on Organization {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

export const FACULTY_FRAGMENT = gql`
  fragment FacultyFragment on Faculty {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

export const DEPARTMENT_FRAGMENT = gql`
  fragment DepartmentFragment on Department {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

export const ACADEMIC_TYPE_FRAGMENT = gql`
  fragment AcademicTypeFragment on AcademicType {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

export const EDUCATION_LEVEL_FRAGMENT = gql`
  fragment EducationLevelFragment on EducationLevel {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

export const PARTICIPATION_TYPE_FRAGMENT = gql`
  fragment ParticipationTypeFragment on ParticipationType {
    id
    documentId
    name
    createdAt
    updatedAt
  }
`

// Query: Get organizations
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations(
    $filters: OrganizationFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    organizations(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...LookupFragment
      }
    }
  }
  ${LOOKUP_FRAGMENT}
`

// Query: Get faculties
export const GET_FACULTIES = gql`
  query GetFaculties(
    $filters: FacultyFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    faculties(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...FacultyFragment
      }
    }
  }
  ${FACULTY_FRAGMENT}
`

// Query: Get departments
export const GET_DEPARTMENTS = gql`
  query GetDepartments(
    $filters: DepartmentFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    departments(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...DepartmentFragment
      }
    }
  }
  ${DEPARTMENT_FRAGMENT}
`

// Query: Get academic types
export const GET_ACADEMIC_TYPES = gql`
  query GetAcademicTypes(
    $filters: AcademicTypeFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    academicTypes(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...AcademicTypeFragment
      }
    }
  }
  ${ACADEMIC_TYPE_FRAGMENT}
`

// Query: Get education levels
export const GET_EDUCATION_LEVELS = gql`
  query GetEducationLevels(
    $filters: EducationLevelFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    educationLevels(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...EducationLevelFragment
      }
    }
  }
  ${EDUCATION_LEVEL_FRAGMENT}
`

// Query: Get participation types
export const GET_PARTICIPATION_TYPES = gql`
  query GetParticipationTypes(
    $filters: ParticipationTypeFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    participationTypes(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...ParticipationTypeFragment
      }
    }
  }
  ${PARTICIPATION_TYPE_FRAGMENT}
`

// Query: Get IC types
export const GET_IC_TYPES = gql`
  query GetIcTypes(
    $filters: IcTypeFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    icTypes(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        id
        documentId
        name
        createdAt
        updatedAt
      }
    }
  }
`

// Query: Get impacts
export const GET_IMPACTS = gql`
  query GetImpacts(
    $filters: ImpactFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    impacts(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        id
        documentId
        name
        createdAt
        updatedAt
      }
    }
  }
`

// Query: Get SDGs
export const GET_SDGS = gql`
  query GetSdgs(
    $filters: SdgFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    sdgs(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        id
        documentId
        name
        createdAt
        updatedAt
      }
    }
  }
`

// Education queries and mutations
export const GET_MY_EDUCATIONS = gql`
  query GetMyEducations($userId: ID!) {
    educations(
      filters: { users_permissions_user: { id: { eq: $userId } } }
    ) {
      data {
        id
        documentId
        education_level {
          ...EducationLevelFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${EDUCATION_LEVEL_FRAGMENT}
`

export const CREATE_EDUCATION = gql`
  mutation CreateEducation($data: EducationInput!) {
    createEducation(data: $data) {
      data {
        id
        documentId
        education_level {
          ...EducationLevelFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${EDUCATION_LEVEL_FRAGMENT}
`

export const UPDATE_EDUCATION = gql`
  mutation UpdateEducation($id: ID!, $data: EducationInput!) {
    updateEducation(id: $id, data: $data) {
      data {
        id
        documentId
        education_level {
          ...EducationLevelFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${EDUCATION_LEVEL_FRAGMENT}
`

export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($id: ID!) {
    deleteEducation(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`