'use client'

import { useEffect, useState } from 'react'
import { useDevice } from '@/lib/stores'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smartphone, Monitor, Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { getAppropriateRoute, deviceType } = useDevice()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  useEffect(() => {
    // Skip API routes and static assets
    if (pathname.startsWith('/api') || pathname.includes('.')) {
      return
    }

    const targetRoute = getAppropriateRoute(pathname)

    if (targetRoute && targetRoute !== pathname) {
      setIsRedirecting(true)
      setRedirectPath(targetRoute)

      // Small delay to show the redirect message
      setTimeout(() => {
        router.push(targetRoute)
      }, 800)
    }
  }, [getAppropriateRoute, pathname, router])

  // Show redirect message
  if (isRedirecting && redirectPath) {
    const isRedirectingToMobile = redirectPath.startsWith('/mobile')
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {isRedirectingToMobile ? (
                <Smartphone className="h-12 w-12 text-blue-600" />
              ) : (
                <Monitor className="h-12 w-12 text-green-600" />
              )}
            </div>
            <CardTitle>
              Redirecting to {isRedirectingToMobile ? 'Mobile' : 'Desktop'} View
            </CardTitle>
            <CardDescription>
              Detected {deviceType} device, switching to appropriate layout
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-600">Redirecting...</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>From: {pathname}</p>
              <p>To: {redirectPath}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={() => {
                setIsRedirecting(false)
                setRedirectPath(null)
                router.push(redirectPath)
              }}
            >
              Continue Manually
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Hook to check if current route is appropriate for device
export function useRouteGuard() {
  const { deviceType, isMobile, isTablet, isDesktop, getAppropriateRoute } = useDevice()
  const pathname = usePathname()

  const isRouteAppropriate = () => {
    if (isMobile || isTablet) {
      return pathname.startsWith('/mobile')
    }
    if (isDesktop) {
      return pathname.startsWith('/dashboard') || pathname === '/'
    }
    return true
  }

  const appropriateRoute = getAppropriateRoute(pathname)

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    currentPath: pathname,
    isRouteAppropriate: isRouteAppropriate(),
    appropriateRoute,
    shouldRedirect: appropriateRoute !== null && appropriateRoute !== pathname
  }
}

// Component to show device mismatch warning
export function DeviceMismatchWarning() {
  const { shouldRedirect, appropriateRoute, deviceType, currentPath } = useRouteGuard()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render on server to prevent hydration mismatch
  if (!isClient || !shouldRedirect) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Monitor className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Device Mismatch Detected
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            You're on a {deviceType} device but viewing the {currentPath.startsWith('/mobile') ? 'mobile' : 'desktop'} layout.
          </p>
          <div className="mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = appropriateRoute || '/'}
            >
              Switch to {appropriateRoute?.startsWith('/mobile') ? 'Mobile' : 'Desktop'} View
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
