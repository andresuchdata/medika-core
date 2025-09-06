// Base API service
export { BaseApiService } from './base-api'

// Service instances
export { patientService, PatientService } from './patient-service'
export { doctorService, DoctorService } from './doctor-service'
export { organizationService, OrganizationService } from './organization-service'
export { queueService, QueueService } from './queue-service'
export { appointmentService, AppointmentService } from './appointment-service'
export { dashboardService } from './dashboard-service'

// Types from services
export type { 
  Doctor,
  DoctorsResponse, 
  DoctorsData
} from './doctor-service'
export type { 
  Organization,
  OrganizationsResponse, 
  OrganizationsData, 
  BusinessHours 
} from './organization-service'
export type { 
  QueueResponse, 
  QueueData 
} from './queue-service'
export type { 
  AppointmentResponse, 
  AppointmentData 
} from './appointment-service'
export type { 
  DashboardSummaryResponse,
  DashboardSummaryData,
  DashboardStats,
  RecentAppointment,
  SystemStatus,
  DashboardSummaryParams
} from './dashboard-service'
