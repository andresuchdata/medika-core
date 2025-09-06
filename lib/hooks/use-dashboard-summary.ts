import { useState, useEffect, useRef } from 'react'
import { dashboardService, DashboardSummaryResponse, DashboardSummaryParams } from '@/lib/api'

interface UseDashboardSummaryReturn {
  data: DashboardSummaryResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardSummary(organizationId?: string): UseDashboardSummaryReturn {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params: DashboardSummaryParams = {}
      if (organizationId) {
        params.organizationId = organizationId
      }

      const response = await dashboardService.getDashboardSummary(params)
      setData(response)
    } catch (err) {
      console.error('Dashboard summary fetching error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard summary')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on mount (only once)
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchData()
    }
  }, [organizationId])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
