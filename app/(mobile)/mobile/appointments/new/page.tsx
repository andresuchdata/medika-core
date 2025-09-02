"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TimePicker } from '@/components/ui/time-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link' 
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useAppointmentStore } from '@/lib/stores'

const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.string().min(1, 'Type is required'),
  notes: z.string().optional().or(z.literal('')),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

export default function MobileNewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const newPatientAdded = searchParams.get('newPatient') === 'true'
  const { 
    newAppointmentForm: formData, 
    updateNewAppointmentForm: updateFormData, 
    resetNewAppointmentForm: resetForm, 
    isFormDirty 
  } = useAppointmentStore()
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: formData,
  })
  
  // Sync form with context on mount only
  useEffect(() => {
    if (isFormDirty && Object.values(formData).some(value => value !== '')) {
      form.reset(formData)
    }
  }, []) // Empty dependency array - only run on mount
  
  // Update context when form values change (debounced)
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Only update if values are actually different to prevent loops
      const hasChanges = Object.keys(value).some(key => 
        value[key as keyof typeof value] !== formData[key as keyof typeof formData]
      )
      if (hasChanges) {
        updateFormData(value as AppointmentFormValues)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData, formData])
  
  // Show success message when returning from new patient page
  useEffect(() => {
    if (newPatientAdded) {
      // Clear the URL parameter
      router.replace('/mobile/appointments/new', { scroll: false })
    }
  }, [newPatientAdded, router])

  const onSubmit = (data: AppointmentFormValues) => {
    // TODO: handle submit
    console.log('Appointment form submit', data)
    
    // Reset form data in context after successful submission
    resetForm()
    
    // Show success message or redirect
    // For now, just reset the form
    form.reset()
  }
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mobile/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Appointment</h1>
          <p className="text-sm text-gray-600">Schedule a new patient appointment</p>
        </div>
      </div>
      
      {/* Success message when returning from new patient */}
      {newPatientAdded && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-800">
              Patient added successfully! You can now select them from the patient list.
            </p>
          </div>
        </div>
      )}
      
      {/* Form state indicator */}
      {isFormDirty && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800">
              You have unsaved appointment details. Your progress is automatically saved.
            </p>
          </div>
        </div>
      )}

      {/* Appointment form - white card like patient page */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Appointment</CardTitle>
          <CardDescription>Schedule a new patient appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <FormLabel>Patient</FormLabel>
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent 
                            searchable 
                            onAddNew={() => router.push('/mobile/patients/new?from=appointment')}
                            addNewLabel="New Patient"
                          >
                            <SelectItem value="john-doe">John Doe</SelectItem>
                            <SelectItem value="jane-smith">Jane Smith</SelectItem>
                            <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                            <SelectItem value="alice-brown">Alice Brown</SelectItem>
                            <SelectItem value="charlie-davis">Charlie Davis</SelectItem>
                            <SelectItem value="diana-evans">Diana Evans</SelectItem>
                            <SelectItem value="frank-garcia">Frank Garcia</SelectItem>
                            <SelectItem value="grace-harris">Grace Harris</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Doctor</FormLabel>
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                          <SelectContent searchable>
                            <SelectItem value="dr-sarah">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="dr-mike">Dr. Mike Wilson</SelectItem>
                            <SelectItem value="dr-emily">Dr. Emily Chen</SelectItem>
                            <SelectItem value="dr-david">Dr. David Rodriguez</SelectItem>
                            <SelectItem value="dr-lisa">Dr. Lisa Thompson</SelectItem>
                            <SelectItem value="dr-james">Dr. James Anderson</SelectItem>
                            <SelectItem value="dr-maria">Dr. Maria Garcia</SelectItem>
                            <SelectItem value="dr-robert">Dr. Robert Lee</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <TimePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Appointment Type</FormLabel>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="routine-check">Routine Check</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about the appointment..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Schedule Appointment
                </Button>
                <Link href="/mobile/appointments">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </Link>
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
