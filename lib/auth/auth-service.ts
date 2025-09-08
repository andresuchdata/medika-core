import { BaseApiService } from '@/lib/api/base-api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      organization_id?: string
      phone?: string
      avatar?: string
      is_active: boolean
      profile: any
    }
    token: string
  }
  message: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: string
  organizationId?: string
  phone?: string
}

export interface RegisterResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      name: string
      role: string
      organizationId?: string
      phone?: string
      avatar?: string
      isActive: boolean
    }
    token: string
  }
  message: string
}

export class AuthService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/v1/auth/login', credentials)
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('/api/v1/auth/register', userData)
  }

  async getCurrentUser(): Promise<any> {
    return this.get('/api/v1/users/me')
  }

  async updateProfile(userId: string, profileData: any): Promise<any> {
    return this.put(`/api/v1/users/${userId}/profile`, profileData)
  }

  async updateAvatar(userId: string, avatarData: any): Promise<any> {
    return this.put(`/api/v1/users/${userId}/avatar`, avatarData)
  }
}

export const authService = new AuthService()
