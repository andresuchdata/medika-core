import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Plus, Mail, Phone, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default function MobileDoctorsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctors</h1>
        <p className="text-gray-600">Manage medical staff</p>
      </div>

      {/* Add new doctor button */}
      <div className="mb-6">
        <Link href="/mobile/doctors/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add New Doctor
          </Button>
        </Link>
      </div>

      {/* Doctors list */}
      <div className="space-y-3">
        {[
          { 
            name: 'Dr. Sarah Johnson', 
            specialty: 'General Medicine', 
            email: 'sarah.johnson@medika.com',
            phone: '+1-555-0001',
            status: 'active',
            nextAvailable: 'Today 2:00 PM'
          },
          { 
            name: 'Dr. Mike Wilson', 
            specialty: 'Cardiology', 
            email: 'mike.wilson@medika.com',
            phone: '+1-555-0002',
            status: 'active',
            nextAvailable: 'Tomorrow 9:00 AM'
          },
          { 
            name: 'Dr. Emily Davis', 
            specialty: 'Pediatrics', 
            email: 'emily.davis@medika.com',
            phone: '+1-555-0003',
            status: 'active',
            nextAvailable: 'Today 4:30 PM'
          },
          { 
            name: 'Dr. Robert Chen', 
            specialty: 'Orthopedics', 
            email: 'robert.chen@medika.com',
            phone: '+1-555-0004',
            status: 'on-leave',
            nextAvailable: 'Jan 25, 9:00 AM'
          },
        ].map((doctor, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Doctor header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
                    {doctor.status === 'active' ? 'Active' : 'On Leave'}
                  </Badge>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Next available: {doctor.nextAvailable}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
