import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Search, Filter, Calendar, User, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function MobileRecordsPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical Records</h1>
        <p className="text-gray-600">Patient medical history and documents</p>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
          <CardDescription>Latest patient medical records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { 
              patient: 'John Doe', 
              date: '2024-01-15', 
              type: 'Consultation',
              doctor: 'Dr. Sarah Johnson',
              status: 'completed'
            },
            { 
              patient: 'Jane Smith', 
              date: '2024-01-14', 
              type: 'Follow-up',
              doctor: 'Dr. Mike Wilson',
              status: 'completed'
            },
            { 
              patient: 'Mike Johnson', 
              date: '2024-01-13', 
              type: 'Lab Results',
              doctor: 'Dr. Emily Davis',
              status: 'pending'
            },
            { 
              patient: 'Sarah Wilson', 
              date: '2024-01-12', 
              type: 'Prescription',
              doctor: 'Dr. Sarah Johnson',
              status: 'completed'
            },
          ].map((record, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.patient}</p>
                  <p className="text-sm text-gray-600">{record.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{record.date}</p>
                <p className="text-sm text-gray-600">{record.doctor}</p>
                <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                  {record.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Record categories */}
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-12">
                <FileText className="mr-3 h-5 w-5" />
                View All Patient Records
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Search className="mr-3 h-5 w-5" />
                Search Records
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Medical Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-12">
                <FileText className="mr-3 h-5 w-5" />
                Lab Reports
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <FileText className="mr-3 h-5 w-5" />
                Prescriptions
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <FileText className="mr-3 h-5 w-5" />
                Imaging Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
