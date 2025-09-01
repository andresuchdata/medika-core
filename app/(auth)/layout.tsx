import { ReactNode } from 'react'
import { DeviceMismatchWarning } from '@/components/route-guard'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Device mismatch warning */}
      <DeviceMismatchWarning />
      
      {children}
    </div>
  )
}
