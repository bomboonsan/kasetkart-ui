import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* คอมเมนต์ (ไทย): เพิ่ม Suspense เพื่อรองรับ dynamic hook (useSearchParams) ใน LoginForm */}
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}