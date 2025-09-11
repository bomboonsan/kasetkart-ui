import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

// ตรวจสอบตัวแปรสภาพแวดล้อมหลายรูปแบบเพื่อให้เข้ากับโปรเจค
// Strapi ตัวโปรเจคมักตั้งเป็น NEXT_PUBLIC_API_BASE_URL หรือ NEXT_PUBLIC_API_URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_URL || 'http://localhost:1337/api'

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
        // ตรวจสอบ input เบื้องต้น
        if (!credentials?.identifier || !credentials?.password) {
          // ส่งข้อความเป็นภาษาอังกฤษเพราะ NextAuth จะส่งกลับใน error field
          throw new Error('Identifier and password are required')
        }

        try {
          // เรียก Strapi auth endpoint (จะต่อกับ API_BASE ซึ่งมักลงท้ายด้วย /api)
          const res = await axios.post(`${API_BASE}/auth/local`, {
            identifier: credentials.identifier,
            password: credentials.password,
          }, { headers: { 'Content-Type': 'application/json' } })

          const data = res.data
          if (!data || !data.jwt) {
            // ให้รายละเอียดข้อผิดพลาดเล็กน้อยแทนการคืนค่า null เงียบ ๆ
            const msg = data?.message || 'Invalid credentials'
            throw new Error(msg)
          }

          // ดึงข้อมูลผู้ใช้ที่ enrich จาก Strapi โดยส่ง JWT ที่ได้จากการล็อกอิน
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

          // สร้างอ็อบเจ็กต์ผู้ใช้ขนาดเล็กสำหรับเก็บใน session
          // หมายเหตุ: Strapi คืนค่า role เป็น relation object (มี id และ name)
          // แต่บางครั้งอาจได้ค่า role เป็นตัวเลขหรือตัวอักษรได้ด้วย
          // ดังนั้นให้เก็บทั้ง roleId และ role (ชื่อ) เพื่อให้ฝั่ง client ใช้งานได้ยืดหยุ่น
          const roleId = me.role?.id ?? (typeof me.role === 'number' ? me.role : null)
          const roleName = me.role?.name || (typeof me.role === 'string' ? me.role : null) || 'authenticated'

          return {
            id: me.id,
            email: me.email,
            username: me.username,
            role: roleName,
            roleId: roleId,
            jwt: data.jwt,
            profile: {
              firstNameTH: me.profile?.firstNameTH || '',
              lastNameTH: me.profile?.lastNameTH || '',
              academicPosition: me.profile?.academicPosition || '',
              // avatarUrl อาจเป็น media object หรือ string URL
              avatarUrl: me.profile?.avatarUrl || (me.profile?.avatarUrl?.data?.attributes?.url) || null,
              department: me.department?.name || null,
            }
          }
        } catch (err) {
          // บันทึกข้อผิดพลาดเพื่อการดีบั๊ก (จะไม่แสดงใน production logs โดยไม่ตั้งค่า)
          console.error('NextAuth authorize error:', err?.message || err)
          // โยน error ให้ NextAuth คืน 401 กับ client และส่งข้อความกลับใน result.error
          // คอมเมนต์ (ไทย): แก้ไขการเข้าถึง message ของ error ให้ถูกต้องตามโครงสร้างของ Strapi v4/v5
          throw new Error(err?.response?.data?.error?.message || err?.message || 'Authentication failed')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
  token.roleId = user.roleId ?? null
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
  roleId: token.roleId ?? null,
        profile: token.profile,
      }
      session.jwt = token.jwt
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
