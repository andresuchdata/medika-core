import { BaseApiService } from './base-api'
import { ApiResponse } from '@/types'

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  licenseNumber: string
  status: 'active' | 'inactive' | 'on-leave'
  organizationId: string
  avatar?: string
  bio?: string
  experience?: number
  education?: string[]
  certifications?: string[]
  nextAvailable?: string
  createdAt: string
  updatedAt: string
}

export interface DoctorsData {
  doctors: Doctor[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    active: number
    inactive: number
    onLeave: number
    specialties: Record<string, number>
  }
}

export type DoctorsResponse = ApiResponse<DoctorsData>

export class DoctorService extends BaseApiService {
  async getDoctors(params?: {
    limit?: number
    page?: number
    organizationId?: string
    specialty?: string
    status?: string
  }): Promise<DoctorsResponse> {
    return this.get<DoctorsResponse>('/api/v1/doctors', params)
  }

  async getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    return this.get<ApiResponse<Doctor>>(`/api/v1/doctors/${id}`)
  }

  async createDoctor(doctorData: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return this.post<ApiResponse<Doctor>>('/api/v1/doctors', doctorData)
  }

  async updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    return this.put<ApiResponse<Doctor>>(`/api/v1/doctors/${id}`, doctorData)
  }

  async deleteDoctor(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<ApiResponse<{ message: string }>>(`/api/v1/doctors/${id}`)
  }

  async getDoctorSchedule(doctorId: string, params?: {
    date?: string
    organizationId?: string
  }): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/api/v1/doctors/${doctorId}/schedule`, params)
  }

  async getDoctorAvailability(doctorId: string, params?: {
    date?: string
    organizationId?: string
  }): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/api/v1/doctors/${doctorId}/availability`, params)
  }
}

// Export singleton instance
export const doctorService = new DoctorService()
