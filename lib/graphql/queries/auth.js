// GraphQL queries for authentication
import { gql } from 'graphql-request'
import { USER_FRAGMENT } from './user'

// Mutation: Login
export const LOGIN = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`

// Mutation: Register
export const REGISTER = gql`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`

// Query: Get current user (me)
export const ME = gql`
  query Me {
    me {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`

// Mutation: Forgot password
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`

// Mutation: Reset password
export const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $passwordConfirmation: String!, $code: String!) {
    resetPassword(password: $password, passwordConfirmation: $passwordConfirmation, code: $code) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`

// Mutation: Change password
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $password: String!, $passwordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, password: $password, passwordConfirmation: $passwordConfirmation) {
      jwt
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`