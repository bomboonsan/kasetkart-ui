import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kasetbackend.bomboonsan.com/api'

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_BASE}/auth/local`, {
            identifier: credentials.identifier,
            password: credentials.password,
          })
          const data = res.data
          if (!data || !data.jwt) return null

          // fetch enriched user with profile + role
          const meRes = await axios.get(`${API_BASE}/users/me`, {
            params: {
              'populate[profile][populate]': 'avatarUrl',
              'populate[role]': '*',
              'populate[organization]': '*',
              'populate[faculty]': '*',
              'populate[department]': '*',
              'populate[academic_type]': '*',
              'populate[participation_type]': '*',
            },
            headers: { Authorization: `Bearer ${data.jwt}` }
          })
          const me = meRes.data

            // Build a compact user object for the session
          return {
            id: me.id,
            email: me.email,
            username: me.username,
            role: me.role?.name || me.role?.type || 'authenticated',
            jwt: data.jwt,
            profile: {
              firstNameTH: me.profile?.firstNameTH || '',
              lastNameTH: me.profile?.lastNameTH || '',
              academicPosition: me.profile?.academicPosition || '',
              avatarUrl: me.profile?.avatarUrl || null,
              department: me.department?.name || null,
            }
          }
        } catch (e) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.jwt = user.jwt
        token.profile = user.profile
        token.email = user.email
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
        profile: token.profile,
      }
      session.jwt = token.jwt
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
