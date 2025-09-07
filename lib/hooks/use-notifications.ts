import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  priority: string
  is_read: boolean
  channels: string[]
  data: Record<string, any>
  scheduled_for?: string
  sent_at?: string
  created_at: string
}

interface NotificationListResponse {
  data: Notification[]
  pagination: {
    page: number
    total_pages: number
    total: number
    limit: number
  }
}

interface UnreadCountResponse {
  data: {
    unread_count: number
  }
}

// Hook for fetching notifications list
export function useNotifications(params?: {
  type?: string
  priority?: string
  is_read?: boolean
  limit?: number
  offset?: number
  order_by?: string
  order?: string
}) {
  const [data, setData] = useState<NotificationListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const searchParams = new URLSearchParams()
      if (params?.type) searchParams.append('type', params.type)
      if (params?.priority) searchParams.append('priority', params.priority)
      if (params?.is_read !== undefined) searchParams.append('is_read', params.is_read.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.offset) searchParams.append('offset', params.offset.toString())
      if (params?.order_by) searchParams.append('order_by', params.order_by)
      if (params?.order) searchParams.append('order', params.order)

      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Please login to view notifications')
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/notifications?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.')
        }
        throw new Error(`Failed to fetch notifications: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [JSON.stringify(params)])

  return {
    data,
    isLoading,
    error,
    refetch: fetchNotifications
  }
}

// Hook for fetching unread notification count
export function useUnreadNotificationCount() {
  const [data, setData] = useState<UnreadCountResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Please login to view notifications')
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.')
        }
        throw new Error(`Failed to fetch unread count: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
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

  return {
    data,
    isLoading,
    error,
    refetch: fetchUnreadCount
  }
}
