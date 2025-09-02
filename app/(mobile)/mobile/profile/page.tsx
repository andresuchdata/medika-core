'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Building, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/stores/auth-store'
import { useOrganizationStore } from '@/lib/stores/organization-store'
import { Organization } from '@/types'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { toast } from 'sonner'
import { getUserInitials, formatUserRole } from '@/lib/utils/user'

export default function MobileProfilePage() {
  const { user, logout, updateAvatar } = useAuth()
  const organizationStore = useOrganizationStore()
  const [organization, setOrganization] = useState<Organization | null>(null)

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

  // Handle avatar change
  const handleAvatarChange = async (avatarUrl: string) => {
    if (!user) return

    try {
      // Call the backend API to update avatar
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to update avatar')
      }

      const data = await response.json()
      
      if (data.success) {
        // Update the auth store with new avatar
        updateAvatar(avatarUrl)
        toast.success('Avatar updated successfully!')
      } else {
        throw new Error(data.message || 'Failed to update avatar')
      }
    } catch (error) {
      console.error('Avatar update failed:', error)
      toast.error('Failed to update avatar. Please try again.')
    }
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
    <div className="space-y-4 pb-20">
      {/* Profile header */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-4">
          <AvatarUpload
            currentAvatar={user.avatar}
            userName={user.name}
            onAvatarChange={handleAvatarChange}
            isEditable={true}
            size="lg"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
        <p className="text-gray-600">{formatUserRole(user.role)}</p>
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
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">
                {user.phone || 'Not provided'}
              </p>
            </div>
          </div>
          
          {user.organizationId && (
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium text-gray-900">{organizationName}</p>
                {organizationPhone && (
                  <p className="text-sm text-gray-500">{organizationPhone}</p>
                )}
              </div>
            </div>
          )}
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
          
          {user.organizationId && (
            <Button variant="outline" className="w-full justify-start h-12">
              <Building className="mr-3 h-5 w-5" />
              Organization Settings
            </Button>
          )}
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
        <Button 
          variant="destructive" 
          className="w-full h-12 text-base"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
