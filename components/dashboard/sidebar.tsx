'use client'

import { useState } from 'react'
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
  UserCheck,
  Building2,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Patients', href: '/dashboard/patients', icon: Users },
  { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Queue', href: '/dashboard/queue', icon: Clock },
  { name: 'Medical Records', href: '/dashboard/records', icon: FileText },
  { name: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar - collapsible with animations */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'w-48' : 'w-16'
      )}>
        {/* Debug indicator */}
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-1 z-[60]">
          {isOpen ? 'OPEN' : 'CLOSED'}
        </div>
        
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
          <div className="flex h-20 items-center justify-between px-3 border-b border-gray-200">
            <h1 className={cn(
              'font-bold text-gray-900 transition-all duration-300 ease-in-out',
              isOpen ? 'text-xl opacity-100' : 'text-lg opacity-0'
            )}>
              {isOpen ? 'Medika' : 'M'}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggle()
              }}
              className="h-8 w-8"
              title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon className={cn(
                    'transition-all duration-200',
                    isOpen ? 'mr-3 h-5 w-5' : 'mx-auto h-5 w-5'
                  )} />
                  <span className={cn(
                    'transition-all duration-200',
                    isOpen ? 'opacity-100' : 'opacity-0 w-0'
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
          
          {/* Sidebar footer with toggle button for better visibility */}
          <div className="border-t border-gray-200 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggle()
              }}
              className="w-full justify-center text-xs text-gray-600 hover:text-gray-900"
            >
              {isOpen ? (
                <>
                  <ChevronLeft className="mr-1 h-3 w-3" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronRight className="mr-1 h-3 w-3" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
