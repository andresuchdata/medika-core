import { BaseApiService } from './base-api'

export interface DashboardStats {
  total_patients: number
  todays_appointments: number
  queue_length: number
  average_wait_time: string
  monthly_growth: string
  revenue: string
}

export interface RecentAppointment {
  id: string
  patient_name: string
  doctor_name: string
  time: string
  status: string
  type: string
}

export interface SystemStatus {
  database: string
  file_storage: string
  notifications: string
}

export interface DashboardSummaryData {
  stats: DashboardStats
  recent_appointments: RecentAppointment[]
  system_status: SystemStatus
}

export interface DashboardSummaryResponse {
  success: boolean
  data: DashboardSummaryData
  message: string
}

export interface DashboardSummaryParams {
  organizationId?: string
}

class DashboardService extends BaseApiService {
  async getDashboardSummary(params?: DashboardSummaryParams): Promise<DashboardSummaryResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.organizationId) {
      queryParams.append('organizationId', params.organizationId)
    }

    const url = `/api/v1/dashboard/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    return this.get<DashboardSummaryResponse>(url)
  }
}

export const dashboardService = new DashboardService()
