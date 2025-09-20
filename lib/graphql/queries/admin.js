// GraphQL Admin and Dashboard API queries for Strapi v5
import { 
  USER_COMPLETE_FRAGMENT,
  PROFILE_COMPLETE_FRAGMENT
} from '../fragments.js';

// ===== USER MANAGEMENT QUERIES =====

// Query for getting all users (admin)
export const GET_USERS = `
  ${USER_COMPLETE_FRAGMENT}
  
  query GetUsers(
    $filters: UsersPermissionsUserFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    usersPermissionsUsers(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...UserComplete
    }
  }
`;

// Query for getting single user (admin)
export const GET_USER = `
  ${USER_COMPLETE_FRAGMENT}
  
  query GetUser($documentId: ID!, $locale: I18NLocaleCode) {
    usersPermissionsUser(documentId: $documentId, locale: $locale) {
      ...UserComplete
    }
  }
`;

// ===== USER MANAGEMENT MUTATIONS =====

// Mutation for updating user
export const UPDATE_USER = `
  ${USER_COMPLETE_FRAGMENT}
  
  mutation UpdateUser($documentId: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(documentId: $documentId, data: $data) {
      ...UserComplete
    }
  }
`;

// Mutation for updating user status (blocked/confirmed)
export const UPDATE_USER_STATUS = `
  mutation UpdateUserStatus($documentId: ID!, $blocked: Boolean, $confirmed: Boolean) {
    updateUsersPermissionsUser(
      documentId: $documentId, 
      data: { 
        blocked: $blocked, 
        confirmed: $confirmed 
      }
    ) {
      id
      documentId
      username
      email
      blocked
      confirmed
    }
  }
`;

// Mutation for creating user
export const CREATE_USER = `
  ${USER_COMPLETE_FRAGMENT}
  
  mutation CreateUser($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data) {
      ...UserComplete
    }
  }
`;

// ===== FILE UPLOAD QUERIES =====

// Query for getting uploaded files
export const GET_UPLOADED_FILES = `
  query GetUploadedFiles(
    $filters: UploadFileFiltersInput,
    $sort: [String],
    $pagination: PaginationArg
  ) {
    uploadFiles(
      filters: $filters,
      sort: $sort,
      pagination: $pagination
    ) {
      id
      documentId
      name
      alternativeText
      caption
      width
      height
      formats
      hash
      ext
      mime
      size
      url
      previewUrl
      provider
      createdAt
      updatedAt
    }
  }
`;

// Query for getting single file
export const GET_UPLOADED_FILE = `
  query GetUploadedFile($documentId: ID!) {
    uploadFile(documentId: $documentId) {
      id
      documentId
      name
      alternativeText
      caption
      width
      height
      formats
      hash
      ext
      mime
      size
      url
      previewUrl
      provider
      createdAt
      updatedAt
    }
  }
`;

// Mutation for deleting file
export const DELETE_UPLOADED_FILE = `
  mutation DeleteUploadedFile($documentId: ID!) {
    deleteUploadFile(documentId: $documentId) {
      documentId
    }
  }
`;

// ===== DASHBOARD STATISTICS QUERIES =====

// Query for getting project counts
export const GET_PROJECT_STATS = `
  query GetProjectStats {
    projectResearches {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

// Query for getting funding counts
export const GET_FUNDING_STATS = `
  query GetFundingStats {
    projectFundings {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

// Query for getting works counts
export const GET_WORKS_STATS = `
  query GetWorksStats {
    workBooks {
      meta {
        pagination {
          total
        }
      }
    }
    workConferences {
      meta {
        pagination {
          total
        }
      }
    }
    workPublications {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

// Query for getting personnel by academic type (if custom endpoint exists)
export const GET_PERSONNEL_BY_ACADEMIC_TYPE = `
  query GetPersonnelByAcademicType($departmentId: String) {
    personnelByAcademicType(departmentId: $departmentId) {
      academicType
      count
      percentage
    }
  }
`;

// Query for getting research stats by types (if custom endpoint exists)
export const GET_RESEARCH_STATS_BY_TYPES = `
  query GetResearchStatsByTypes($departmentId: String) {
    researchStatsByTypes(departmentId: $departmentId) {
      icTypes {
        name
        count
      }
      impacts {
        name
        count
      }
      sdgs {
        name
        count
      }
    }
  }
`;

// Query for getting impacts by department (if custom endpoint exists)
export const GET_IMPACTS_BY_DEPARTMENT = `
  query GetImpactsByDepartment(
    $filters: ImpactFiltersInput,
    $sort: [String],
    $pagination: PaginationArg
  ) {
    impactsByDepartment(
      filters: $filters,
      sort: $sort,
      pagination: $pagination
    ) {
      department
      impact
      count
    }
  }
`;

// Query for aggregated dashboard data
export const GET_DASHBOARD_OVERVIEW = `
  query GetDashboardOverview {
    usersPermissionsUsers {
      meta {
        pagination {
          total
        }
      }
    }
    projectResearches {
      meta {
        pagination {
          total
        }
      }
    }
    projectFundings {
      meta {
        pagination {
          total
        }
      }
    }
    workBooks {
      meta {
        pagination {
          total
        }
      }
    }
    workConferences {
      meta {
        pagination {
          total
        }
      }
    }
    workPublications {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;