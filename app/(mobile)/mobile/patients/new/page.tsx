"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PhoneInput } from '@/components/ui/phone-input'
import { User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppointmentFormStore } from '@/lib/stores'

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(6, 'Phone is required'),
  address: z.string().optional().or(z.literal('')),
  bloodType: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  medicalHistory: z.string().optional().or(z.literal('')),
  emergencyContact: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')),
  emergencyRelation: z.string().optional().or(z.literal('')),
})

type PatientFormValues = z.infer<typeof patientSchema>

export default function MobileNewPatientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromAppointment = searchParams.get('from') === 'appointment'
  const { newAppointmentForm: appointmentFormData } = useAppointmentFormStore()
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      bloodType: '',
      allergies: '',
      medicalHistory: '',
      emergencyContact: '',
      emergencyPhone: '',
      emergencyRelation: '',
    },
  })

  const onSubmit = (data: PatientFormValues) => {
    // TODO: handle submit
    console.log('Patient form submit', data)
    
    // If coming from appointment page, go back to appointment with success message
    if (fromAppointment) {
      router.push('/mobile/appointments/new?newPatient=true')
    } else {
      router.push('/mobile/patients')
    }
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            if (fromAppointment) {
              router.push('/mobile/appointments/new?newPatient=true')
            } else {
              router.push('/mobile/patients')
            }
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Patient</h1>
          <p className="text-sm text-gray-600">
            {fromAppointment ? 'Add a new patient for appointment' : 'Add a new patient to the system'}
          </p>
        </div>
      </div>
      
      {/* Breadcrumb navigation */}
      {fromAppointment && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/mobile/appointments" className="hover:text-foreground">
              Appointments
            </Link>
            <span>/</span>
            <Link href="/mobile/appointments/new" className="hover:text-foreground">
              New Appointment
            </Link>
            <span>/</span>
            <span className="text-foreground">New Patient</span>
          </div>
          
          {/* Form state preservation indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-800">
                Your appointment details are saved. You'll return to complete the appointment after adding the patient.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any known allergies..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Previous conditions, surgeries, etc..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1-555-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergencyRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Spouse, parent, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Patient
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (fromAppointment) {
                    router.push('/mobile/appointments/new?newPatient=true')
                  } else {
                    router.push('/mobile/patients')
                  }
                }}
              >
                Cancel
              </Button>
            </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Bottom spacing to prevent overlap with bottom navigation */}
      <div className="h-20"></div>
    </div>
  )
}

