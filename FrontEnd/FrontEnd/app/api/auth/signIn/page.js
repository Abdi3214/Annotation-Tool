'use client'
import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const token = await getCsrfToken()
      setCsrfToken(token ?? '')
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/'
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError(res.error ?? 'Login failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 shadow-md w-96 rounded-lg space-y-6 p-6"
      >
        <h1 className="text-center text-3xl font-medium">Login</h1>

        {/* hidden CSRF token field */}
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        {/* email input */}
        <input
          name="email"
          type="email"
          placeholder="Enter Email"
          required
          className="border border-gray-300 focus:outline-none p-2 rounded w-full"
        />

        {/* password input */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border border-gray-300 focus:outline-none p-2 rounded w-full"
        />

        {/* submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-medium"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}
