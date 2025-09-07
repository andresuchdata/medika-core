'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Bell, Search, User, LogOut, Settings } from 'lucide-react'
import { useUI } from '@/lib/context/ui-context'
import { useAuth } from '@/lib/stores/auth-store'
import { getUserInitials, formatUserRole } from '@/lib/utils/user'
import { useRouter } from 'next/navigation'
import { useUnreadNotificationCount } from '@/lib/hooks/use-notifications'


export function MobileHeader() {
  const { 
    state: { searchOpen }, 
    toggleSearch,
  } = useUI()

  const router = useRouter()
  const { user, logout } = useAuth()
  const { data: unreadData, isLoading: unreadLoading, error: unreadError } = useUnreadNotificationCount()
  
  // Get unread notification count with fallback
  const unreadCount = unreadError ? 0 : (unreadData?.data?.unread_count || 0)

  const handleSearchToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSearch()
  }, [toggleSearch])

  const handleClickNotifications = useCallback((e: React.MouseEvent) => {
    router.push('/mobile/notifications')
  }, [router])


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and title (clickable) */}
        <Link href="/mobile/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Medika</h1>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" onClick={handleClickNotifications}>
            <Bell className="h-5 w-5" />
            {!unreadLoading && unreadCount > 0 && (
              <Badge
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
            {unreadLoading && (
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8 ring-2 ring-gray-200 border-2 border-white shadow-sm">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-gray-100 text-gray-600">{user ? getUserInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  {user?.role && (
                    <p className="text-xs text-gray-400">{formatUserRole(user.role)}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/mobile/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
