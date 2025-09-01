'use client'

import { useEffect, useState } from 'react'
import { useDevice } from '@/lib/utils/device'
import { useRouter, usePathname } from 'next/navigation'

interface LayoutSelectorProps {
  children: React.ReactNode
}

export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { deviceType, isMobile } = useDevice()
  const router = useRouter()
  const pathname = usePathname()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Only redirect on initial page load, not on subsequent navigation
    if (hasInitialized || pathname.startsWith('/api')) return

    // Check if we need to redirect based on device type
    const shouldRedirectToMobile = isMobile && !pathname.startsWith('/mobile')
    const shouldRedirectToDesktop = !isMobile && pathname.startsWith('/mobile')

    // Redirect to mobile for all dashboard routes and root routes
    const shouldRedirectToMobileRoute = shouldRedirectToMobile && (
      pathname === '/' || 
      pathname === '/login' || 
      pathname === '/register' ||
      pathname.startsWith('/dashboard')
    )
    
    if (shouldRedirectToMobileRoute) {
      const mobilePath = `/mobile${pathname}`
      router.push(mobilePath)
    } else if (shouldRedirectToDesktop && pathname.startsWith('/mobile')) {
      const desktopPath = pathname.replace('/mobile', '')
      router.push(desktopPath)
    } else {
    }

    // Mark as initialized to prevent further redirects
    setHasInitialized(true)
  }, [deviceType, isMobile, pathname, router, hasInitialized])

  // Force re-evaluation when device type changes
  useEffect(() => {
    if (hasInitialized && typeof window !== 'undefined') {
      const handleResize = () => {
        // Force a re-render by updating the state
        setHasInitialized(false)
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [hasInitialized])

  return <>{children}</>
}

// Hook to get the current layout type
export function useLayoutType() {
  const pathname = usePathname()
  const { isMobile } = useDevice()
  
  if (pathname.startsWith('/mobile')) {
    return 'mobile'
  }
  
  return isMobile ? 'mobile' : 'desktop'
}

// Component to conditionally render based on layout
export function ConditionalLayout({ 
  mobile, 
  desktop, 
  children 
}: { 
  mobile?: React.ReactNode
  desktop?: React.ReactNode
  children?: React.ReactNode
}) {
  const layoutType = useLayoutType()
  
  if (layoutType === 'mobile' && mobile) {
    return <>{mobile}</>
  }
  
  if (layoutType === 'desktop' && desktop) {
    return <>{children}</>
  }
  
  return <>{children}</>
}
