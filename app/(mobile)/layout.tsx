'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { MobileHeader } from '@/components/mobile/mobile-header'
import { MobileBottomNav } from '@/components/mobile/mobile-bottom-nav'
import { MobileMenu } from '@/components/mobile/mobile-menu'
import { SwipeIndicator } from '@/components/mobile/swipe-indicator'
import { DeviceMismatchWarning } from '@/components/route-guard'
import { useMobileMenu } from '@/lib/stores'
import { AuthGuard } from '@/components/auth/auth-guard'

interface MobileLayoutProps {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenu()
  const pathname = usePathname()

  const handleCloseMenu = () => {
    setMobileMenuOpen(false)
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/mobile/login',
    '/mobile/register'
  ]

  // Check if current route requires authentication
  const requiresAuth = !publicRoutes.includes(pathname)

  // For public routes, render without AuthGuard
  if (!requiresAuth) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Device mismatch warning */}
        <DeviceMismatchWarning />
        
        {/* Main content - full height, scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    )
  }

  // For protected routes, render with AuthGuard and full mobile layout
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Device mismatch warning */}
        <DeviceMismatchWarning />
        
        {/* Mobile header - compact and simple */}
        <MobileHeader />
        
        {/* Mobile menu overlay - managed by global state */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={handleCloseMenu}
        />
        
        {/* Swipe indicator - shows user how to open menu */}
        <SwipeIndicator onClick={() => setMobileMenuOpen(true)} />
        
        {/* Main content - full height, scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-2 py-4">
          {children}
        </main>
        
        {/* Bottom navigation - mobile standard */}
        <MobileBottomNav />
      </div>
    </AuthGuard>
  )
}
