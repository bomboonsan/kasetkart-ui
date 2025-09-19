"use client"
import Image from 'next/image'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: session } = useSession()
  useEffect(() => {
    if (session?.user) {
      const next = searchParams.get('next')
      const role = session.user.role
      if (role === 'Admin' || role === 'Super admin') {
        router.replace(next || '/dashboard')
      } else {
        router.replace(next || '/profile')
      }
    }
  }, [session, router, searchParams])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      })
      // NextAuth จะคืนค่า result.error เมื่อ authorize ทำนองเดียวกับ 401
      if (result?.error) {
        // แสดงข้อความข้อผิดพลาดจาก NextAuth ถ้ามี เพื่อช่วย debug
        setError(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      // กรณี exception ให้โชว์ข้อความแบบสั้น
      setError(err?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center">
          <Image
                        src="/Logo.png"
                        alt="KU Logo"
                        width={120}
                        height={120}
                        className="mb-4"
                        unoptimized
                      />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          เข้าสู่ระบบ
        </h1>
      </div>

      {/* Form Section */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        <InputField
          label="อีเมลหรือชื่อผู้ใช้"
          type="text"
          id="identifier"
          name="identifier"
          value={formData.identifier}
          onChange={(value) => setFormData(prev => ({ ...prev, identifier: value }))}
          required
        />

        <InputField
          label="รหัสผ่าน"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          required
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'เข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </Button>
      </form>
    </div>
  )
}
