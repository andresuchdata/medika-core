'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  X,
  Stethoscope,
  Building2,
  Bell,
  User,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/mobile/dashboard', icon: Home },
  { name: 'Patients', href: '/mobile/patients', icon: Users },
  { name: 'Doctors', href: '/mobile/doctors', icon: Stethoscope },
  { name: 'Appointments', href: '/mobile/appointments', icon: Calendar },
  { name: 'Queue', href: '/mobile/queue', icon: Clock },
  { name: 'Medical Records', href: '/mobile/records', icon: FileText },
  { name: 'Organizations', href: '/mobile/organizations', icon: Building2 },
  { name: 'Notifications', href: '/mobile/notifications', icon: Bell },
  { name: 'Settings', href: '/mobile/settings', icon: Settings },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[80] lg:hidden"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-[90] lg:hidden">
        {/* Debug indicator */}
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-1 z-[95]">
          {isOpen ? 'OPEN' : 'CLOSED'}
        </div>

        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Medika</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation - Scrollable with max height */}
        <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer - Always visible */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">admin@medika.com</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </>
  )
}
