import { BaseApiService } from './base-api'
import { PatientsResponse, Patient, ApiResponse } from '@/types'

export class PatientService extends BaseApiService {
  async getPatients(params?: {
    limit?: number
    page?: number
    organizationId?: string
    status?: string
    gender?: string
  }): Promise<PatientsResponse> {
    return this.get<PatientsResponse>('/api/v1/patients', params)
  }

  async getPatientById(id: string): Promise<ApiResponse<Patient>> {
    return this.get<ApiResponse<Patient>>(`/api/v1/patients/${id}`)
  }

  async createPatient(patientData: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.post<ApiResponse<Patient>>('/api/v1/patients', patientData)
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.put<ApiResponse<Patient>>(`/api/v1/patients/${id}`, patientData)
  }

  async deletePatient(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<ApiResponse<{ message: string }>>(`/api/v1/patients/${id}`)
  }
}

// Export singleton instance
export const patientService = new PatientService()
