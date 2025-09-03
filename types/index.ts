// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string
  phone?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'cashier'

export interface UserProfile {
  id: string
  userId: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  address?: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: string[]
  bloodType?: string
}

// Patient Types
export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  age: number
  gender: 'male' | 'female' | 'other'
  avatar?: string | null
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory: MedicalCondition[]
  allergies: string[]
  medications: Medication[]
  lastVisit?: string
  nextAppointment?: string
  status: 'active' | 'inactive'
  organizationId: string
}

export interface MedicalCondition {
  condition: string
  diagnosedDate: string
  status: 'active' | 'resolved' | 'chronic'
  notes?: string
}

export interface Medication {
  name: string
  dosage: string
  prescribedDate: string
  status: 'active' | 'discontinued' | 'completed'
}

// API Response Types for Patients
export interface PatientsData {
  patients: Patient[]
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
    averageAge: number
    genderDistribution: {
      male: number
      female: number
    }
  }
}

export type PatientsResponse = ApiResponse<PatientsData>

// Organization Types
export interface Organization {
  id: string
  name: string
  type: 'hospital' | 'clinic' | 'private_practice'
  address: string
  phone: string
  email: string
  website?: string
  businessHours: BusinessHours[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BusinessHours {
  day: number // 0-6 (Sunday-Saturday)
  open: string // "09:00"
  close: string // "17:00"
  isOpen: boolean
}

// Appointment Types
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  organizationId: string
  roomId?: string
  date: Date
  startTime: string // "09:00"
  endTime: string // "09:30"
  duration: number // minutes
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Extended Appointment type for API responses (includes patient and doctor names)
export interface AppointmentWithNames {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  organizationId: string
  roomId?: string
  date: string // API returns date as string
  startTime: string
  endTime: string
  duration: number
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: string // API returns as ISO string
  updatedAt: string // API returns as ISO string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup'

// Schedule Types
export interface DoctorSchedule {
  id: string
  doctorId: string
  organizationId: string
  dayOfWeek: number // 0-6
  startTime: string
  endTime: string
  isAvailable: boolean
  maxAppointments: number
  createdAt: Date
  updatedAt: Date
}

// Queue Types
export interface PatientQueue {
  id: string
  appointmentId: string
  organizationId: string
  position: number
  estimatedWaitTime: number // minutes
  status: QueueStatus
  createdAt: Date
  updatedAt: Date
}

export type QueueStatus = 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled'

// Room Types
export interface Room {
  id: string
  organizationId: string
  name: string
  type: RoomType
  capacity: number
  isAvailable: boolean
  equipment?: string[]
  createdAt: Date
  updatedAt: Date
}

export type RoomType = 'consultation' | 'examination' | 'procedure' | 'waiting' | 'office'

// Media Types
export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  organizationId: string
  metadata?: Record<string, any>
  processingStatus: ProcessingStatus
  createdAt: Date
  updatedAt: Date
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  channels: NotificationChannel[]
  priority: NotificationPriority
  scheduledFor?: Date
  sentAt?: Date
  createdAt: Date
}

export type NotificationType = 
  | 'appointment_created'
  | 'appointment_reminder'
  | 'appointment_status_update'
  | 'queue_position_update'
  | 'doctor_ready'
  | 'system_alert'
  | 'security_alert'

export type NotificationChannel = 'fcm' | 'email' | 'websocket' | 'sms'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  organizationId?: string
}

export interface AppointmentForm {
  doctorId: string
  date: string
  time: string
  type: AppointmentType
  notes?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
