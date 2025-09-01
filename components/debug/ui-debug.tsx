'use client'

import { useUI } from '@/lib/context/ui-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function UIDebug() {
  const { state, toggleSidebar, setSidebarOpen, toggleSearch, toggleNotifications, resetUI } = useUI()
  const [isVisible, setIsVisible] = useState(false)

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[100] bg-yellow-100 hover:bg-yellow-200"
      >
        🐛 Debug UI
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-[100] w-80 bg-white shadow-lg border-2 border-yellow-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          🐛 UI Debug Panel
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Sidebar:</span>
            <span className={`font-mono ${state.sidebarOpen ? 'text-green-600' : 'text-red-600'}`}>
              {state.sidebarOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSidebar}
              className="text-xs h-6 px-2"
            >
              Toggle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSidebarOpen(true)}
              className="text-xs h-6 px-2"
            >
              Open
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSidebarOpen(false)}
              className="text-xs h-6 px-2"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Search:</span>
            <span className={`font-mono ${state.searchOpen ? 'text-green-600' : 'text-red-600'}`}>
              {state.searchOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleSearch}
            className="text-xs h-6 px-2"
          >
            Toggle Search
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Notifications:</span>
            <span className={`font-mono ${state.notificationsOpen ? 'text-green-600' : 'text-red-600'}`}>
              {state.notificationsOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleNotifications}
            className="text-xs h-6 px-2"
          >
            Toggle Notifications
          </Button>
        </div>

        <div className="pt-2 border-t">
          <Button
            size="sm"
            variant="destructive"
            onClick={resetUI}
            className="text-xs h-6 px-2 w-full"
          >
            Reset UI State
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t">
          <div>Theme: {state.theme}</div>
          <div>localStorage: {typeof window !== 'undefined' ? 'Available' : 'Not Available'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
