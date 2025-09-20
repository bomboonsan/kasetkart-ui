// โมดูล authAPI (GraphQL implementation)
import { executeGraphQL } from '../graphql'
import { 
  LOGIN,
  REGISTER,
  ME,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD
} from '../graphql/queries'
import { tokenManager } from '../auth/token-manager'

export const authAPI = {
  login: async (identifier, password) => {
    const input = { identifier, password }
    const result = await executeGraphQL(LOGIN, { input })
    
    if (result?.login?.jwt) {
      tokenManager.setToken(result.login.jwt)
    }
    
    return {
      jwt: result.login.jwt,
      user: result.login.user
    }
  },

  register: async (username, email, password) => {
    const input = { username, email, password }
    const result = await executeGraphQL(REGISTER, { input })
    
    if (result?.register?.jwt) {
      tokenManager.setToken(result.register.jwt)
    }
    
    return {
      jwt: result.register.jwt,
      user: result.register.user
    }
  },

  logout: () => {
    tokenManager.removeToken()
  },

  me: async () => {
    const result = await executeGraphQL(ME)
    return result.me
  },

  forgotPassword: async (email) => {
    const result = await executeGraphQL(FORGOT_PASSWORD, { email })
    return result.forgotPassword
  },

  resetPassword: async (code, password, passwordConfirmation) => {
    const result = await executeGraphQL(RESET_PASSWORD, { code, password, passwordConfirmation })
    
    if (result?.resetPassword?.jwt) {
      tokenManager.setToken(result.resetPassword.jwt)
    }
    
    return {
      jwt: result.resetPassword.jwt,
      user: result.resetPassword.user
    }
  },

  changePassword: async (currentPassword, password, passwordConfirmation) => {
    const result = await executeGraphQL(CHANGE_PASSWORD, { currentPassword, password, passwordConfirmation })
    
    if (result?.changePassword?.jwt) {
      tokenManager.setToken(result.changePassword.jwt)
    }
    
    return {
      jwt: result.changePassword.jwt,
      user: result.changePassword.user
    }
  },
}
