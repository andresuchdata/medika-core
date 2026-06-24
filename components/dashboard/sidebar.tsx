'use client'

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
  Stethoscope,
  Building2,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Pill,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Antrian', href: '/dashboard/queue', icon: Clock },
  { name: 'Kunjungan', href: '/dashboard/visit', icon: ClipboardList },
  { name: 'Farmasi', href: '/dashboard/pharmacy', icon: Pill },
  { name: 'Janji Temu', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Pasien', href: '/dashboard/patients', icon: Users },
  { name: 'Dokter', href: '/dashboard/doctors', icon: Stethoscope },
  { name: 'Faskes', href: '/dashboard/organizations', icon: Building2 },
  { name: 'Notifikasi', href: '/dashboard/notifications', icon: Bell },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'w-48' : 'w-16'
      )}>
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-100">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-3 border-b border-gray-100">
            {isOpen ? (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">Medika</span>
              </div>
            ) : (
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xs">M</span>
              </div>
            )}
            {isOpen && (
              <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {navigation.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-2.5 py-2 text-sm font-medium rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon className={cn(
                    'shrink-0 h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400',
                    isOpen ? 'mr-3' : 'mx-auto'
                  )} />
                  <span className={cn('transition-all duration-200 truncate', isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden')}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Footer toggle */}
          <div className="border-t border-gray-100 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-full justify-center text-xs text-gray-400 hover:text-gray-700 h-8"
            >
              {isOpen ? <><ChevronLeft className="mr-1 h-3.5 w-3.5" /> Tutup</> : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
