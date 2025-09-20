# API Migration Plan: REST to GraphQL

This document outlines the plan for migrating the application's backend communication from a RESTful API to a GraphQL API.

## 1. REST API Endpoint Analysis

The following is a summary of the REST API endpoints currently in use, as determined from the `full_documentation.json` OpenAPI specification.

### Authentication

| Method | Path                  | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | /api/auth/local       | Local authentication     |
| GET    | /api/auth/{provider}/callback | OAuth callback         |
| POST   | /api/auth/forgot-password | Forgot password          |
| POST   | /api/auth/reset-password | Reset password           |
| POST   | /api/auth/send-email-confirmation | Resend email confirmation |
| POST   | /api/auth/change-password | Change password (authenticated) |

### Users

| Method | Path                  | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | /api/users            | Get all users            |
| GET    | /api/users/{id}       | Get a single user        |
| POST   | /api/users            | Create a new user        |
| PUT    | /api/users/{id}       | Update a user            |
| DELETE | /api/users/{id}       | Delete a user            |
| GET    | /api/users/me         | Get the current user     |

### Profiles

| Method | Path                  | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | /api/profiles         | Get all profiles         |
| GET    | /api/profiles/{id}    | Get a single profile     |
| POST   | /api/profiles         | Create a new profile     |
| PUT    | /api/profiles/{id}    | Update a profile         |
| DELETE | /api/profiles/{id}    | Delete a profile         |

### Other Content Types

The following content types are also managed via the REST API. Each of these will need to be migrated to GraphQL.

- `academic-types`
- `departments`
- `education-levels`
- `faculties`
- `funding-book-partners`
- `funding-partners`
- `ic-types`
- `impacts`
- `organizations`
- `participation-types`
- `project-fundings`
- `project-partners`
- `project-researches`
- `sdgs`
- `work-books`
- `work-conferences`
- `work-publications`

## 2. GraphQL Migration Strategy

The migration will be performed on a per-model basis. For each of the content types listed above, the following steps will be taken:

1.  **Define GraphQL Queries and Mutations:** For each REST endpoint, a corresponding GraphQL query or mutation will be defined.
2.  **Implement GraphQL API:** The defined queries and mutations will be implemented in the Strapi backend.
3.  **Refactor Frontend Code:** The frontend code will be refactored to use the new GraphQL API instead of the legacy REST endpoints.
4.  **Remove Obsolete REST Code:** Once a model has been fully migrated, the corresponding REST API code will be removed.

### Example: User Migration

#### Queries

**Get all users:**

```graphql
query GetUsers {
  usersPermissionsUsers {
    data {
      id
      attributes {
        username
        email
        confirmed
        blocked
      }
    }
  }
}
```

**Get a single user:**

```graphql
query GetUser($id: ID!) {
  usersPermissionsUser(id: $id) {
    data {
      id
      attributes {
        username
        email
        confirmed
        blocked
      }
    }
  }
}
```

#### Mutations

**Create a new user:**

```graphql
mutation CreateUser($data: UsersPermissionsUserInput!) {
  createUsersPermissionsUser(data: $data) {
    data {
      id
    }
  }
}
```

**Update a user:**

```graphql
mutation UpdateUser($id: ID!, $data: UsersPermissionsUserInput!) {
  updateUsersPermissionsUser(id: $id, data: $data) {
    data {
      id
    }
  }
}
```

**Delete a user:**

```graphql
mutation DeleteUser($id: ID!) {
  deleteUsersPermissionsUser(id: $id) {
    data {
      id
    }
  }
}
```

This process will be repeated for all content types until the entire API has been migrated to GraphQL.

### Authentication

**Login:**

```graphql
mutation Login($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    jwt
    user {
      id
      username
      email
    }
  }
}
```

**Forgot Password:**

```graphql
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    ok
  }
}
```

**Reset Password:**

```graphql
mutation ResetPassword($password: String!, $passwordConfirmation: String!, $code: String!) {
  resetPassword(
    password: $password
    passwordConfirmation: $passwordConfirmation
    code: $code
  ) {
    jwt
    user {
      id
      username
      email
    }
  }
}
```

**Change Password:**

```graphql
mutation ChangePassword($password: String!, $passwordConfirmation: String!, $currentPassword: String!) {
  changePassword(
    password: $password
    passwordConfirmation: $passwordConfirmation
    currentPassword: $currentPassword
  ) {
    jwt
    user {
      id
      username
      email
    }
  }
}
```

### Profile Management

**Get My Profile (Sidebar):**

```graphql
query GetMyProfileSidebar {
  me {
    id
    username
    profile {
      id
      avatarUrl {
        id
        url
      }
    }
    role {
      id
      name
    }
  }
}
```

**Get My Profile (Full):**

```graphql
query GetMyProfileFull {
  me {
    id
    username
    email
    profile {
      id
      firstNameTH
      lastNameTH
      firstNameEN
      lastNameEN
      academicPosition
      highDegree
      telephoneNo
      avatarUrl {
        id
        url
      }
    }
    organization {
      id
      name
    }
    faculty {
      id
      name
    }
    department {
      id
      name
    }
    academic_type {
      id
      name
    }
    participation_type {
      id
      name
    }
    educations {
      id
      education_level {
        id
        name
      }
      name
      faculty
      year
    }
  }
}
```

**Get User By ID (for Admin):**

```graphql
query GetUserById($id: ID!) {
  usersPermissionsUser(id: $id) {
    data {
      id
      attributes {
        username
        email
        profile {
          data {
            id
            attributes {
              firstNameTH
              lastNameTH
              firstNameEN
              lastNameEN
              academicPosition
              highDegree
              telephoneNo
              avatarUrl {
                data {
                  id
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
        organization {
          data {
            id
            attributes {
              name
            }
          }
        }
        faculty {
          data {
            id
            attributes {
              name
            }
          }
        }
        department {
          data {
            id
            attributes {
              name
            }
          }
        }
        academic_type {
          data {
            id
            attributes {
              name
            }
          }
        }
        participation_type {
          data {
            id
            attributes {
              name
            }
          }
        }
        educations {
          data {
            id
            attributes {
              education_level {
                data {
                  id
                  attributes {
                    name
                  }
                }
              }
              name
              faculty
              year
            }
          }
        }
      }
    }
  }
}
```

**Update User Profile:**

```graphql
mutation UpdateUserProfile($id: ID!, $data: UsersPermissionsUserInput!) {
  updateUsersPermissionsUser(id: $id, data: $data) {
    data {
      id
    }
  }
}
```

