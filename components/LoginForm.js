import Image from 'next/image'
import InputField from './InputField'
import Button from './Button'
import Checkbox from './Checkbox'
import Link from 'next/link'

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Handle login logic
    console.log('Login submitted')
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
      <form className="space-y-6">
        <InputField
          label="Email address"
          type="email"
          id="email"
          name="email"
          required
        />

        <InputField
          label="Password"
          type="password"
          id="password"
          name="password"
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
        <Link
          href="/dashboard/form/overview"
        >
        <Button type="submit" fullWidth>
          Sign in
        </Button>
        </Link>
      </form>
    </div>
  )
}
