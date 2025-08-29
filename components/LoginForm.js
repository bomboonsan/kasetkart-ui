"use client"
import Image from 'next/image'
import InputField from './InputField'
import Button from './Button'
import Checkbox from './Checkbox'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      console.log(`email : ${email}`)
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบล้มเหลว')
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
          Sign in to your account
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
          label="Email address"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={setEmail}
          required
        />

        <InputField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={setPassword}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="remember"
            name="remember"
            label="Remember me"
            checked={false}
          />
          
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
