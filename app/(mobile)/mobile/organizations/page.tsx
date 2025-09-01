import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Users, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function MobileOrganizationsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizations</h1>
        <p className="text-gray-600">Manage hospitals, clinics, and facilities</p>
      </div>

      {/* Add new organization button */}
      <div className="mb-6">
        <Link href="/mobile/organizations/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add Organization
          </Button>
        </Link>
      </div>

      {/* Organizations list */}
      <div className="space-y-3">
        {[
          { 
            name: 'Medika General Hospital', 
            type: 'Hospital', 
            location: 'New York, NY',
            phone: '+1-555-0001',
            email: 'info@medika.com',
            status: 'active',
            staffCount: 156
          },
          { 
            name: 'Medika Downtown Clinic', 
            type: 'Clinic', 
            location: 'Brooklyn, NY',
            phone: '+1-555-0002',
            email: 'downtown@medika.com',
            status: 'active',
            staffCount: 23
          },
          { 
            name: 'Medika Urgent Care', 
            type: 'Urgent Care', 
            location: 'Queens, NY',
            phone: '+1-555-0003',
            email: 'urgent@medika.com',
            status: 'active',
            staffCount: 12
          },
        ].map((org, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Organization header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-600">{org.type}</p>
                    </div>
                  </div>
                  <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                    {org.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{org.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{org.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{org.email}</span>
                  </div>
                </div>

                {/* Staff count */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{org.staffCount} staff members</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage Staff
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
