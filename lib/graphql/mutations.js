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
