'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { DeviceMismatchWarning } from '@/components/route-guard'
import { useSidebar } from '@/lib/context/ui-context'
import { AuthGuard } from '@/components/auth/auth-guard'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useSidebar()

  return (
    <AuthGuard requireAuth={true} requiredRoles={['admin', 'doctor', 'nurse', 'cashier']}>
      <div className="flex h-screen bg-gray-50">
        {/* Device mismatch warning */}
        <DeviceMismatchWarning />
        
        {/* Sidebar - with toggle state */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content area - dynamic width based on sidebar state */}
        <div className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-48' : 'lg:ml-16'}
        `}>
          {/* Header - sticky, not fixed */}
          <Header />
          
          {/* Main content - scrollable with proper spacing */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
