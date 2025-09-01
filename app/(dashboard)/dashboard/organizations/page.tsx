import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  MoreVertical,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  Settings,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data for organizations
const organizations = [
  {
    id: 1,
    name: 'Medika General Hospital',
    type: 'Hospital',
    address: '123 Healthcare Ave, Medical District, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@medika-general.com',
    status: 'active',
    doctors: 45,
    patients: 1250,
    departments: ['Cardiology', 'Neurology', 'Emergency', 'Pediatrics', 'Surgery'],
    establishedDate: '1985-03-15',
    avatar: '/avatars/hospital1.jpg'
  },
  {
    id: 2,
    name: 'Downtown Medical Clinic',
    type: 'Clinic',
    address: '456 Main St, Downtown, NY 10002',
    phone: '+1 (555) 234-5678',
    email: 'contact@downtown-medical.com',
    status: 'active',
    doctors: 12,
    patients: 380,
    departments: ['General Practice', 'Family Medicine', 'Preventive Care'],
    establishedDate: '2010-08-22',
    avatar: '/avatars/clinic1.jpg'
  },
  {
    id: 3,
    name: 'Heart Care Specialty Center',
    type: 'Specialty Clinic',
    address: '789 Cardiac Way, Medical Plaza, NY 10003',
    phone: '+1 (555) 345-6789',
    email: 'admin@heartcare-center.com',
    status: 'active',
    doctors: 8,
    patients: 520,
    departments: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology'],
    establishedDate: '2015-11-10',
    avatar: '/avatars/specialty1.jpg'
  },
  {
    id: 4,
    name: 'Dr. Johnson Private Practice',
    type: 'Private Practice',
    address: '321 Professional Blvd, Suite 200, NY 10004',
    phone: '+1 (555) 456-7890',
    email: 'office@drjohnson-practice.com',
    status: 'active',
    doctors: 1,
    patients: 150,
    departments: ['Internal Medicine'],
    establishedDate: '2018-05-03',
    avatar: '/avatars/practice1.jpg'
  },
  {
    id: 5,
    name: 'Pediatric Care Network',
    type: 'Network',
    address: '555 Children\'s Way, Family District, NY 10005',
    phone: '+1 (555) 567-8901',
    email: 'info@pediatric-network.com',
    status: 'pending',
    doctors: 25,
    patients: 890,
    departments: ['Pediatrics', 'Neonatology', 'Child Psychology', 'Pediatric Surgery'],
    establishedDate: '2020-02-14',
    avatar: '/avatars/network1.jpg'
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Hospital': return 'bg-blue-100 text-blue-800'
    case 'Clinic': return 'bg-green-100 text-green-800'
    case 'Specialty Clinic': return 'bg-purple-100 text-purple-800'
    case 'Private Practice': return 'bg-orange-100 text-orange-800'
    case 'Network': return 'bg-indigo-100 text-indigo-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage healthcare organizations and facilities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Types</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="specialty">Specialty Clinic</option>
          <option value="practice">Private Practice</option>
          <option value="network">Network</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Organizations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <Avatar className="h-16 w-16 bg-blue-100">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{org.name}</h3>
                    <Badge 
                      variant={org.status === 'active' ? 'default' : org.status === 'pending' ? 'destructive' : 'secondary'}
                    >
                      {org.status}
                    </Badge>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(org.type)}`}>
                    {org.type}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Contact info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="break-words">{org.address}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 h-4 w-4 text-gray-400" />
                <span>{org.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                <span className="truncate">{org.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-lg font-semibold text-gray-900">{org.doctors}</span>
                </div>
                <p className="text-xs text-gray-600">Doctors</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-lg font-semibold text-gray-900">{org.patients}</span>
                </div>
                <p className="text-xs text-gray-600">Patients</p>
              </div>
            </div>

            {/* Departments */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Departments</p>
              <div className="flex flex-wrap gap-1">
                {org.departments.slice(0, 3).map((dept) => (
                  <Badge key={dept} variant="outline" className="text-xs">
                    {dept}
                  </Badge>
                ))}
                {org.departments.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{org.departments.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="mr-2 h-3 w-3" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6 border-t">
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-600">{organizations.length}</h3>
          <p className="text-gray-600">Total Organizations</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-green-600">
            {organizations.filter(o => o.status === 'active').length}
          </h3>
          <p className="text-gray-600">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-orange-600">
            {organizations.filter(o => o.status === 'pending').length}
          </h3>
          <p className="text-gray-600">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-purple-600">
            {organizations.reduce((sum, o) => sum + o.doctors, 0)}
          </h3>
          <p className="text-gray-600">Total Doctors</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-bold text-indigo-600">
            {organizations.reduce((sum, o) => sum + o.patients, 0)}
          </h3>
          <p className="text-gray-600">Total Patients</p>
        </Card>
      </div>
    </div>
  )
}
