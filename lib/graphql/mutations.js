export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          email
          username
          confirmed
          blocked
        }
      }
    }
  }
`

export const CREATE_USER_MUTATION = `
  mutation CreateUser($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data) {
      data {
        id
        attributes {
          email
          username
          confirmed
          blocked
        }
      }
    }
  }
`

export const CREATE_PROFILE_MUTATION = `
  mutation CreateProfile($data: ProfileInput!) {
    createProfile(data: $data) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($documentId: ID!, $data: ProfileInput!) {
    updateProfile(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Education mutations
export const CREATE_EDUCATION_MUTATION = `
  mutation CreateEducation($data: EducationInput!) {
    createEducation(data: $data) {
      data {
        id
        attributes {
          documentId
          name
          faculty
          year
          education_level {
            data {
              id
              attributes {
                documentId
                name
              }
            }
          }
        }
      }
    }
  }
`

export const UPDATE_EDUCATION_MUTATION = `
  mutation UpdateEducation($documentId: ID!, $data: EducationInput!) {
    updateEducation(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          name
          faculty
          year
          education_level {
            data {
              id
              attributes {
                documentId
                name
              }
            }
          }
        }
      }
    }
  }
`

export const DELETE_EDUCATION_MUTATION = `
  mutation DeleteEducation($documentId: ID!) {
    deleteEducation(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Project Research mutations
export const CREATE_PROJECT_RESEARCH_MUTATION = `
  mutation CreateProjectResearch($data: ProjectResearchInput!) {
    createProjectResearch(data: $data) {
      data {
        id
        attributes {
          documentId
          title
          description
          objectives
          methodology
          expectedResults
          budget
          startDate
          endDate
          status
          researchType
          researchCategory
        }
      }
    }
  }
`

export const UPDATE_PROJECT_RESEARCH_MUTATION = `
  mutation UpdateProjectResearch($documentId: ID!, $data: ProjectResearchInput!) {
    updateProjectResearch(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          title
          description
          objectives
          methodology
          expectedResults
          budget
          startDate
          endDate
          status
          researchType
          researchCategory
        }
      }
    }
  }
`

export const DELETE_PROJECT_RESEARCH_MUTATION = `
  mutation DeleteProjectResearch($documentId: ID!) {
    deleteProjectResearch(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Project Partner mutations
export const CREATE_PROJECT_PARTNER_MUTATION = `
  mutation CreateProjectPartner($data: ProjectPartnerInput!) {
    createProjectPartner(data: $data) {
      data {
        id
        attributes {
          documentId
          role
          contribution
        }
      }
    }
  }
`

export const UPDATE_PROJECT_PARTNER_MUTATION = `
  mutation UpdateProjectPartner($documentId: ID!, $data: ProjectPartnerInput!) {
    updateProjectPartner(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          role
          contribution
        }
      }
    }
  }
`

export const DELETE_PROJECT_PARTNER_MUTATION = `
  mutation DeleteProjectPartner($documentId: ID!) {
    deleteProjectPartner(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Project Funding mutations
export const CREATE_PROJECT_FUNDING_MUTATION = `
  mutation CreateProjectFunding($data: ProjectFundingInput!) {
    createProjectFunding(data: $data) {
      data {
        id
        attributes {
          documentId
          title
          amount
          currency
          fundingSource
          fundingType
          startDate
          endDate
          status
          description
        }
      }
    }
  }
`

export const UPDATE_PROJECT_FUNDING_MUTATION = `
  mutation UpdateProjectFunding($documentId: ID!, $data: ProjectFundingInput!) {
    updateProjectFunding(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          title
          amount
          currency
          fundingSource
          fundingType
          startDate
          endDate
          status
          description
        }
      }
    }
  }
`

export const DELETE_PROJECT_FUNDING_MUTATION = `
  mutation DeleteProjectFunding($documentId: ID!) {
    deleteProjectFunding(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Work Book mutations
export const CREATE_WORK_BOOK_MUTATION = `
  mutation CreateWorkBook($data: WorkBookInput!) {
    createWorkBook(data: $data) {
      data {
        id
        attributes {
          documentId
          title
          isbn
          publisher
          publicationDate
          pageCount
          language
          description
          authors
        }
      }
    }
  }
`

export const UPDATE_WORK_BOOK_MUTATION = `
  mutation UpdateWorkBook($documentId: ID!, $data: WorkBookInput!) {
    updateWorkBook(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          title
          isbn
          publisher
          publicationDate
          pageCount
          language
          description
          authors
        }
      }
    }
  }
`

export const DELETE_WORK_BOOK_MUTATION = `
  mutation DeleteWorkBook($documentId: ID!) {
    deleteWorkBook(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Work Conference mutations
export const CREATE_WORK_CONFERENCE_MUTATION = `
  mutation CreateWorkConference($data: WorkConferenceInput!) {
    createWorkConference(data: $data) {
      data {
        id
        attributes {
          documentId
          title
          conferenceName
          location
          conferenceDate
          presentationType
          description
        }
      }
    }
  }
`

export const UPDATE_WORK_CONFERENCE_MUTATION = `
  mutation UpdateWorkConference($documentId: ID!, $data: WorkConferenceInput!) {
    updateWorkConference(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          title
          conferenceName
          location
          conferenceDate
          presentationType
          description
        }
      }
    }
  }
`

export const DELETE_WORK_CONFERENCE_MUTATION = `
  mutation DeleteWorkConference($documentId: ID!) {
    deleteWorkConference(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`

// Work Publication mutations
export const CREATE_WORK_PUBLICATION_MUTATION = `
  mutation CreateWorkPublication($data: WorkPublicationInput!) {
    createWorkPublication(data: $data) {
      data {
        id
        attributes {
          documentId
          title
          journal
          volume
          issue
          pages
          publicationDate
          doi
          abstractText
          keywords
          authors
        }
      }
    }
  }
`

export const UPDATE_WORK_PUBLICATION_MUTATION = `
  mutation UpdateWorkPublication($documentId: ID!, $data: WorkPublicationInput!) {
    updateWorkPublication(documentId: $documentId, data: $data) {
      data {
        id
        attributes {
          documentId
          title
          journal
          volume
          issue
          pages
          publicationDate
          doi
          abstractText
          keywords
          authors
        }
      }
    }
  }
`

export const DELETE_WORK_PUBLICATION_MUTATION = `
  mutation DeleteWorkPublication($documentId: ID!) {
    deleteWorkPublication(documentId: $documentId) {
      data {
        id
        attributes {
          documentId
        }
      }
    }
  }
`
