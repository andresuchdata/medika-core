import { useState, useEffect } from 'react'
import { AppointmentWithNames } from '@/types'

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
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (status) params.append('status', status)
      if (doctorId) params.append('doctorId', doctorId)
      if (patientId) params.append('patientId', patientId)

      const response = await fetch(`/api/appointments?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setAppointments(data.data)
      } else {
        setError(data.error || 'Failed to fetch appointments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const createAppointment = async (appointmentData: Partial<AppointmentWithNames>) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the appointments list
        await fetchAppointments()
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to create appointment' }
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
