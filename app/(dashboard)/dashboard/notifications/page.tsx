import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
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

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment with John Smith at 10:00 AM today',
    timestamp: '2024-01-15T08:30:00',
    read: false,
    priority: 'high',
    actionRequired: true,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    type: 'patient',
    title: 'New Patient Registration',
    message: 'Emily Davis has completed her registration and requires approval',
    timestamp: '2024-01-15T07:45:00',
    read: false,
    priority: 'medium',
    actionRequired: true,
    icon: User,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 3,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 11 PM to 1 AM',
    timestamp: '2024-01-15T06:00:00',
    read: true,
    priority: 'low',
    actionRequired: false,
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Critical Patient Alert',
    message: 'Patient Michael Johnson in Room 304 requires immediate attention',
    timestamp: '2024-01-14T22:15:00',
    read: false,
    priority: 'critical',
    actionRequired: true,
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 5,
    type: 'message',
    title: 'New Message',
    message: 'Dr. Sarah Johnson sent you a message regarding patient care protocol',
    timestamp: '2024-01-14T18:30:00',
    read: true,
    priority: 'medium',
    actionRequired: false,
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 6,
    type: 'appointment',
    title: 'Appointment Cancelled',
    message: 'Sarah Wilson has cancelled her appointment scheduled for tomorrow at 2 PM',
    timestamp: '2024-01-14T16:20:00',
    read: true,
    priority: 'low',
    actionRequired: false,
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 7,
    type: 'report',
    title: 'Monthly Report Available',
    message: 'December patient statistics and department performance report is ready',
    timestamp: '2024-01-14T14:00:00',
    read: true,
    priority: 'low',
    actionRequired: false,
    icon: Info,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
]

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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount} unread notifications • {actionRequiredCount} require action
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Types</option>
          <option value="appointment">Appointments</option>
          <option value="patient">Patients</option>
          <option value="alert">Alerts</option>
          <option value="message">Messages</option>
          <option value="system">System</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="action">Action Required</option>
        </select>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <Card 
              key={notification.id} 
              className={`p-4 hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon and priority indicator */}
                <div className="relative">
                  <div className={`p-2 rounded-full ${notification.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${notification.color}`} />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        {notification.actionRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs border-${notification.priority === 'critical' ? 'red' : notification.priority === 'high' ? 'orange' : notification.priority === 'medium' ? 'yellow' : 'green'}-300`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.actionRequired && (
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      )}
                      {!notification.read && (
                        <Button size="sm" variant="ghost">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{notifications.length}</h3>
          <p className="text-gray-600">Total Notifications</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-600">{unreadCount}</h3>
          <p className="text-gray-600">Unread</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-orange-600">{actionRequiredCount}</h3>
          <p className="text-gray-600">Action Required</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.priority === 'critical').length}
          </h3>
          <p className="text-gray-600">Critical</p>
        </Card>
      </div>
    </div>
  )
}
