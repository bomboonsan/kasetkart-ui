// GraphQL Project and Funding API queries and mutations for Strapi v5
import { 
  PROJECT_BASIC_FRAGMENT, 
  PROJECT_WITH_OWNER_FRAGMENT,
  FUNDING_BASIC_FRAGMENT,
  FUNDING_WITH_PROJECT_FRAGMENT,
  USER_WITH_PROFILE_FRAGMENT 
} from '../fragments.js';

// ===== PROJECT QUERIES =====

// Query for getting all projects
export const GET_PROJECTS = `
  ${PROJECT_WITH_OWNER_FRAGMENT}
  
  query GetProjects(
    $filters: ProjectResearchFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    projectResearches(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...ProjectWithOwner
      research_partners {
        id
        documentId
        users_permissions_user {
          ...UserWithProfile
        }
      }
    }
  }
`;

// Query for getting projects by user (using research_partners filter)
export const GET_PROJECTS_BY_USER = `
  ${PROJECT_WITH_OWNER_FRAGMENT}
  
  query GetProjectsByUser($userId: String!) {
    projectResearches(
      filters: { 
        research_partners: { 
          users_permissions_user: { 
            id: { eq: $userId } 
          } 
        } 
      }
    ) {
      ...ProjectWithOwner
      research_partners {
        id
        documentId
        users_permissions_user {
          ...UserWithProfile
        }
      }
    }
  }
`;

// Query for getting single project
export const GET_PROJECT = `
  ${PROJECT_WITH_OWNER_FRAGMENT}
  
  query GetProject($documentId: ID!, $locale: I18NLocaleCode) {
    projectResearch(documentId: $documentId, locale: $locale) {
      ...ProjectWithOwner
      objective
      objectiveEN
      methodology
      methodologyEN
      expectedResults
      expectedResultsEN
      research_partners {
        id
        documentId
        role
        contribution
        users_permissions_user {
          ...UserWithProfile
        }
      }
      fundings {
        ...FundingBasic
      }
    }
  }
`;

// Query for getting project partners
export const GET_PROJECT_PARTNERS = `
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetProjectPartners($projectDocumentId: String!) {
    projectPartners(
      filters: { 
        project_researches: { 
          documentId: { eq: $projectDocumentId } 
        } 
      }
    ) {
      id
      documentId
      role
      contribution
      users_permissions_user {
        ...UserWithProfile
      }
    }
  }
`;

// ===== PROJECT MUTATIONS =====

// Mutation for creating project
export const CREATE_PROJECT = `
  ${PROJECT_WITH_OWNER_FRAGMENT}
  
  mutation CreateProject($data: ProjectResearchInput!, $locale: I18NLocaleCode) {
    createProjectResearch(data: $data, locale: $locale) {
      ...ProjectWithOwner
    }
  }
`;

// Mutation for creating project with relations (custom mutation if available)
export const CREATE_PROJECT_WITH_RELATIONS = `
  mutation CreateProjectWithRelations($data: JSON!) {
    createProjectWithRelations(data: $data) {
      id
      documentId
      title
      success
      message
    }
  }
`;

// Mutation for updating project
export const UPDATE_PROJECT = `
  ${PROJECT_WITH_OWNER_FRAGMENT}
  
  mutation UpdateProject($documentId: ID!, $data: ProjectResearchInput!, $locale: I18NLocaleCode) {
    updateProjectResearch(documentId: $documentId, data: $data, locale: $locale) {
      ...ProjectWithOwner
    }
  }
`;

// Mutation for deleting project
export const DELETE_PROJECT = `
  mutation DeleteProject($documentId: ID!, $locale: I18NLocaleCode) {
    deleteProjectResearch(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// ===== PROJECT PARTNER MUTATIONS =====

// Mutation for creating project partner
export const CREATE_PROJECT_PARTNER = `
  mutation CreateProjectPartner($data: ProjectPartnerInput!, $locale: I18NLocaleCode) {
    createProjectPartner(data: $data, locale: $locale) {
      id
      documentId
      role
      contribution
    }
  }
`;

// Mutation for updating project partner
export const UPDATE_PROJECT_PARTNER = `
  mutation UpdateProjectPartner($documentId: ID!, $data: ProjectPartnerInput!, $locale: I18NLocaleCode) {
    updateProjectPartner(documentId: $documentId, data: $data, locale: $locale) {
      id
      documentId
      role
      contribution
    }
  }
`;

// Mutation for deleting project partner
export const DELETE_PROJECT_PARTNER = `
  mutation DeleteProjectPartner($documentId: ID!, $locale: I18NLocaleCode) {
    deleteProjectPartner(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// ===== FUNDING QUERIES =====

// Query for getting all fundings
export const GET_FUNDINGS = `
  ${FUNDING_WITH_PROJECT_FRAGMENT}
  
  query GetFundings(
    $filters: ProjectFundingFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    projectFundings(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...FundingWithProject
    }
  }
`;

// Query for getting fundings by user
export const GET_FUNDINGS_BY_USER = `
  ${FUNDING_WITH_PROJECT_FRAGMENT}
  
  query GetFundingsByUser($userId: String!) {
    projectFundings(
      filters: { 
        owner: { 
          id: { eq: $userId } 
        } 
      }
    ) {
      ...FundingWithProject
    }
  }
`;

// Query for getting single funding
export const GET_FUNDING = `
  ${FUNDING_WITH_PROJECT_FRAGMENT}
  
  query GetFunding($documentId: ID!, $locale: I18NLocaleCode) {
    projectFunding(documentId: $documentId, locale: $locale) {
      ...FundingWithProject
    }
  }
`;

// ===== FUNDING MUTATIONS =====

// Mutation for creating funding
export const CREATE_FUNDING = `
  ${FUNDING_WITH_PROJECT_FRAGMENT}
  
  mutation CreateFunding($data: ProjectFundingInput!, $locale: I18NLocaleCode) {
    createProjectFunding(data: $data, locale: $locale) {
      ...FundingWithProject
    }
  }
`;

// Mutation for updating funding
export const UPDATE_FUNDING = `
  ${FUNDING_WITH_PROJECT_FRAGMENT}
  
  mutation UpdateFunding($documentId: ID!, $data: ProjectFundingInput!, $locale: I18NLocaleCode) {
    updateProjectFunding(documentId: $documentId, data: $data, locale: $locale) {
      ...FundingWithProject
    }
  }
`;

// Mutation for deleting funding
export const DELETE_FUNDING = `
  mutation DeleteFunding($documentId: ID!, $locale: I18NLocaleCode) {
    deleteProjectFunding(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// Query for getting current user (needed for filtering)
export const GET_CURRENT_USER = `
  query GetCurrentUser {
    me {
      id
      documentId
      username
      email
    }
  }
`;