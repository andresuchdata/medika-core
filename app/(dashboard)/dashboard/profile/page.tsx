'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Building, Settings, LogOut, Edit3, Calendar, Users, Activity } from 'lucide-react'
import { useAuth } from '@/lib/stores/auth-store'
import { useOrganizationStore } from '@/lib/stores/organization-store'
import { Organization } from '@/types'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { toast } from 'sonner'
import { getUserInitials, formatUserRole } from '@/lib/utils/user'
import { useAvatar } from '@/lib/hooks/use-avatar'

export default function DesktopProfilePage() {
  const { user, logout } = useAuth()
  const organizationStore = useOrganizationStore()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const { handleAvatarChange, handleAvatarRemove } = useAvatar()

  // Fetch organization data if user has organizationId
  useEffect(() => {
    if (user?.organizationId && !organization) {
      organizationStore.fetchOrganization(user.organizationId).then(org => {
        if (org) {
          setOrganization(org)
        }
      })  
    }
  }, [user?.organizationId, organization, organizationStore])

  // Handle logout
  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  const organizationName = organization?.name || 'Loading...'
  const organizationPhone = organization?.phone || undefined

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-4">
                  <AvatarUpload
                    currentAvatar={user.avatar}
                    userName={user.name}
                    onAvatarChange={handleAvatarChange}
                    onAvatarRemove={handleAvatarRemove}
                    isEditable={true}
                    size="xl"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{formatUserRole(user.role)}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats - only for staff */}
          {user.role !== 'patient' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-600">Today's Patients</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">156</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600">Total Patients</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">2,847</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-purple-600">Appointments</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">24</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 font-medium">{formatUserRole(user.role)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          {user.organizationId && (
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Organization Name</label>
                    <p className="text-gray-900 font-medium">{organizationName}</p>
                  </div>
                  {organizationPhone && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Organization Phone</label>
                      <p className="text-gray-900 font-medium">{organizationPhone}</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full">
                  <Building className="mr-2 h-4 w-4" />
                  Organization Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start h-12">
                <Settings className="mr-3 h-5 w-5" />
                Account Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-12">
                <User className="mr-3 h-5 w-5" />
                Edit Profile
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-12">
                <Activity className="mr-3 h-5 w-5" />
                Activity Log
              </Button>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Danger Zone</CardTitle>
              <CardDescription className="text-red-600">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full h-12 text-base"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
