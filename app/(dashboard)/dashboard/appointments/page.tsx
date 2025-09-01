import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Clock, User, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function AppointmentsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>
        <Link href="/dashboard/appointments/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Today's appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Appointments
          </CardTitle>
          <CardDescription>Appointments scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', patient: 'John Doe', doctor: 'Dr. Sarah Johnson', status: 'confirmed' },
              { time: '10:30 AM', patient: 'Jane Smith', doctor: 'Dr. Mike Wilson', status: 'confirmed' },
              { time: '02:00 PM', patient: 'Bob Johnson', doctor: 'Dr. Sarah Johnson', status: 'pending' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                  </div>
                  <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Future scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-300" />
            <p>No upcoming appointments</p>
            <p className="text-sm">Schedule appointments to see them here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
