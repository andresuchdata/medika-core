'use client'

import { ReactNode } from 'react'
import { MobileHeader } from '@/components/mobile/mobile-header'
import { MobileBottomNav } from '@/components/mobile/mobile-bottom-nav'
import { MobileMenu } from '@/components/mobile/mobile-menu'
import { SwipeIndicator } from '@/components/mobile/swipe-indicator'
import { DeviceMismatchWarning } from '@/components/route-guard'
import { useUI } from '@/lib/context/ui-context'

interface MobileLayoutProps {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { state: { mobileMenuOpen }, setMobileMenuOpen } = useUI()

  const handleCloseMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
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
      <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        {children}
      </main>
      
      {/* Bottom navigation - mobile standard */}
      <MobileBottomNav />
    </div>
  )
}
