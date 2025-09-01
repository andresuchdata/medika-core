import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, User, Stethoscope, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function MobileNotificationsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with important alerts</p>
      </div>

      {/* Notification filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button variant="default" size="sm" className="flex-1">
              All
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Unread
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Read
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications list */}
      <div className="space-y-3">
        {[
          { 
            title: 'New Appointment Request', 
            message: 'John Doe requested an appointment for tomorrow at 2:00 PM',
            type: 'appointment',
            time: '2 minutes ago',
            isRead: false,
            priority: 'high'
          },
          { 
            title: 'Patient Check-in', 
            message: 'Jane Smith has checked in for her 10:30 AM appointment',
            type: 'checkin',
            time: '15 minutes ago',
            isRead: false,
            priority: 'medium'
          },
          { 
            title: 'Lab Results Ready', 
            title: 'Lab Results Ready',
            message: 'Blood test results for Mike Johnson are now available',
            type: 'lab',
            time: '1 hour ago',
            isRead: true,
            priority: 'low'
          },
          { 
            title: 'Emergency Alert', 
            message: 'Emergency patient arrived - Dr. Sarah Johnson needed in ER',
            type: 'emergency',
            time: '2 hours ago',
            isRead: true,
            priority: 'critical'
          },
          { 
            title: 'Schedule Update', 
            message: 'Your 3:00 PM appointment has been rescheduled to 4:00 PM',
            type: 'schedule',
            time: '3 hours ago',
            isRead: true,
            priority: 'medium'
          },
        ].map((notification, index) => (
          <Card key={index} className={notification.isRead ? 'opacity-75' : ''}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Notification header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center
                      ${notification.type === 'emergency' ? 'bg-red-100' : 
                        notification.type === 'appointment' ? 'bg-blue-100' :
                        notification.type === 'checkin' ? 'bg-green-100' :
                        notification.type === 'lab' ? 'bg-purple-100' : 'bg-gray-100'
                      }
                    `}>
                      {notification.type === 'emergency' ? (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      ) : notification.type === 'appointment' ? (
                        <Calendar className="h-5 w-5 text-blue-600" />
                      ) : notification.type === 'checkin' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : notification.type === 'lab' ? (
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                      ) : (
                        <Bell className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>

                {/* Notification meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{notification.time}</span>
                  </div>
                  <Badge variant={
                    notification.priority === 'critical' ? 'destructive' :
                    notification.priority === 'high' ? 'default' :
                    notification.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {notification.priority}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {notification.isRead ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mark all as read */}
      <Card>
        <CardContent className="p-4">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
