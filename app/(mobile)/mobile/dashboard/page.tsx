'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Plus,
  ArrowRight
} from 'lucide-react'
import { Shimmer } from '@/components/ui/shimmer'
import Link from 'next/link'
import { useAppointments } from '@/lib/hooks/use-appointments'
import { useQueue, usePatients } from '@/lib/hooks/use-data-fetching'
import { format } from 'date-fns'

export default function MobileDashboardPage() {
  const { appointments, isLoading } = useAppointments()
  const { data: queueData, loading: queueLoading } = useQueue()
  const { data: patientsData, loading: patientsLoading } = usePatients()

  // Extract data with fallbacks
  const queueStats = (queueData as any)?.stats || { total: 0, averageWaitTime: '0 min' }
  const patientsCount = (patientsData as any)?.stats?.total || 0

  // Get today's date in YYYY-MM-DD format
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Get recent appointments (last 3)
  const recentAppointments = appointments
    .filter(appointment => appointment.date <= today)
    .slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'pending':
        return 'outline'
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

  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Sarah Johnson</p>
      </div>

      {/* Quick action button */}
      <div className="mb-6">
        <Link href="/mobile/appointments/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Stats cards - single column for mobile */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsLoading ? '...' : patientsCount}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : appointments.filter(a => a.date === today).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Queue Length</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queueLoading ? '...' : queueStats.total}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest patient visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Shimmer width="40%" height={16} className="rounded" />
                      <Shimmer width={60} height={20} className="rounded" />
                    </div>
                    <Shimmer width="60%" height={14} className="rounded mb-1" />
                    <Shimmer width="30%" height={14} className="rounded" />
                  </div>
                ))}
              </div>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <Badge 
                      variant={getStatusColor(appointment.status)}
                      className="text-xs"
                    >
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{appointment.type.replace('_', ' ')}</p>
                  <p className="text-sm font-medium text-gray-900">{formatTime(appointment.startTime)}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent appointments</p>
              </div>
            )}
            <Link href="/mobile/appointments">
              <Button variant="ghost" className="w-full">
                View All Appointments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
