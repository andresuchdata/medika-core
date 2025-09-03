import { BaseApiService } from './base-api'
import { ApiResponse } from '@/types'

export interface Organization {
  id: string
  name: string
  type: 'hospital' | 'clinic' | 'urgent_care' | 'private_practice' | 'laboratory'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  phone: string
  email: string
  website?: string
  status: 'active' | 'inactive'
  businessHours: BusinessHours[]
  staffCount: number
  facilities: string[]
  services: string[]
  createdAt: string
  updatedAt: string
}

export interface BusinessHours {
  day: number // 0-6 (Sunday-Saturday)
  open: string // "09:00"
  close: string // "17:00"
  isOpen: boolean
}

export interface OrganizationsData {
  organizations: Organization[]
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
    types: Record<string, number>
    totalStaff: number
  }
}

export type OrganizationsResponse = ApiResponse<OrganizationsData>

export class OrganizationService extends BaseApiService {
  async getOrganizations(params?: {
    limit?: number
    page?: number
    type?: string
    status?: string
    city?: string
    state?: string
  }): Promise<OrganizationsResponse> {
    return this.get<OrganizationsResponse>('/api/v1/organizations', params)
  }

  async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    return this.get<ApiResponse<Organization>>(`/api/v1/organizations/${id}`)
  }

  async createOrganization(organizationData: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.post<ApiResponse<Organization>>('/api/v1/organizations', organizationData)
  }

  async updateOrganization(id: string, organizationData: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.put<ApiResponse<Organization>>(`/api/v1/organizations/${id}`, organizationData)
  }

  async deleteOrganization(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<ApiResponse<{ message: string }>>(`/api/v1/organizations/${id}`)
  }

  async getOrganizationStats(organizationId: string): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/api/v1/organizations/${organizationId}/stats`)
  }

  async getOrganizationStaff(organizationId: string, params?: {
    limit?: number
    page?: number
    role?: string
    status?: string
  }): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`/api/v1/organizations/${organizationId}/staff`, params)
  }
}

// Export singleton instance
export const organizationService = new OrganizationService()
