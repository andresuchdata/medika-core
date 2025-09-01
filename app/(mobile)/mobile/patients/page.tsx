import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function MobilePatientsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patients</h1>
        <p className="text-gray-600">Manage your patient records</p>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add new patient button */}
      <div className="mb-6">
        <Link href="/mobile/patients/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add New Patient
          </Button>
        </Link>
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {[
          { name: 'John Doe', age: 35, lastVisit: '2024-01-15', status: 'Active' },
          { name: 'Jane Smith', age: 28, lastVisit: '2024-01-14', status: 'Active' },
          { name: 'Mike Johnson', age: 42, lastVisit: '2024-01-13', status: 'Active' },
          { name: 'Sarah Wilson', age: 31, lastVisit: '2024-01-12', status: 'Active' },
        ].map((patient, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} years old</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last visit</p>
                  <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
