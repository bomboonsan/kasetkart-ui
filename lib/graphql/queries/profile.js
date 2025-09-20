// GraphQL Profile API queries and mutations for Strapi v5
import { 
  USER_BASIC_FRAGMENT, 
  USER_WITH_PROFILE_FRAGMENT, 
  USER_COMPLETE_FRAGMENT,
  PROFILE_COMPLETE_FRAGMENT 
} from '../fragments.js';

// Query for getting current user profile (sidebar)
export const GET_MY_PROFILE_SIDEBAR = `
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetMyProfileSidebar {
    me {
      ...UserWithProfile
    }
  }
`;

// Query for getting current user complete profile (edit page)
export const GET_MY_PROFILE = `
  ${USER_COMPLETE_FRAGMENT}
  
  query GetMyProfile {
    me {
      ...UserComplete
      educations {
        id
        documentId
        education_level {
          id
          documentId
          name
          nameEN
          level
        }
        degree
        institution
        year
        country
      }
    }
  }
`;

// Query for getting user by ID (for admin)
export const GET_USER_BY_ID = `
  ${USER_COMPLETE_FRAGMENT}
  
  query GetUserById($documentId: ID!) {
    usersPermissionsUser(documentId: $documentId) {
      ...UserComplete
      educations {
        id
        documentId
        education_level {
          id
          documentId
          name
          nameEN
          level
        }
        degree
        institution
        year
        country
      }
    }
  }
`;

// Query for getting user by documentId using filters
export const GET_USER_BY_DOCUMENT_ID = `
  ${USER_COMPLETE_FRAGMENT}
  
  query GetUserByDocumentId($documentId: String!) {
    usersPermissionsUsers(filters: { documentId: { eq: $documentId } }) {
      ...UserComplete
      educations {
        id
        documentId
        education_level {
          id
          documentId
          name
          nameEN
          level
        }
        degree
        institution
        year
        country
      }
    }
  }
`;

// Query for getting profiles list
export const GET_PROFILES = `
  ${PROFILE_COMPLETE_FRAGMENT}
  
  query GetProfiles(
    $filters: ProfileFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    profiles(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...ProfileComplete
      user {
        id
        documentId
        username
        email
      }
    }
  }
`;

// Query for getting single profile
export const GET_PROFILE = `
  ${PROFILE_COMPLETE_FRAGMENT}
  
  query GetProfile($documentId: ID!, $locale: I18NLocaleCode) {
    profile(documentId: $documentId, locale: $locale) {
      ...ProfileComplete
      user {
        id
        documentId
        username
        email
        confirmed
        blocked
      }
    }
  }
`;

// Query for finding profile by user ID
export const FIND_PROFILE_BY_USER_ID = `
  ${PROFILE_COMPLETE_FRAGMENT}
  
  query FindProfileByUserId($userId: String!) {
    profiles(filters: { user: { id: { eq: $userId } } }) {
      ...ProfileComplete
    }
  }
`;

// Mutation for updating user profile
export const UPDATE_USER_PROFILE = `
  ${USER_COMPLETE_FRAGMENT}
  
  mutation UpdateUserProfile($documentId: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(documentId: $documentId, data: $data) {
      ...UserComplete
    }
  }
`;

// Mutation for creating profile
export const CREATE_PROFILE = `
  ${PROFILE_COMPLETE_FRAGMENT}
  
  mutation CreateProfile($data: ProfileInput!, $locale: I18NLocaleCode) {
    createProfile(data: $data, locale: $locale) {
      ...ProfileComplete
    }
  }
`;

// Mutation for updating profile data
export const UPDATE_PROFILE_DATA = `
  ${PROFILE_COMPLETE_FRAGMENT}
  
  mutation UpdateProfileData($documentId: ID!, $data: ProfileInput!, $locale: I18NLocaleCode) {
    updateProfile(documentId: $documentId, data: $data, locale: $locale) {
      ...ProfileComplete
    }
  }
`;

// Custom mutation for updating user relations (if still needed)
export const UPDATE_USER_RELATIONS = `
  mutation UpdateUserRelations($payload: JSON!) {
    updateUserRelations(payload: $payload) {
      success
      message
    }
  }
`;