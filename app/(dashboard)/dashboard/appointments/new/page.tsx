import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppointments } from '@/lib/hooks/use-appointments'
import { useDoctors, usePatients } from '@/lib/hooks/use-data-fetching'
import { useAuth } from '@/lib/stores/auth-store'
import { toast } from 'sonner'

const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.string().min(1, 'Type is required'),
  notes: z.string().optional().or(z.literal('')),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

export default function NewAppointmentPage() {
  const router = useRouter()
  const { createAppointment } = useAppointments()
  const { data: doctorsData, loading: doctorsLoading } = useDoctors()
  const { data: patientsData, loading: patientsLoading } = usePatients()
  const { user } = useAuth()
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: '',
      doctor: '',
      date: '',
      time: '',
      type: '',
      notes: '',
    },
  })

  const onSubmit = async (data: AppointmentFormValues) => {
    // Get organization ID from user or selected doctor
    let organizationId = user?.organizationId
    
    // If user doesn't have organization ID, get it from the selected doctor
    if (!organizationId && data.doctor) {
      const selectedDoctor = doctorsData?.data?.doctors?.find(doctor => doctor.id === data.doctor)
      organizationId = selectedDoctor?.organizationId
    }
    
    // Prevent submission if no organization ID is available
    if (!organizationId) {
      toast.error('Organization ID is required. Please select a doctor or log in again.')
      return
    }

    try {
      // Convert form data to API format
      const appointmentData = {
        patientId: data.patient,
        doctorId: data.doctor,
        organizationId: organizationId,
        date: data.date,
        startTime: data.time,
        endTime: data.time, // For now, same as start time
        duration: 30, // Default 30 minutes
        type: data.type as any, // Type assertion for now
        notes: data.notes || undefined,
      }

      const result = await createAppointment(appointmentData)
      
      if (result.success) {
        toast.success('Appointment created successfully!')
        form.reset()
        router.push('/dashboard/appointments')
      } else {
        toast.error(result.error || 'Failed to create appointment')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('An unexpected error occurred')
    }
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Appointment</h1>
          <p className="text-gray-600">Schedule a new patient appointment</p>
        </div>
      </div>

      {/* Appointment form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Details
          </CardTitle>
          <CardDescription>Fill in the appointment information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select value={form.watch("patient")} onValueChange={(value) => form.setValue("patient", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientsLoading ? (
                      <SelectItem value="loading" disabled>Loading patients...</SelectItem>
                    ) : patientsData?.data?.patients?.length ? (
                      patientsData.data.patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-patients" disabled>No patients found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select value={form.watch("doctor")} onValueChange={(value) => form.setValue("doctor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctorsLoading ? (
                      <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                    ) : doctorsData?.data?.doctors?.length ? (
                      doctorsData.data.doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-doctors" disabled>No doctors found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  type="date" 
                  id="date" 
                  {...form.register("date")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  type="time" 
                  id="time" 
                  {...form.register("time")}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="routine_checkup">Routine Check</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes about the appointment..."
                rows={3}
                {...form.register("notes")}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Schedule Appointment'}
              </Button>
              <Link href="/dashboard/appointments">
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
