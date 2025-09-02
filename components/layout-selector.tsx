'use client'

import { useEffect, useState } from 'react'
import { useDevice } from '@/lib/stores'
import { useRouter, usePathname } from 'next/navigation'

interface LayoutSelectorProps {
  children: React.ReactNode
}

export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { getAppropriateRoute } = useDevice()
  const router = useRouter()
  const pathname = usePathname()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Only redirect on initial page load, not on subsequent navigation
    if (hasInitialized || pathname.startsWith('/api')) return

    const targetRoute = getAppropriateRoute(pathname)
    
    if (targetRoute && targetRoute !== pathname) {
      router.push(targetRoute)
    }

    // Mark as initialized to prevent further redirects
    setHasInitialized(true)
  }, [getAppropriateRoute, pathname, router, hasInitialized])

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
