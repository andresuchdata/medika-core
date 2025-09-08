'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Clock, User, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { useAppointments } from '@/lib/hooks/use-appointments'
import { useQueue, usePatients } from '@/lib/hooks/use-data-fetching'
import { useAuth } from '@/lib/auth/auth-context'
import { format } from 'date-fns'
import { AppointmentsLoadingState } from '@/components/ui/loading-states'

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { appointments, isLoading, error } = useAppointments()
  const { data: queueData, loading: queueLoading } = useQueue()
  const { data: patientsData, loading: patientsLoading } = usePatients()

  // Extract data with fallbacks
  const queueStats = (queueData as any)?.stats || { total: 0, waiting: 0, inProgress: 0, averageWaitTime: '0 min' }
  const patientsCount = (patientsData as any)?.stats?.total || 0

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Filter appointments based on user role
  let todaysAppointments, upcomingAppointments
  
  if (user?.role === 'patient') {
    // For patients, show only their appointments
    todaysAppointments = appointments.filter(
      appointment => appointment.date === today && appointment.patientId === user.id
    )
    upcomingAppointments = appointments.filter(
      appointment => appointment.date > today && appointment.patientId === user.id
    )
  } else {
    // For staff, show all appointments
    todaysAppointments = appointments.filter(
      appointment => appointment.date === today
    )
    upcomingAppointments = appointments.filter(
      appointment => appointment.date > today
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'in_progress':
        return 'secondary'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
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
        
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading appointments: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <AppointmentsLoadingState />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {user?.role === 'patient' ? 'Your Appointments' : 'Appointments'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'patient' 
              ? 'View and manage your scheduled appointments' 
              : 'Schedule and manage patient appointments'
            }
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Link href="/dashboard/appointments/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        )}
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
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatTime(appointment.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {user?.role === 'patient' ? (
                        <>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-600">{appointment.type.replace('_', ' ')}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                        </>
                      )}
                    </div>
                    <Badge variant={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-2 text-gray-300" />
                <p>No appointments today</p>
              </div>
            )}
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
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{format(new Date(appointment.date), 'MMM d')} - {formatTime(appointment.startTime)}</p>
                      <p className="text-sm text-gray-600">{appointment.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {user?.role === 'patient' ? (
                      <>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.type.replace('_', ' ')}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Schedule appointments to see them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
