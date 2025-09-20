// GraphQL Lookup API queries for Strapi v5
import { 
  ORGANIZATION_BASIC_FRAGMENT,
  FACULTY_WITH_ORG_FRAGMENT,
  DEPARTMENT_WITH_FACULTY_FRAGMENT,
  LOOKUP_BASIC_FRAGMENT,
  SDG_FRAGMENT
} from '../fragments.js';

// ===== ORGANIZATION QUERIES =====

// Query for getting all organizations
export const GET_ORGANIZATIONS = `
  ${ORGANIZATION_BASIC_FRAGMENT}
  
  query GetOrganizations(
    $filters: OrganizationFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    organizations(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...OrganizationBasic
    }
  }
`;

// Query for getting all faculties
export const GET_FACULTIES = `
  ${FACULTY_WITH_ORG_FRAGMENT}
  
  query GetFaculties(
    $filters: FacultyFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    faculties(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...FacultyWithOrg
    }
  }
`;

// Query for getting all departments
export const GET_DEPARTMENTS = `
  ${DEPARTMENT_WITH_FACULTY_FRAGMENT}
  
  query GetDepartments(
    $filters: DepartmentFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    departments(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...DepartmentWithFaculty
    }
  }
`;

// Query for getting academic types
export const GET_ACADEMIC_TYPES = `
  query GetAcademicTypes(
    $filters: AcademicTypeFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    academicTypes(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      id
      documentId
      name
      description
    }
  }
`;

// Query for getting education levels
export const GET_EDUCATION_LEVELS = `
  query GetEducationLevels(
    $filters: EducationFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    educations(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      id
      documentId
      name
      nameEN
      description
      level
    }
  }
`;

// Query for getting participation types
export const GET_PARTICIPATION_TYPES = `
  query GetParticipationTypes(
    $filters: ParticipationTypeFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    participationTypes(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      id
      documentId
      name
      description
    }
  }
`;

// ===== EDUCATION QUERIES =====

// Query for getting user's educations
export const GET_USER_EDUCATIONS = `
  query GetUserEducations($userId: String!) {
    educations(
      filters: { 
        users_permissions_user: { 
          id: { eq: $userId } 
        } 
      }
    ) {
      id
      documentId
      degree
      institution
      year
      country
      education_level {
        id
        documentId
        name
        nameEN
        level
      }
    }
  }
`;

// ===== EDUCATION MUTATIONS =====

// Mutation for creating education
export const CREATE_EDUCATION = `
  mutation CreateEducation($data: EducationInput!, $locale: I18NLocaleCode) {
    createEducation(data: $data, locale: $locale) {
      id
      documentId
      degree
      institution
      year
      country
      education_level {
        id
        documentId
        name
        nameEN
        level
      }
    }
  }
`;

// Mutation for updating education
export const UPDATE_EDUCATION = `
  mutation UpdateEducation($documentId: ID!, $data: EducationInput!, $locale: I18NLocaleCode) {
    updateEducation(documentId: $documentId, data: $data, locale: $locale) {
      id
      documentId
      degree
      institution
      year
      country
      education_level {
        id
        documentId
        name
        nameEN
        level
      }
    }
  }
`;

// Mutation for deleting education
export const DELETE_EDUCATION = `
  mutation DeleteEducation($documentId: ID!, $locale: I18NLocaleCode) {
    deleteEducation(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// ===== VALUE FROM API QUERIES =====

// Query for getting IC types
export const GET_IC_TYPES = `
  query GetIcTypes(
    $filters: IcTypeFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    icTypes(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      id
      documentId
      name
      description
    }
  }
`;

// Query for getting impacts
export const GET_IMPACTS = `
  query GetImpacts(
    $filters: ImpactFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    impacts(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      id
      documentId
      name
      description
    }
  }
`;

// Query for getting SDGs
export const GET_SDGS = `
  ${SDG_FRAGMENT}
  
  query GetSDGs(
    $filters: SDGFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    sdgs(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...SDGFragment
    }
  }
`;