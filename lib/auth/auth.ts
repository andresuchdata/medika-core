import { User, UserRole } from '@/types'

// JWT Token management
export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  organizationId?: string
  iat: number
  exp: number
}

// Mock JWT functions (replace with actual JWT library in production)
export const createJWT = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const token = btoa(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }))
  return token
}

export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = JSON.parse(atob(token))
    if (decoded.exp < Date.now()) {
      return null // Token expired
    }
    return decoded
  } catch {
    return null
  }
}

// Role-based access control
export const hasRole = (user: User, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(user.role)
}

export const isAdmin = (user: User): boolean => {
  return user.role === 'admin'
}

export const isDoctor = (user: User): boolean => {
  return user.role === 'doctor'
}

export const isNurse = (user: User): boolean => {
  return user.role === 'nurse'
}

export const isPatient = (user: User): boolean => {
  return user.role === 'patient'
}

export const isStaff = (user: User): boolean => {
  return ['admin', 'doctor', 'nurse', 'cashier'].includes(user.role)
}

// Permission checks
export const canViewPatient = (user: User, patientId: string): boolean => {
  if (isAdmin(user) || isStaff(user)) return true
  if (isPatient(user)) return user.id === patientId
  return false
}

export const canEditAppointment = (user: User, appointment: any): boolean => {
  if (isAdmin(user)) return true
  if (isDoctor(user) && appointment.doctorId === user.id) return true
  if (isNurse(user)) return true
  if (isPatient(user) && appointment.patientId === user.id) return true
  return false
}

export const canManageUsers = (user: User): boolean => {
  return ['admin', 'doctor'].includes(user.role)
}

export const canManageSchedule = (user: User): boolean => {
  return ['admin', 'doctor'].includes(user.role)
}
