import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { queueService } from '@/lib/api/queue-service'

interface QueueStats {
  total: number
  waiting: number
  inProgress: number
  averageWaitTime: string
}

interface QueueItem {
  id: string
  appointmentId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  position: number
  estimatedWaitTime: number
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled'
  appointmentTime: string
  appointmentType: string
}

interface PatientQueueData {
  id: string
  appointmentId: string
  organizationId: string
  position: number
  estimatedWaitTime: number
  status: string
  createdAt: string
  updatedAt: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  appointmentType: string
  appointmentStatus: string
}


interface QueueData {
  stats: QueueStats
  queues: QueueItem[]
}

interface UseQueueReturn {
  // General queue data
  queueData: QueueData | null
  queueLoading: boolean
  queueError: string | null
  
  // Patient-specific data
  patientQueueData: PatientQueueData | null
  patientQueueLoading: boolean
  patientQueueError: string | null
  
  // Actions
  refetchQueue: () => void
  refetchPatientQueue: () => void
}

export function useQueue(): UseQueueReturn {
  const { user } = useAuth()
  const isPatient = user?.role === 'patient'
  
  // General queue state
  const [queueData, setQueueData] = useState<QueueData | null>(null)
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState<string | null>(null)
  
  // Patient queue state
  const [patientQueueData, setPatientQueueData] = useState<PatientQueueData | null>(null)
  const [patientQueueLoading, setPatientQueueLoading] = useState(false)
  const [patientQueueError, setPatientQueueError] = useState<string | null>(null)
  
  // Cache to prevent duplicate requests
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [lastPatientFetchTime, setLastPatientFetchTime] = useState<number>(0)
  const CACHE_DURATION = 30000 // 30 seconds cache

  // Fetch general queue data (for staff)
  const fetchQueueData = useCallback(async () => {
    if (isPatient) return // Don't fetch general queue data for patients
    
    const now = Date.now()
    if (now - lastFetchTime < CACHE_DURATION) {
      return // Use cached data
    }
    
    setQueueLoading(true)
    setQueueError(null)
    
    try {
      // Add organization ID for staff members
      const params: any = { limit: 20 }
      if (user?.organizationId) {
        params.organizationId = user.organizationId
      }
      
      const result = await queueService.getQueue(params)
      
      if (result.success && result.data) {
        // Transform the API response to match our interface
        const transformedQueues = result.data.queue.map((queue: any) => ({
          id: queue.id,
          appointmentId: queue.appointment_id,
          patientId: queue.patient_id || '',
          patientName: queue.patient_name || 'Unknown Patient',
          doctorId: queue.doctor_id || '',
          doctorName: queue.doctor_name || 'Unknown Doctor',
          position: queue.position,
          estimatedWaitTime: queue.estimated_wait_time,
          status: queue.status,
          appointmentTime: queue.appointment_time || '00:00',
          appointmentType: queue.appointment_type || 'consultation'
        }))
        
        const stats: QueueStats = {
          total: result.data.pagination.total,
          waiting: result.data.stats.waiting,
          inProgress: result.data.stats.inProgress,
          averageWaitTime: `${result.data.stats.averageWaitTime} min`
        }
        
        setQueueData({ stats, queues: transformedQueues })
        setLastFetchTime(now)
      } else {
        throw new Error(result.message || 'Failed to fetch queue data')
      }
    } catch (error) {
      console.error('Error fetching queue data:', error)
      setQueueError(error instanceof Error ? error.message : 'Failed to fetch queue data')
    } finally {
      setQueueLoading(false)
    }
  }, [isPatient, lastFetchTime])

  // Fetch patient-specific queue data
  const fetchPatientQueueData = useCallback(async () => {
    if (!isPatient || !user?.id) return
    
    const now = Date.now()
    if (now - lastPatientFetchTime < CACHE_DURATION) {
      return // Use cached data
    }
    
    setPatientQueueLoading(true)
    setPatientQueueError(null)
    
    try {
      const result = await queueService.getPatientQueue(user.id)
      
      if (result.success) {
        if (result.data) {
          // Transform the backend response (snake_case) to frontend interface (camelCase)
          const backendData = result.data
          const transformedData: PatientQueueData = {
            id: backendData.id,
            appointmentId: backendData.appointment_id,
            organizationId: backendData.organization_id,
            position: backendData.position,
            estimatedWaitTime: backendData.estimated_wait_time,
            status: backendData.status,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at,
            patientName: backendData.patient_name,
            patientId: backendData.patient_id,
            doctorName: backendData.doctor_name,
            doctorId: backendData.doctor_id,
            appointmentDate: backendData.appointment_date,
            appointmentTime: backendData.appointment_time,
            appointmentType: backendData.appointment_type,
            appointmentStatus: backendData.appointment_status
          }
          setPatientQueueData(transformedData)
        } else {
          // No appointment today - set data to null
          setPatientQueueData(null)
        }
        setLastPatientFetchTime(now)
      } else {
        throw new Error(result.message || 'Failed to fetch patient queue data')
      }
    } catch (error) {
      console.error('Error fetching patient queue data:', error)
      setPatientQueueError(error instanceof Error ? error.message : 'Failed to fetch patient queue data')
    } finally {
      setPatientQueueLoading(false)
    }
  }, [isPatient, user?.id, lastPatientFetchTime])

  // Refetch functions
  const refetchQueue = useCallback(() => {
    setLastFetchTime(0) // Reset cache
    fetchQueueData()
  }, [fetchQueueData])

  const refetchPatientQueue = useCallback(() => {
    setLastPatientFetchTime(0) // Reset cache
    fetchPatientQueueData()
  }, [fetchPatientQueueData])

  // Effect to fetch data on mount and when user role changes
  useEffect(() => {
    if (isPatient) {
      fetchPatientQueueData()
    } else {
      fetchQueueData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPatient, user?.id]) // Only depend on role and user ID changes

  return {
    queueData,
    queueLoading,
    queueError,
    patientQueueData,
    patientQueueLoading,
    patientQueueError,
    refetchQueue,
    refetchPatientQueue,
  }
}
