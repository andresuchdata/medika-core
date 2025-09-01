import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Building, Settings, LogOut } from 'lucide-react'

export default function MobileProfilePage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Profile header */}
      <div className="text-center mb-6">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src="/avatars/admin.jpg" alt="Dr. Sarah Johnson" />
          <AvatarFallback className="text-2xl">SA</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dr. Sarah Johnson</h1>
        <p className="text-gray-600">Administrator</p>
      </div>

      {/* Profile information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">admin@medika.com</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">+1-555-0001</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-medium text-gray-900">Medika General Hospital</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start h-12">
            <Settings className="mr-3 h-5 w-5" />
            Account Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start h-12">
            <User className="mr-3 h-5 w-5" />
            Edit Profile
          </Button>
          
          <Button variant="outline" className="w-full justify-start h-12">
            <Building className="mr-3 h-5 w-5" />
            Organization Settings
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-sm text-blue-600">Patients Today</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">24</p>
              <p className="text-sm text-green-600">Appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout button */}
      <div className="mt-6">
        <Button variant="destructive" className="w-full h-12 text-base">
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
