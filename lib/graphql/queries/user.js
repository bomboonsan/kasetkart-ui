// GraphQL queries for user and profile operations
import { gql } from 'graphql-request'

// User fragments for reuse
export const USER_FRAGMENT = gql`
  fragment UserFragment on UsersPermissionsUser {
    id
    documentId
    username
    email
    confirmed
    blocked
    createdAt
    updatedAt
    role {
      id
      name
      description
      type
    }
  }
`

export const PROFILE_FRAGMENT = gql`
  fragment ProfileFragment on Profile {
    id
    documentId
    firstName
    lastName
    phone
    avatarUrl {
      id
      url
      alternativeText
    }
    createdAt
    updatedAt
  }
`

export const FULL_USER_FRAGMENT = gql`
  fragment FullUserFragment on UsersPermissionsUser {
    ...UserFragment
    profile {
      ...ProfileFragment
    }
    organization {
      id
      documentId
      name
    }
    faculty {
      id
      documentId
      name
    }
    department {
      id
      documentId
      name
    }
    academic_type {
      id
      documentId
      name
    }
    participation_type {
      id
      documentId
      name
    }
    educations {
      id
      documentId
      education_level {
        id
        documentId
        name
      }
    }
  }
  ${USER_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

// Query: Get current user (me) with minimal profile info for sidebar
export const GET_MY_PROFILE_SIDEBAR = gql`
  query GetMyProfileSidebar {
    me {
      ...UserFragment
      profile {
        ...ProfileFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

// Query: Get current user with full profile information
export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    me {
      ...FullUserFragment
    }
  }
  ${FULL_USER_FRAGMENT}
`

// Query: Get user by ID with full information (for admin)
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    usersPermissionsUser(id: $id) {
      ...FullUserFragment
    }
  }
  ${FULL_USER_FRAGMENT}
`

// Query: Get users with filters and pagination
export const GET_USERS = gql`
  query GetUsers(
    $filters: UsersPermissionsUserFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    usersPermissionsUsers(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...FullUserFragment
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
  ${FULL_USER_FRAGMENT}
`

// Query: Get profiles
export const GET_PROFILES = gql`
  query GetProfiles(
    $filters: ProfileFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    profiles(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...ProfileFragment
        user {
          ...UserFragment
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
  ${PROFILE_FRAGMENT}
  ${USER_FRAGMENT}
`

// Query: Get profile by document ID
export const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    profile(id: $id) {
      ...ProfileFragment
      user {
        ...UserFragment
      }
    }
  }
  ${PROFILE_FRAGMENT}
  ${USER_FRAGMENT}
`

// Mutation: Update user profile
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        ...FullUserFragment
      }
    }
  }
  ${FULL_USER_FRAGMENT}
`

// Mutation: Create profile
export const CREATE_PROFILE = gql`
  mutation CreateProfile($data: ProfileInput!) {
    createProfile(data: $data) {
      data {
        ...ProfileFragment
        user {
          ...UserFragment
        }
      }
    }
  }
  ${PROFILE_FRAGMENT}
  ${USER_FRAGMENT}
`

// Mutation: Update profile
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $data: ProfileInput!) {
    updateProfile(id: $id, data: $data) {
      data {
        ...ProfileFragment
        user {
          ...UserFragment
        }
      }
    }
  }
  ${PROFILE_FRAGMENT}
  ${USER_FRAGMENT}
`

// Mutation: Create user (for admin)
export const CREATE_USER = gql`
  mutation CreateUser($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data) {
      data {
        ...FullUserFragment
      }
    }
  }
  ${FULL_USER_FRAGMENT}
`