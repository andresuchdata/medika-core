'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Stethoscope } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard')
    } else {
      // User is not logged in, redirect to login
      router.push('/login')
    }
  }, [router])

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Medika</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
