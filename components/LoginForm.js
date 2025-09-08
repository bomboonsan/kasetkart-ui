"use client"
import Image from 'next/image'
import InputField from './InputField'
import Button from './Button'
import Checkbox from './Checkbox'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // ถ้าล็อกอินแล้วให้ redirect ไป dashboard
    if (isAuthenticated()) {
      const next = searchParams.get('next')
      router.push(next || '/dashboard')
    }
  }, [router, searchParams])

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
      const response = await authAPI.login(formData.identifier, formData.password)
      
      if (response.jwt) {
        // Set cookie for middleware
        document.cookie = `jwt=${response.jwt}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        
        // Redirect to intended page or dashboard
        const next = searchParams.get('next')
        router.push(next || '/dashboard')
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch (err) {
      setError(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
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
            alt="Kasetsart University Logo"
            width={120}
            height={120}
            className="mb-4"
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
