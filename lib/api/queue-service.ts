import { BaseApiService } from './base-api'
import { ApiResponse, PatientQueue } from '@/types'

export interface QueueData {
  queue: PatientQueue[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    waiting: number
    called: number
    inProgress: number
    completed: number
    cancelled: number
    averageWaitTime: number
    estimatedWaitTime: number
  }
}

export type QueueResponse = ApiResponse<QueueData>

export class QueueService extends BaseApiService {
  async getQueue(params?: {
    organizationId?: string
    status?: string
    doctorId?: string
    limit?: number
    page?: number
  }): Promise<QueueResponse> {
    return this.get<QueueResponse>('/api/v1/queues', params)
  }

  async getQueueStats(organizationId?: string): Promise<QueueResponse> {
    return this.get<QueueResponse>('/api/v1/queues/stats', { organizationId: organizationId ? organizationId : '' })
  }

  async addToQueue(appointmentId: string, organizationId: string): Promise<ApiResponse<PatientQueue>> {
    return this.post<ApiResponse<PatientQueue>>('/api/v1/queues', { appointmentId, organizationId })
  }

  async updateQueuePosition(queueId: string, position: number): Promise<ApiResponse<PatientQueue>> {
    return this.put<ApiResponse<PatientQueue>>(`/api/v1/queues/${queueId}`, { position })
  }

  async updateQueueStatus(queueId: string, status: string): Promise<ApiResponse<PatientQueue>> {
    return this.put<ApiResponse<PatientQueue>>(`/api/v1/queues/${queueId}`, { status })
  }

  async removeFromQueue(queueId: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<ApiResponse<{ message: string }>>(`/api/v1/queues/${queueId}`)
  }

  async getQueuePosition(appointmentId: string): Promise<ApiResponse<PatientQueue>> {
    return this.get<ApiResponse<PatientQueue>>(`/api/v1/queues/appointment/${appointmentId}`)
  }
}

// Export singleton instance
export const queueService = new QueueService()
