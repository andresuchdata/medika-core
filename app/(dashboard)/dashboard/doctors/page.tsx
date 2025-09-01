import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Stethoscope,
  Calendar,
  Clock,
  Users
} from 'lucide-react'

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    email: 'sarah.johnson@medika.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    patients: 124,
    appointments: 8,
    nextAppointment: '10:00 AM',
    avatar: '/avatars/doctor1.jpg'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    email: 'michael.chen@medika.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    patients: 98,
    appointments: 6,
    nextAppointment: '2:30 PM',
    avatar: '/avatars/doctor2.jpg'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    email: 'emily.rodriguez@medika.com',
    phone: '+1 (555) 345-6789',
    status: 'busy',
    patients: 156,
    appointments: 12,
    nextAppointment: '9:15 AM',
    avatar: '/avatars/doctor3.jpg'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    email: 'james.wilson@medika.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    patients: 87,
    appointments: 4,
    nextAppointment: '11:45 AM',
    avatar: '/avatars/doctor4.jpg'
  }
]

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600">Manage doctor profiles and schedules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Specializations</option>
          <option value="cardiologist">Cardiologist</option>
          <option value="neurologist">Neurologist</option>
          <option value="pediatrician">Pediatrician</option>
          <option value="orthopedic">Orthopedic Surgeon</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 bg-blue-100">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={doctor.status === 'active' ? 'default' : doctor.status === 'busy' ? 'destructive' : 'secondary'}
                >
                  {doctor.status}
                </Badge>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  Patients
                </div>
                <span className="font-medium">{doctor.patients}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  Today's Appointments
                </div>
                <span className="font-medium">{doctor.appointments}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Next Appointment
                </div>
                <span className="font-medium">{doctor.nextAppointment}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>{doctor.email}</p>
              <p>{doctor.phone}</p>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
              <Button size="sm" className="flex-1">
                Schedule
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-600">{doctors.length}</h3>
          <p className="text-gray-600">Total Doctors</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-green-600">
            {doctors.filter(d => d.status === 'active').length}
          </h3>
          <p className="text-gray-600">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-orange-600">
            {doctors.filter(d => d.status === 'busy').length}
          </h3>
          <p className="text-gray-600">Busy</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-gray-600">
            {doctors.reduce((sum, d) => sum + d.appointments, 0)}
          </h3>
          <p className="text-gray-600">Today's Appointments</p>
        </Card>
      </div>
    </div>
  )
}
