'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationsLoadingState } from '@/components/ui/loading-states'
import { useNotifications } from '@/lib/hooks/use-notifications'
import { 
  Bell, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Trash2,
  MessageSquare
} from 'lucide-react'

// Helper functions
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString()
  }
}

export default function NotificationsPage() {
  const { data: notificationsData, isLoading, error, refetch } = useNotifications({
    limit: 50,
    order_by: 'created_at',
    order: 'desc'
  })

  if (isLoading) {
    return <NotificationsLoadingState />
  }

  if (error) {
    const isAuthError = error.message.includes('login') || error.message.includes('Authentication')
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Error loading notifications</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-600 mb-4">
              {isAuthError ? 'Please login to view notifications' : `Error loading notifications: ${error.message}`}
            </p>
            {isAuthError ? (
              <Button onClick={() => window.location.href = '/login'} variant="outline">
                Go to Login
              </Button>
            ) : (
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const notifications = notificationsData?.data || []
  const unreadCount = notifications.filter(n => !n.is_read).length
  const actionRequiredCount = notifications.filter(n => n.data?.action_required).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important alerts and updates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{actionRequiredCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Types</option>
          <option value="appointment">Appointment</option>
          <option value="patient">Patient</option>
          <option value="emergency">Emergency</option>
          <option value="system">System</option>
          <option value="lab">Lab</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="action">Action Required</option>
        </select>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const getNotificationIcon = (type: string) => {
            switch (type) {
              case 'appointment': return Calendar
              case 'patient': return User
              case 'emergency': return AlertCircle
              case 'system': return Settings
              case 'lab': return MessageSquare
              default: return Bell
            }
          }
          
          const getNotificationColor = (type: string) => {
            switch (type) {
              case 'appointment': return 'text-blue-600'
              case 'patient': return 'text-green-600'
              case 'emergency': return 'text-red-600'
              case 'system': return 'text-gray-600'
              case 'lab': return 'text-purple-600'
              default: return 'text-gray-600'
            }
          }
          
          const getNotificationBgColor = (type: string) => {
            switch (type) {
              case 'appointment': return 'bg-blue-100'
              case 'patient': return 'bg-green-100'
              case 'emergency': return 'bg-red-100'
              case 'system': return 'bg-gray-100'
              case 'lab': return 'bg-purple-100'
              default: return 'bg-gray-100'
            }
          }
          
          const IconComponent = getNotificationIcon(notification.type)
          return (
            <Card 
              key={notification.id} 
              className={`p-4 hover:shadow-md transition-shadow ${!notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon and priority indicator */}
                <div className="relative">
                  <div className={`p-2 rounded-full ${getNotificationBgColor(notification.type)}`}>
                    <IconComponent className={`h-5 w-5 ${getNotificationColor(notification.type)}`} />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        {notification.data?.action_required && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${!notification.is_read ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimestamp(notification.created_at)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.priority === 'critical' ? 'border-red-500 text-red-600' :
                            notification.priority === 'high' ? 'border-orange-500 text-orange-600' :
                            notification.priority === 'medium' ? 'border-yellow-500 text-yellow-600' :
                            'border-green-500 text-green-600'
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      {notification.is_read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        
        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! No new notifications at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}