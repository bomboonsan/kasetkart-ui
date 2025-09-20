// GraphQL Auth API queries for Strapi v5
import { USER_COMPLETE_FRAGMENT } from '../fragments.js';

// Auth login mutation
export const LOGIN_MUTATION = `
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
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

// Auth register mutation
export const REGISTER_MUTATION = `
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
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

// Get current user query
export const ME_QUERY = `
  ${USER_COMPLETE_FRAGMENT}
  
  query Me {
    me {
      ...UserComplete
    }
  }
`;

// Forgot password mutation
export const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

// Reset password mutation
export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($password: String!, $passwordConfirmation: String!, $code: String!) {
    resetPassword(password: $password, passwordConfirmation: $passwordConfirmation, code: $code) {
      jwt
      user {
        id
        documentId
        username
        email
      }
    }
  }
`;

// Change password mutation
export const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($currentPassword: String!, $password: String!, $passwordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, password: $password, passwordConfirmation: $passwordConfirmation) {
      jwt
      user {
        id
        documentId
        username
        email
      }
    }
  }
`;