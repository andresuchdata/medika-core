'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  User
} from 'lucide-react'

const mobileNavigation = [
  { name: 'Dashboard', href: '/mobile/dashboard', icon: Home },
  { name: 'Patients', href: '/mobile/patients', icon: Users },
  { name: 'Appointments', href: '/mobile/appointments', icon: Calendar },
  { name: 'Queue', href: '/mobile/queue', icon: Clock },
  { name: 'Profile', href: '/mobile/profile', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex items-center justify-around">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 mb-1',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )} />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
