import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

// กำหนด URL ของ Strapi API จาก Environment Variables
// เพิ่มการแจ้งเตือนหากไม่ได้ตั้งค่า เพื่อช่วยในการดีบัก
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://kasetbackend.bomboonsan.com/api'
if (API_BASE === 'https://kasetbackend.bomboonsan.com/api') {
  console.warn('Warning: Using fallback Strapi API URL. Please set NEXT_PUBLIC_API_URL in your .env file.');
}

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
        // 1. ตรวจสอบว่ามี identifier และ password ส่งมาหรือไม่
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน')
        }

        try {
          // 2. ส่ง Request ไปยัง Strapi เพื่อทำการล็อกอิน และรับ JWT กลับมา
          const { data: loginData } = await axios.post(`${API_BASE}/auth/local`, {
            identifier: credentials.identifier,
            password: credentials.password,
          })

          if (!loginData.jwt) {
            throw new Error('Invalid JWT response from Strapi')
          }

          const { jwt, user: strapiUser } = loginData

          // 3. ใช้ JWT ที่ได้ ไปดึงข้อมูล user ฉบับเต็ม (พร้อมข้อมูล relations ทั้งหมด)
          // ปรับปรุง `populate` ให้เป็นแบบ Object Syntax ของ Strapi v4/v5 เพื่อความชัดเจน
          const { data: me } = await axios.get(`${API_BASE}/users/me`, {
            params: {
              populate: {
                profile: { populate: 'avatarUrl' },
                role: '*',
                organization: '*',
                faculty: '*',
                department: '*',
                academic_type: '*',
                participation_type: '*',
              }
            },
            headers: { Authorization: `Bearer ${jwt}` }
          })

          // 4. จัดรูปแบบข้อมูล (Flatten) เพื่อส่งกลับไปให้ NextAuth callback
          // ทำให้โครงสร้างข้อมูลฝั่ง Client ใช้งานง่ายขึ้น
          return {
            id: me.id,
            email: me.email,
            username: me.username,
            role: me.role?.name || 'authenticated',
            roleId: me.role?.id || null,
            jwt: jwt, // ส่ง JWT ไปด้วยเพื่อเก็บใน token
            profile: {
              firstNameTH: me.profile?.firstNameTH || null,
              lastNameTH: me.profile?.lastNameTH || null,
              academicPosition: me.profile?.academicPosition || null,
              // ดึง URL ของ avatar จากโครงสร้าง media library ของ Strapi v4
              avatarUrl: me.profile?.avatarUrl?.data?.attributes?.url || null,
              department: me.department?.name || null,
            }
          }

        } catch (error) {
          // ดักจับ Error จาก axios และส่งต่อข้อความที่ Strapi ส่งกลับมา
          // ทำให้หน้าบ้าน (Client) สามารถแสดงข้อความ Error ที่ถูกต้องได้ เช่น "Invalid identifier or password"
          const strapiError = error.response?.data?.error?.message || error.message || 'Authentication Failed'
          console.error('Authorize Error:', strapiError);
          throw new Error(strapiError)
        }
      }
    })
  ],
  callbacks: {
    // Callback นี้จะถูกเรียกหลังจาก authorize สำเร็จ
    // ข้อมูลจาก `user` (ที่ return จาก authorize) จะถูกส่งมาเพื่อเก็บใน token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleId = user.roleId;
        token.jwt = user.jwt;
        token.profile = user.profile;
        token.username = user.username;
      }
      return token
    },
    // Callback นี้จะถูกเรียกเมื่อมีการเรียกใช้ `useSession` หรือ `getSession`
    // เราจะคัดลอกข้อมูลจาก token มาใส่ใน session object
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        username: token.username,
        role: token.role,
        roleId: token.roleId,
        profile: token.profile,
      }
      // ส่ง JWT ไปพร้อมกับ session เพื่อให้ Client สามารถใช้ยิง request ตรงไปหา Strapi ได้
      session.jwt = token.jwt;
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }