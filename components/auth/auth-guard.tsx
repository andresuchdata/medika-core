'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Shield, Lock } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRoles?: string[]
  fallbackPath?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requiredRoles = [], 
  fallbackPath
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Determine appropriate fallback path based on current route
  const getDefaultFallbackPath = () => {
    if (fallbackPath) return fallbackPath
    return pathname.startsWith('/mobile') ? '/mobile/login' : '/login'
  }

  useEffect(() => {
    // Skip auth checks for public routes
    if (!requireAuth) return

    // Wait for auth check to complete
    if (isLoading) return

    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsRedirecting(true)
      
      // Store the attempted URL for redirect after login
      const returnUrl = pathname !== '/login' && pathname !== '/register' ? pathname : '/dashboard'
      localStorage.setItem('auth_return_url', returnUrl)
      
      // Redirect to login
      const redirectPath = getDefaultFallbackPath()
      setTimeout(() => {
        router.push(redirectPath)
      }, 1000)
      return
    }

    // Check role-based access
    if (requiredRoles.length > 0 && user) {
      if (!requiredRoles.includes(user.role)) {
        setIsRedirecting(true)
        
        // Redirect to appropriate dashboard based on role
        const redirectPath = user.role === 'patient' ? '/mobile/dashboard' : '/dashboard'
        setTimeout(() => {
          router.push(redirectPath)
        }, 1000)
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requiredRoles, pathname, router, fallbackPath])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Shield className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
            <CardTitle>Checking Authentication</CardTitle>
            <CardDescription>
              Please wait while we verify your credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-600">Verifying...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show redirect message
  if (isRedirecting) {
    const redirectReason = !isAuthenticated 
      ? 'Authentication required'
      : 'Insufficient permissions'
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Lock className="h-12 w-12 text-orange-600" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              {redirectReason}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-600">Redirecting...</span>
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-gray-500">
                You will be redirected to the login page
              </p>
            )}
            {isAuthenticated && requiredRoles.length > 0 && (
              <p className="text-xs text-gray-500">
                You will be redirected to your dashboard
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check for authentication and role requirements
  if (requireAuth && !isAuthenticated) {
    return null // Will be redirected
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return null // Will be redirected
  }

  return <>{children}</>
}

// Hook for role-based rendering
export function useRoleAccess() {
  const { user, isAuthenticated } = useAuth()

  const hasRole = (roles: string | string[]): boolean => {
    if (!isAuthenticated || !user) return false
    
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const isAdmin = () => hasRole('admin')
  const isDoctor = () => hasRole('doctor')
  const isNurse = () => hasRole('nurse')
  const isPatient = () => hasRole('patient')
  const isCashier = () => hasRole('cashier')
  const isStaff = () => hasRole(['admin', 'doctor', 'nurse', 'cashier'])

  return {
    user,
    isAuthenticated,
    hasRole,
    isAdmin,
    isDoctor,
    isNurse,
    isPatient,
    isCashier,
    isStaff
  }
}
