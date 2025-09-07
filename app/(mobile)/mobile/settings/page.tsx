import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User, Bell, Shield, Database, Palette, Globe, Smartphone } from 'lucide-react'
import { useAuth } from '@/lib/stores/auth-store'

export default function MobileSettingsPage() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your experience</p>
      </div>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@medika.com" />
          </div>
          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications on your device</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via SMS</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="mr-3 h-5 w-5" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="mr-3 h-5 w-5" />
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      {/* Appearance settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the app's look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Large Text</Label>
              <p className="text-sm text-gray-600">Increase text size for better readability</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Database className="mr-3 h-5 w-5" />
            Export My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="mr-3 h-5 w-5" />
            Privacy Policy
          </Button>
        </CardContent>
      </Card>

      {/* About & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            About & Support
          </CardTitle>
          <CardDescription>Get help and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Smartphone className="mr-3 h-5 w-5" />
            Help & Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Smartphone className="mr-3 h-5 w-5" />
            App Version 1.0.0
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
