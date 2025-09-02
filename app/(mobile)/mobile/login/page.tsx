'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

export default function MobileLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading, isAuthenticated } = useAuth()

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = searchParams.get('returnUrl') || 
                       localStorage.getItem('auth_return_url') || 
                       '/mobile/dashboard'
      localStorage.removeItem('auth_return_url')
      router.push(returnUrl)
    }
  }, [isAuthenticated, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      // Get return URL and redirect
      const returnUrl = searchParams.get('returnUrl') || 
                       localStorage.getItem('auth_return_url') || 
                       '/mobile/dashboard'
      localStorage.removeItem('auth_return_url')
      router.push(returnUrl)
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Sign In</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Sign in to access your medical account
          </p>
        </div>

        {/* Login form */}
        <Card className="mx-auto w-full max-w-sm shadow-xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 text-base pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/mobile/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials - Mobile optimized */}
        <div className="mt-8 mx-auto w-full max-w-sm">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800">Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2">
                  <p className="font-medium text-blue-800">Admin</p>
                  <p className="text-blue-600 truncate">admin@medika.com</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="font-medium text-blue-800">Doctor</p>
                  <p className="text-blue-600 truncate">doctor.smith@medika.com</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="font-medium text-blue-800">Nurse</p>
                  <p className="text-blue-600 truncate">nurse.wilson@medika.com</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="font-medium text-blue-800">Patient</p>
                  <p className="text-blue-600 truncate">patient.john@email.com</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 text-center mt-2">
                All passwords: <span className="font-mono">password123</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
