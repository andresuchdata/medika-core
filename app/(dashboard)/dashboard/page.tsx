'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  UserCheck, 
  Stethoscope,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useDashboardSummary } from '@/lib/hooks/use-dashboard-summary'
import { Shimmer } from '@/components/ui/shimmer'

export default function DashboardPage() {
  const { data: dashboardData, loading: dashboardLoading } = useDashboardSummary()

  // Extract data with fallbacks
  const stats = dashboardData?.data?.stats || {
    total_patients: 0,
    todays_appointments: 0,
    queue_length: 0,
    average_wait_time: '0 min',
    monthly_growth: '+0%',
    revenue: '$0'
  }
  const recentAppointments = dashboardData?.data?.recent_appointments || []
  const systemStatus = dashboardData?.data?.system_status || {
    database: 'unknown',
    file_storage: 'unknown',
    notifications: 'unknown'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. Sarah Johnson</p>
        </div>
        <div className="flex space-x-3">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Appointment</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Shimmer width={60} height={32} className="rounded" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold">{stats.total_patients}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.monthly_growth}</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Shimmer width={40} height={32} className="rounded" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold">{stats.todays_appointments}</div>
            )}
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">8</span> completed, <span className="text-orange-600">16</span> pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Queue Length</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Shimmer width={20} height={32} className="rounded" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold">{stats.queue_length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Avg wait: <span className="text-green-600">{stats.average_wait_time}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.revenue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/appointments/new">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </Link>
            <Link href="/dashboard/patients/new">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="mr-2 h-4 w-4" />
                Add New Patient
              </Button>
            </Link>
            <Link href="/dashboard/queue">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Queue
              </Button>
            </Link>
            <Link href="/dashboard/records">
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="mr-2 h-4 w-4" />
                Medical Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Latest patient visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {dashboardLoading ? (
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
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-600 truncate">{appointment.type}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <Badge 
                        variant={
                          appointment.status === 'completed' ? 'default' :
                          appointment.status === 'in_progress' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No recent appointments</p>
                </div>
              )}
              <Link href="/dashboard/appointments">
                <Button variant="ghost" className="w-full">
                  View All Appointments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                systemStatus.database === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">Database: {systemStatus.database}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                systemStatus.file_storage === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">File Storage: {systemStatus.file_storage}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                systemStatus.notifications === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">Notifications: {systemStatus.notifications}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
