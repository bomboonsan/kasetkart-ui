// GraphQL queries for projects and funding
import { gql } from 'graphql-request'

// Project research fragments
export const PROJECT_RESEARCH_FRAGMENT = gql`
  fragment ProjectResearchFragment on ProjectResearch {
    id
    documentId
    title
    description
    startDate
    endDate
    status
    createdAt
    updatedAt
    publishedAt
  }
`

export const RESEARCH_PARTNER_FRAGMENT = gql`
  fragment ResearchPartnerFragment on ResearchPartner {
    id
    documentId
    role
    users_permissions_user {
      id
      documentId
      username
      email
      profile {
        id
        documentId
        firstName
        lastName
      }
    }
    createdAt
    updatedAt
  }
`

export const FULL_PROJECT_RESEARCH_FRAGMENT = gql`
  fragment FullProjectResearchFragment on ProjectResearch {
    ...ProjectResearchFragment
    research_partners {
      data {
        ...ResearchPartnerFragment
      }
    }
  }
  ${PROJECT_RESEARCH_FRAGMENT}
  ${RESEARCH_PARTNER_FRAGMENT}
`

// Funding fragments
export const PROJECT_FUNDING_FRAGMENT = gql`
  fragment ProjectFundingFragment on ProjectFunding {
    id
    documentId
    nameTh
    nameEn
    purpose
    budget
    startDate
    endDate
    status
    users_permissions_user {
      id
      documentId
      username
      email
      profile {
        id
        documentId
        firstName
        lastName
      }
    }
    createdAt
    updatedAt
    publishedAt
  }
`

// Query: Get projects with research partners
export const GET_PROJECTS = gql`
  query GetProjects(
    $filters: ProjectResearchFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    projectResearches(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...FullProjectResearchFragment
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
  ${FULL_PROJECT_RESEARCH_FRAGMENT}
`

// Query: Get my projects (projects where user is in research_partners)
export const GET_MY_PROJECTS = gql`
  query GetMyProjects($userId: ID!) {
    projectResearches(
      filters: {
        research_partners: {
          users_permissions_user: {
            id: { eq: $userId }
          }
        }
      }
    ) {
      data {
        ...FullProjectResearchFragment
      }
    }
  }
  ${FULL_PROJECT_RESEARCH_FRAGMENT}
`

// Query: Get project by ID
export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    projectResearch(id: $id) {
      ...FullProjectResearchFragment
    }
  }
  ${FULL_PROJECT_RESEARCH_FRAGMENT}
`

// Query: Get project partners
export const GET_PROJECT_PARTNERS = gql`
  query GetProjectPartners($projectId: ID!) {
    researchPartners(
      filters: {
        project_researches: {
          documentId: { eq: $projectId }
        }
      }
    ) {
      data {
        ...ResearchPartnerFragment
      }
    }
  }
  ${RESEARCH_PARTNER_FRAGMENT}
`

// Mutation: Create project
export const CREATE_PROJECT = gql`
  mutation CreateProject($data: ProjectResearchInput!) {
    createProjectResearch(data: $data) {
      data {
        ...FullProjectResearchFragment
      }
    }
  }
  ${FULL_PROJECT_RESEARCH_FRAGMENT}
`

// Mutation: Update project
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $data: ProjectResearchInput!) {
    updateProjectResearch(id: $id, data: $data) {
      data {
        ...FullProjectResearchFragment
      }
    }
  }
  ${FULL_PROJECT_RESEARCH_FRAGMENT}
`

// Mutation: Delete project
export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProjectResearch(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`

// Mutation: Create research partner
export const CREATE_RESEARCH_PARTNER = gql`
  mutation CreateResearchPartner($data: ResearchPartnerInput!) {
    createResearchPartner(data: $data) {
      data {
        ...ResearchPartnerFragment
      }
    }
  }
  ${RESEARCH_PARTNER_FRAGMENT}
`

// Mutation: Update research partner
export const UPDATE_RESEARCH_PARTNER = gql`
  mutation UpdateResearchPartner($id: ID!, $data: ResearchPartnerInput!) {
    updateResearchPartner(id: $id, data: $data) {
      data {
        ...ResearchPartnerFragment
      }
    }
  }
  ${RESEARCH_PARTNER_FRAGMENT}
`

// Mutation: Delete research partner
export const DELETE_RESEARCH_PARTNER = gql`
  mutation DeleteResearchPartner($id: ID!) {
    deleteResearchPartner(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`

// FUNDING QUERIES

// Query: Get fundings with filters
export const GET_FUNDINGS = gql`
  query GetFundings(
    $filters: ProjectFundingFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    projectFundings(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...ProjectFundingFragment
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
  ${PROJECT_FUNDING_FRAGMENT}
`

// Query: Get my fundings
export const GET_MY_FUNDINGS = gql`
  query GetMyFundings($userId: ID!) {
    projectFundings(
      filters: {
        users_permissions_user: {
          id: { eq: $userId }
        }
      }
    ) {
      data {
        ...ProjectFundingFragment
      }
    }
  }
  ${PROJECT_FUNDING_FRAGMENT}
`

// Query: Get funding by ID
export const GET_FUNDING = gql`
  query GetFunding($id: ID!) {
    projectFunding(id: $id) {
      ...ProjectFundingFragment
    }
  }
  ${PROJECT_FUNDING_FRAGMENT}
`

// Mutation: Create funding
export const CREATE_FUNDING = gql`
  mutation CreateFunding($data: ProjectFundingInput!) {
    createProjectFunding(data: $data) {
      data {
        ...ProjectFundingFragment
      }
    }
  }
  ${PROJECT_FUNDING_FRAGMENT}
`

// Mutation: Update funding
export const UPDATE_FUNDING = gql`
  mutation UpdateFunding($id: ID!, $data: ProjectFundingInput!) {
    updateProjectFunding(id: $id, data: $data) {
      data {
        ...ProjectFundingFragment
      }
    }
  }
  ${PROJECT_FUNDING_FRAGMENT}
`

// Mutation: Delete funding
export const DELETE_FUNDING = gql`
  mutation DeleteFunding($id: ID!) {
    deleteProjectFunding(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`