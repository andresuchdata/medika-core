import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, ArrowLeft, Phone, Mail, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function MobileNewPatientPage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Link href="/mobile/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Patient</h1>
          <p className="text-sm text-gray-600">Add a new patient to the system</p>
        </div>
      </div>

      {/* Patient form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
          <CardDescription>Fill in the patient details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input type="date" id="dateOfBirth" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@email.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1-555-0000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  placeholder="Enter full address..."
                  rows={2}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-positive">A+</SelectItem>
                    <SelectItem value="a-negative">A-</SelectItem>
                    <SelectItem value="b-positive">B+</SelectItem>
                    <SelectItem value="b-negative">B-</SelectItem>
                    <SelectItem value="ab-positive">AB+</SelectItem>
                    <SelectItem value="ab-negative">AB-</SelectItem>
                    <SelectItem value="o-positive">O+</SelectItem>
                    <SelectItem value="o-negative">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  placeholder="List any known allergies..."
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea 
                  id="medicalHistory" 
                  placeholder="Previous conditions, surgeries, etc..."
                  rows={3}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input id="emergencyContact" placeholder="Emergency contact person" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input id="emergencyPhone" type="tel" placeholder="+1-555-0000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyRelation">Relationship</Label>
                <Input id="emergencyRelation" placeholder="Spouse, parent, etc." />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Patient
              </Button>
              <Link href="/mobile/patients">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
