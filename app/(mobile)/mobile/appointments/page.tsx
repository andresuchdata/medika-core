'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Plus, Clock, User } from 'lucide-react'
import { Shimmer } from '@/components/ui/shimmer'
import Link from 'next/link'
import { useAppointments } from '@/lib/hooks/use-appointments'
import { format } from 'date-fns'

export default function MobileAppointmentsPage() {
  const { appointments, isLoading, error } = useAppointments()

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Filter appointments for today and upcoming
  const todaysAppointments = appointments.filter(
    appointment => appointment.date === today
  )
  
  const upcomingAppointments = appointments.filter(
    appointment => appointment.date > today
  ).slice(0, 3) // Show only next 3 upcoming appointments

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'outline'
      case 'in_progress':
        return 'secondary'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return format(date, 'MMM d')
    }
  }

  if (error) {
    return (
      <div className="space-y-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your schedule</p>
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
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Shimmer width={48} height={48} className="rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Shimmer width="33%" height={16} className="rounded" />
                    <Shimmer width="50%" height={12} className="rounded" />
                  </div>
                  <Shimmer width={80} height={32} className="rounded" />
                </div>
              ))}
            </div>
          ) : todaysAppointments.length > 0 ? (
            todaysAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{formatTime(appointment.startTime)}</p>
                    <p className="text-sm text-gray-600">{appointment.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                  <Badge 
                    variant={getStatusColor(appointment.status)}
                    className="text-xs"
                  >
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
        </CardContent>
      </Card>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
          <CardDescription>Next few days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Shimmer width={48} height={48} className="rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Shimmer width="33%" height={16} className="rounded" />
                    <Shimmer width="50%" height={12} className="rounded" />
                  </div>
                  <Shimmer width={80} height={32} className="rounded" />
                </div>
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(appointment.date)} - {formatTime(appointment.startTime)}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-2 text-gray-300" />
              <p>No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
