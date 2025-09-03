"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { PatientsResponse } from '@/types'
import { patientService, doctorService, organizationService, queueService, appointmentService } from '@/lib/api'
import type { DoctorsResponse, OrganizationsResponse } from '@/lib/api'

interface UseDataFetchingOptions<T> {
  fetchFn: () => Promise<T>
  initialData?: T | null
  autoFetch?: boolean
}

interface UseDataFetchingReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: (data: T) => void
}

export function useDataFetching<T>({
  fetchFn,
  initialData = null,
  autoFetch = true
}: UseDataFetchingOptions<T>): UseDataFetchingReturn<T> {
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const hasFetchedRef = useRef(false)

  const fetchData = useCallback(async () => {
    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFn()

      // Check if still mounted before updating state
      if (!isMountedRef.current) return

      setData(result)
    } catch (err) {
      // Check if still mounted before updating state
      if (!isMountedRef.current) return
      
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data'
      setError(errorMessage)
      console.error('Data fetching error:', err)
    } finally {
      // Check if still mounted before updating state
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetchFn])

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true
    
    // Only fetch once on first render
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchData()
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false
    }
  }, [fetchData, autoFetch])

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    data,
    loading,
    error,
    refetch: fetchData,
    setData
  }), [data, loading, error, fetchData])

  return returnValue
}

// Specialized hooks for specific data types
export function useDoctors(params?: Record<string, string | number>) {
  return useDataFetching<DoctorsResponse>({
    fetchFn: () => doctorService.getDoctors(params),
    autoFetch: true
  })
}

export function useQueue(params?: Record<string, string | number>) {
  return useDataFetching({
    fetchFn: () => queueService.getQueue(params),
    autoFetch: true
  })
}

export function usePatients(params?: Record<string, string | number>) {
  return useDataFetching<PatientsResponse>({
    fetchFn: () => patientService.getPatients(params),
    autoFetch: true
  })
}

export function useMedicalRecords() {
  return useDataFetching({
    fetchFn: () => Promise.resolve({ success: true, data: [], message: 'Not implemented yet' }),
    autoFetch: true
  })
}

export function useOrganizations(params?: Record<string, string | number>) {
  return useDataFetching<OrganizationsResponse>({
    fetchFn: () => organizationService.getOrganizations(params),
    autoFetch: true
  })
}
