import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Plus, Clock, User } from 'lucide-react'
import Link from 'next/link'

export default function MobileAppointmentsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
        <p className="text-gray-600">Manage your schedule</p>
      </div>

      {/* Add new appointment button */}
      <div className="mb-6">
        <Link href="/mobile/appointments/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Today's appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Appointments
          </CardTitle>
          <CardDescription>Your schedule for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: '09:00 AM', patient: 'John Doe', type: 'Consultation', status: 'confirmed' },
            { time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up', status: 'confirmed' },
            { time: '02:00 PM', patient: 'Mike Johnson', type: 'Routine Check', status: 'pending' },
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                <Badge 
                  variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
          <CardDescription>Next few days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { date: 'Tomorrow', time: '11:00 AM', patient: 'Sarah Wilson', type: 'Consultation' },
            { date: 'Jan 18', time: '03:00 PM', patient: 'David Brown', type: 'Follow-up' },
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.date} - {appointment.time}</p>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
