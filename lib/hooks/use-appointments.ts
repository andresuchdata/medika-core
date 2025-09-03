import { useState, useEffect } from 'react'
import { AppointmentWithNames } from '@/types'
import { appointmentService } from '@/lib/api/appointment-service'

interface UseAppointmentsOptions {
  date?: string
  status?: string
  doctorId?: string
  patientId?: string
  autoFetch?: boolean
}

interface UseAppointmentsReturn {
  appointments: AppointmentWithNames[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  createAppointment: (appointmentData: Partial<AppointmentWithNames>) => Promise<{ success: boolean; error?: string }>
}

export function useAppointments(options: UseAppointmentsOptions = {}): UseAppointmentsReturn {
  const { date, status, doctorId, patientId, autoFetch = true } = options
  
  const [appointments, setAppointments] = useState<AppointmentWithNames[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      if (date) params.date = date
      if (status) params.status = status
      if (doctorId) params.doctorId = doctorId
      if (patientId) params.patientId = patientId

      const response = await appointmentService.getAppointments(params)

      if (response.success && response.data) {
        setAppointments(response.data.appointments)
      } else {
        setError(response.message || 'Failed to fetch appointments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createAppointment = async (appointmentData: Partial<AppointmentWithNames>) => {
    try {
      // Convert AppointmentWithNames to Appointment format for the API
      const apiData = {
        ...appointmentData,
        date: appointmentData.date ? new Date(appointmentData.date) : undefined,
        createdAt: appointmentData.createdAt ? new Date(appointmentData.createdAt) : undefined,
        updatedAt: appointmentData.updatedAt ? new Date(appointmentData.updatedAt) : undefined,
      }
      const response = await appointmentService.createAppointment(apiData)

      if (response.success) {
        // Refresh the appointments list
        await fetchAppointments()
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to create appointment' }
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      }
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchAppointments()
    }
  }, [date, status, doctorId, patientId, autoFetch])

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
    createAppointment,
  }
}
