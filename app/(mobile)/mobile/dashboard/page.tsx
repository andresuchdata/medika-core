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
import Link from 'next/link'

export default function MobileDashboardPage() {
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">8</span> completed, <span className="text-orange-600">16</span> pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Avg wait: <span className="text-green-600">15 min</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/mobile/appointments/new">
            <Button variant="outline" className="w-full justify-start h-12">
              <Calendar className="mr-3 h-5 w-5" />
              Schedule Appointment
            </Button>
          </Link>
          <Link href="/mobile/patients/new">
            <Button variant="outline" className="w-full justify-start h-12">
              <Users className="mr-3 h-5 w-5" />
              Add New Patient
            </Button>
          </Link>
          <Link href="/mobile/queue">
            <Button variant="outline" className="w-full justify-start h-12">
              <Clock className="mr-3 h-5 w-5" />
              View Queue
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
          <div className="space-y-3">
            {[
              { patient: 'John Doe', time: '09:00 AM', status: 'completed', type: 'Consultation' },
              { patient: 'Jane Smith', time: '10:30 AM', status: 'in_progress', type: 'Follow-up' },
              { patient: 'Mike Johnson', time: '02:00 PM', status: 'pending', type: 'Routine Check' },
            ].map((appointment, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
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
                <p className="text-sm text-gray-600 mb-1">{appointment.type}</p>
                <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
              </div>
            ))}
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
