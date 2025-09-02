export { useAppointmentStore } from './appointment-store'
export { usePatientStore } from './patient-store'
export { useUIStore } from './ui-store'
export { useDeviceStore, useDevice, useDeviceRedirect } from './device-store'
export { useAuthStore, useAuth, useUser, useAuthStatus } from './auth-store'

// Convenience hooks
export {
  useSidebar,
  useMobileMenu,
  useTheme,
  useNotifications,
  useLoading,
  useToasts,
  useModals,
} from './ui-hooks'

// Re-export types for convenience
export type { NewAppointmentFormData, Appointment } from './appointment-store'
export type { PatientFormData, Patient } from './patient-store'
export type { Notification } from './ui-store'
