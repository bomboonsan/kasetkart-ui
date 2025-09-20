// GraphQL queries for works (books, conferences, publications)
import { gql } from 'graphql-request'

// Work book fragments
export const WORK_BOOK_FRAGMENT = gql`
  fragment WorkBookFragment on WorkBook {
    id
    documentId
    title
    description
    publishedDate
    publisher
    isbn
    pages
    language
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

// Work conference fragments
export const WORK_CONFERENCE_FRAGMENT = gql`
  fragment WorkConferenceFragment on WorkConference {
    id
    documentId
    title
    description
    conferenceDate
    location
    organizer
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
    project_research {
      id
      documentId
      title
      research_partners {
        data {
          id
          documentId
          users_permissions_user {
            id
            documentId
            username
            email
          }
        }
      }
    }
    createdAt
    updatedAt
    publishedAt
  }
`

// Work publication fragments
export const WORK_PUBLICATION_FRAGMENT = gql`
  fragment WorkPublicationFragment on WorkPublication {
    id
    documentId
    title
    description
    journalName
    volume
    issue
    pages
    publishedDate
    doi
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

// BOOKS QUERIES

// Query: Get books with filters
export const GET_BOOKS = gql`
  query GetBooks(
    $filters: WorkBookFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    workBooks(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...WorkBookFragment
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
  ${WORK_BOOK_FRAGMENT}
`

// Query: Get my books
export const GET_MY_BOOKS = gql`
  query GetMyBooks($userId: ID!) {
    workBooks(
      filters: {
        users_permissions_user: {
          id: { eq: $userId }
        }
      }
    ) {
      data {
        ...WorkBookFragment
      }
    }
  }
  ${WORK_BOOK_FRAGMENT}
`

// Query: Get book by ID
export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    workBook(id: $id) {
      ...WorkBookFragment
    }
  }
  ${WORK_BOOK_FRAGMENT}
`

// Mutation: Create book
export const CREATE_BOOK = gql`
  mutation CreateBook($data: WorkBookInput!) {
    createWorkBook(data: $data) {
      data {
        ...WorkBookFragment
      }
    }
  }
  ${WORK_BOOK_FRAGMENT}
`

// Mutation: Update book
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $data: WorkBookInput!) {
    updateWorkBook(id: $id, data: $data) {
      data {
        ...WorkBookFragment
      }
    }
  }
  ${WORK_BOOK_FRAGMENT}
`

// Mutation: Delete book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteWorkBook(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`

// CONFERENCES QUERIES

// Query: Get conferences with filters
export const GET_CONFERENCES = gql`
  query GetConferences(
    $filters: WorkConferenceFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    workConferences(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...WorkConferenceFragment
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
  ${WORK_CONFERENCE_FRAGMENT}
`

// Query: Get my conferences (by user participation in project research)
export const GET_MY_CONFERENCES = gql`
  query GetMyConferences($userId: ID!) {
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
      data {
        ...WorkConferenceFragment
      }
    }
  }
  ${WORK_CONFERENCE_FRAGMENT}
`

// Query: Get conference by ID
export const GET_CONFERENCE = gql`
  query GetConference($id: ID!) {
    workConference(id: $id) {
      ...WorkConferenceFragment
    }
  }
  ${WORK_CONFERENCE_FRAGMENT}
`

// Mutation: Create conference
export const CREATE_CONFERENCE = gql`
  mutation CreateConference($data: WorkConferenceInput!) {
    createWorkConference(data: $data) {
      data {
        ...WorkConferenceFragment
      }
    }
  }
  ${WORK_CONFERENCE_FRAGMENT}
`

// Mutation: Update conference
export const UPDATE_CONFERENCE = gql`
  mutation UpdateConference($id: ID!, $data: WorkConferenceInput!) {
    updateWorkConference(id: $id, data: $data) {
      data {
        ...WorkConferenceFragment
      }
    }
  }
  ${WORK_CONFERENCE_FRAGMENT}
`

// Mutation: Delete conference
export const DELETE_CONFERENCE = gql`
  mutation DeleteConference($id: ID!) {
    deleteWorkConference(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`

// PUBLICATIONS QUERIES

// Query: Get publications with filters
export const GET_PUBLICATIONS = gql`
  query GetPublications(
    $filters: WorkPublicationFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    workPublications(
      filters: $filters
      pagination: $pagination
      sort: $sort
    ) {
      data {
        ...WorkPublicationFragment
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
  ${WORK_PUBLICATION_FRAGMENT}
`

// Query: Get my publications
export const GET_MY_PUBLICATIONS = gql`
  query GetMyPublications($userId: ID!) {
    workPublications(
      filters: {
        users_permissions_user: {
          id: { eq: $userId }
        }
      }
    ) {
      data {
        ...WorkPublicationFragment
      }
    }
  }
  ${WORK_PUBLICATION_FRAGMENT}
`

// Query: Get publication by ID
export const GET_PUBLICATION = gql`
  query GetPublication($id: ID!) {
    workPublication(id: $id) {
      ...WorkPublicationFragment
    }
  }
  ${WORK_PUBLICATION_FRAGMENT}
`

// Mutation: Create publication
export const CREATE_PUBLICATION = gql`
  mutation CreatePublication($data: WorkPublicationInput!) {
    createWorkPublication(data: $data) {
      data {
        ...WorkPublicationFragment
      }
    }
  }
  ${WORK_PUBLICATION_FRAGMENT}
`

// Mutation: Update publication
export const UPDATE_PUBLICATION = gql`
  mutation UpdatePublication($id: ID!, $data: WorkPublicationInput!) {
    updateWorkPublication(id: $id, data: $data) {
      data {
        ...WorkPublicationFragment
      }
    }
  }
  ${WORK_PUBLICATION_FRAGMENT}
`

// Mutation: Delete publication
export const DELETE_PUBLICATION = gql`
  mutation DeletePublication($id: ID!) {
    deleteWorkPublication(id: $id) {
      data {
        id
        documentId
      }
    }
  }
`