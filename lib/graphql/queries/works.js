// GraphQL Works API queries and mutations for Strapi v5
import { 
  WORK_BOOK_FRAGMENT,
  WORK_CONFERENCE_FRAGMENT,
  WORK_PUBLICATION_FRAGMENT,
  USER_WITH_PROFILE_FRAGMENT,
  PROJECT_BASIC_FRAGMENT
} from '../fragments.js';

// ===== BOOK QUERIES =====

// Query for getting all books
export const GET_BOOKS = `
  ${WORK_BOOK_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetBooks(
    $filters: WorkBookFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    workBooks(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...WorkBookFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// Query for getting books by user
export const GET_BOOKS_BY_USER = `
  ${WORK_BOOK_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetBooksByUser($userId: String!) {
    workBooks(
      filters: { 
        authors: { 
          id: { eq: $userId } 
        } 
      }
    ) {
      ...WorkBookFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// Query for getting single book
export const GET_BOOK = `
  ${WORK_BOOK_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetBook($documentId: ID!, $locale: I18NLocaleCode) {
    workBook(documentId: $documentId, locale: $locale) {
      ...WorkBookFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// ===== BOOK MUTATIONS =====

// Mutation for creating book
export const CREATE_BOOK = `
  ${WORK_BOOK_FRAGMENT}
  
  mutation CreateBook($data: WorkBookInput!, $locale: I18NLocaleCode) {
    createWorkBook(data: $data, locale: $locale) {
      ...WorkBookFragment
    }
  }
`;

// Mutation for updating book
export const UPDATE_BOOK = `
  ${WORK_BOOK_FRAGMENT}
  
  mutation UpdateBook($documentId: ID!, $data: WorkBookInput!, $locale: I18NLocaleCode) {
    updateWorkBook(documentId: $documentId, data: $data, locale: $locale) {
      ...WorkBookFragment
    }
  }
`;

// Mutation for deleting book
export const DELETE_BOOK = `
  mutation DeleteBook($documentId: ID!, $locale: I18NLocaleCode) {
    deleteWorkBook(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// ===== CONFERENCE QUERIES =====

// Query for getting all conferences
export const GET_CONFERENCES = `
  ${WORK_CONFERENCE_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  ${PROJECT_BASIC_FRAGMENT}
  
  query GetConferences(
    $filters: WorkConferenceFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    workConferences(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...WorkConferenceFragment
      presenters {
        ...UserWithProfile
      }
      project_research {
        ...ProjectBasic
        research_partners {
          id
          users_permissions_user {
            id
            documentId
          }
        }
      }
    }
  }
`;

// Query for getting conferences by user (through presenters)
export const GET_CONFERENCES_BY_USER = `
  ${WORK_CONFERENCE_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetConferencesByUser($userId: String!) {
    workConferences(
      filters: { 
        presenters: { 
          id: { eq: $userId } 
        } 
      }
    ) {
      ...WorkConferenceFragment
      presenters {
        ...UserWithProfile
      }
    }
  }
`;

// Query for getting conferences by project participation
export const GET_CONFERENCES_BY_PROJECT_PARTICIPATION = `
  ${WORK_CONFERENCE_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetConferencesByProjectParticipation($userId: String!) {
    workConferences(
      filters: { 
        project_research: {
          research_partners: {
            users_permissions_user: {
              id: { eq: $userId }
            }
          }
        }
      }
    ) {
      ...WorkConferenceFragment
      presenters {
        ...UserWithProfile
      }
      project_research {
        ...ProjectBasic
      }
    }
  }
`;

// Query for getting single conference
export const GET_CONFERENCE = `
  ${WORK_CONFERENCE_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  ${PROJECT_BASIC_FRAGMENT}
  
  query GetConference($documentId: ID!, $locale: I18NLocaleCode) {
    workConference(documentId: $documentId, locale: $locale) {
      ...WorkConferenceFragment
      presenters {
        ...UserWithProfile
      }
      project_research {
        ...ProjectBasic
        research_partners {
          id
          users_permissions_user {
            ...UserWithProfile
          }
        }
      }
    }
  }
`;

// ===== CONFERENCE MUTATIONS =====

// Mutation for creating conference
export const CREATE_CONFERENCE = `
  ${WORK_CONFERENCE_FRAGMENT}
  
  mutation CreateConference($data: WorkConferenceInput!, $locale: I18NLocaleCode) {
    createWorkConference(data: $data, locale: $locale) {
      ...WorkConferenceFragment
    }
  }
`;

// Mutation for updating conference
export const UPDATE_CONFERENCE = `
  ${WORK_CONFERENCE_FRAGMENT}
  
  mutation UpdateConference($documentId: ID!, $data: WorkConferenceInput!, $locale: I18NLocaleCode) {
    updateWorkConference(documentId: $documentId, data: $data, locale: $locale) {
      ...WorkConferenceFragment
    }
  }
`;

// Mutation for deleting conference
export const DELETE_CONFERENCE = `
  mutation DeleteConference($documentId: ID!, $locale: I18NLocaleCode) {
    deleteWorkConference(documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`;

// ===== PUBLICATION QUERIES =====

// Query for getting all publications
export const GET_PUBLICATIONS = `
  ${WORK_PUBLICATION_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetPublications(
    $filters: WorkPublicationFiltersInput,
    $sort: [String],
    $pagination: PaginationArg,
    $locale: I18NLocaleCode
  ) {
    workPublications(
      filters: $filters,
      sort: $sort,
      pagination: $pagination,
      locale: $locale
    ) {
      ...WorkPublicationFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// Query for getting publications by user
export const GET_PUBLICATIONS_BY_USER = `
  ${WORK_PUBLICATION_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetPublicationsByUser($userId: String!) {
    workPublications(
      filters: { 
        authors: { 
          id: { eq: $userId } 
        } 
      }
    ) {
      ...WorkPublicationFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// Query for getting single publication
export const GET_PUBLICATION = `
  ${WORK_PUBLICATION_FRAGMENT}
  ${USER_WITH_PROFILE_FRAGMENT}
  
  query GetPublication($documentId: ID!, $locale: I18NLocaleCode) {
    workPublication(documentId: $documentId, locale: $locale) {
      ...WorkPublicationFragment
      authors {
        ...UserWithProfile
      }
    }
  }
`;

// ===== PUBLICATION MUTATIONS =====

// Mutation for creating publication
export const CREATE_PUBLICATION = `
  ${WORK_PUBLICATION_FRAGMENT}
  
  mutation CreatePublication($data: WorkPublicationInput!, $locale: I18NLocaleCode) {
    createWorkPublication(data: $data, locale: $locale) {
      ...WorkPublicationFragment
    }
  }
`;

// Mutation for updating publication
export const UPDATE_PUBLICATION = `
  ${WORK_PUBLICATION_FRAGMENT}
  
  mutation UpdatePublication($documentId: ID!, $data: WorkPublicationInput!, $locale: I18NLocaleCode) {
    updateWorkPublication(documentId: $documentId, data: $data, locale: $locale) {
      ...WorkPublicationFragment
    }
  }
`;

// Mutation for deleting publication
export const DELETE_PUBLICATION = `
  mutation DeletePublication($documentId: ID!, $locale: I18NLocaleCode) {
    deleteWorkPublication(documentId: $documentId, locale: $locale) {
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