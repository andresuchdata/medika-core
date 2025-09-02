import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface NewAppointmentFormData {
  patient: string
  doctor: string
  date: string
  time: string
  type: string
  notes: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

interface AppointmentState {
  // New appointment form state
  newAppointmentForm: NewAppointmentFormData
  isFormDirty: boolean
  
  // Appointments list
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  
  // Actions
  updateNewAppointmentForm: (data: Partial<NewAppointmentFormData>) => void
  resetNewAppointmentForm: () => void
  setFormDirty: (dirty: boolean) => void
  
  // Appointment CRUD
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  setAppointments: (appointments: Appointment[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultNewAppointmentForm: NewAppointmentFormData = {
  patient: '',
  doctor: '',
  date: '',
  time: '',
  type: '',
  notes: '',
}

export const useAppointmentStore = create<AppointmentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      newAppointmentForm: defaultNewAppointmentForm,
      isFormDirty: false,
      appointments: [
        {
          id: '1',
          patientId: 'john-doe',
          patientName: 'John Doe',
          doctorId: 'dr-sarah',
          doctorName: 'Dr. Sarah Johnson',
          date: '2024-01-15',
          time: '09:00',
          type: 'consultation',
          status: 'scheduled',
          notes: 'Regular checkup',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          patientId: 'jane-smith',
          patientName: 'Jane Smith',
          doctorId: 'dr-mike',
          doctorName: 'Dr. Mike Wilson',
          date: '2024-01-16',
          time: '14:30',
          type: 'follow-up',
          status: 'scheduled',
          notes: 'Follow-up after surgery',
          createdAt: '2024-01-10T11:00:00Z',
          updatedAt: '2024-01-10T11:00:00Z',
        },
      ],
      isLoading: false,
      error: null,
      
      // New appointment form actions
      updateNewAppointmentForm: (data) => set((state) => ({
        newAppointmentForm: { ...state.newAppointmentForm, ...data },
        isFormDirty: true,
      })),
      
      resetNewAppointmentForm: () => set({
        newAppointmentForm: defaultNewAppointmentForm,
        isFormDirty: false,
      }),
      
      setFormDirty: (dirty) => set({ isFormDirty: dirty }),
      
      // Appointment CRUD actions
      addAppointment: (appointmentData) => set((state) => ({
        appointments: [
          ...state.appointments,
          {
            ...appointmentData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),
      
      updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
            : appointment
        ),
      })),
      
      deleteAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter((appointment) => appointment.id !== id),
      })),
      
      setAppointments: (appointments) => set({ appointments }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'appointment-store',
    }
  )
)
