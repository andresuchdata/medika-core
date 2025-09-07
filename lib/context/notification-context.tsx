'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface UnreadCountResponse {
  data: {
    unread_count: number
  }
}

interface NotificationContextType {
  unreadCount: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUnreadCount(0)
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setUnreadCount(0)
          setIsLoading(false)
          return
        }
        throw new Error(`Failed to fetch unread count: ${response.status}`)
      }

      const result: UnreadCountResponse = await response.json()
      setUnreadCount(result.data.unread_count)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const value: NotificationContextType = {
    unreadCount,
    isLoading,
    error,
    refetch: fetchUnreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
