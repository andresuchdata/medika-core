export type { Organization } from '@/lib/api/organization-service'

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

// Indonesian address — 5-level administrative hierarchy
export interface Alamat {
  jalan: string
  rt?: string
  rw?: string
  kelurahan?: string
  kecamatan?: string
  kabupaten: string
  provinsi: string
  kodePos?: string
  kodeWilayah?: string
}

// BPJS / insurance membership
export interface Penjamin {
  id: string
  jenis: 'bpjs_kesehatan' | 'bpjs_ketenagakerjaan' | 'asuransi' | 'umum'
  nomorKartu: string
  kelas?: '1' | '2' | '3'
  segmen?: 'PBI' | 'PBPU' | 'PPU' | 'BP'
  faskesTk1?: string
  status: 'aktif' | 'nonaktif'
  validUntil?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
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

// Patient Types — Indonesian fields
export interface Patient {
  id: string
  noRekamMedis: string
  nik: string
  ihsNumber?: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  age: number
  jenisKelamin: 'L' | 'P'
  golonganDarah?: string
  agama?: string
  statusPerkawinan?: string
  avatar?: string | null
  alamat: Alamat
  emergencyContact: EmergencyContact
  medicalHistory: MedicalCondition[]
  allergies: string[]
  medications: Medication[]
  penjamin: Penjamin[]
  lastVisit?: string
  nextAppointment?: string
  status: 'active' | 'inactive'
  organizationId: string
  createdAt: string
  updatedAt: string
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

// Appointment Types
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  organizationId: string
  roomId?: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentWithNames {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  organizationId: string
  roomId?: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: string
  updatedAt: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type AppointmentType = 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup'

// Queue Types
export interface PatientQueue {
  id: string
  appointmentId: string
  organizationId: string
  position: number
  estimatedWaitTime: number
  status: QueueStatus
  createdAt: Date
  updatedAt: Date
}

export interface PatientQueueWithDetails extends PatientQueue {
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  appointmentType: string
  appointmentStatus: string
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

// Pharmacy Types (demo — maps to completed queue items)
export interface PharmacyItem {
  id: string
  patientId: string
  patientName: string
  noRekamMedis?: string
  doctorName: string
  appointmentTime: string
  prescriptions: Prescription[]
  status: 'menunggu' | 'diproses' | 'selesai'
  completedAt?: string
}

export interface Prescription {
  name: string
  dosage: string
  qty: number
  notes?: string
}

export interface DoctorSchedule {
  id: string
  doctorId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Media {
  id: string
  url: string
  type: string
  ownerId: string
}
