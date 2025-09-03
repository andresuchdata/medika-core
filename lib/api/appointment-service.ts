import { BaseApiService } from './base-api'
import { ApiResponse, Appointment, AppointmentWithNames } from '@/types'

export interface AppointmentData {
  appointments: AppointmentWithNames[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    pending: number
    confirmed: number
    inProgress: number
    completed: number
    cancelled: number
    noShow: number
  }
}

export type AppointmentResponse = ApiResponse<AppointmentData>

export class AppointmentService extends BaseApiService {
  async getAppointments(params?: {
    organizationId?: string
    doctorId?: string
    patientId?: string
    status?: string
    date?: string
    limit?: number
    page?: number
  }): Promise<AppointmentResponse> {
    return this.get<AppointmentResponse>('/api/v1/appointments', params)
  }

  async getAppointmentById(id: string): Promise<ApiResponse<AppointmentWithNames>> {
    return this.get<ApiResponse<AppointmentWithNames>>(`/api/v1/appointments/${id}`)
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.post<ApiResponse<Appointment>>('/api/v1/appointments', appointmentData)
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}`, appointmentData)
  }

  async deleteAppointment(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<ApiResponse<{ message: string }>>(`/api/v1/appointments/${id}`)
  }

  async getAppointmentsByDate(date: string, params?: {
    organizationId?: string
    doctorId?: string
    status?: string
  }): Promise<AppointmentResponse> {
    return this.get<AppointmentResponse>('/api/v1/appointments', { date, ...params })
  }

  async updateAppointmentStatus(id: string, status: string): Promise<ApiResponse<Appointment>> {
    return this.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/status`, { status })
  }

  async getUpcomingAppointments(params?: {
    organizationId?: string
    doctorId?: string
    patientId?: string
    limit?: number
  }): Promise<AppointmentResponse> {
    return this.get<AppointmentResponse>('/api/v1/appointments/upcoming', params)
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService()
