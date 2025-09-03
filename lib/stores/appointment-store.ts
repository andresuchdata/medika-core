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

interface AppointmentFormState {
  // New appointment form state
  newAppointmentForm: NewAppointmentFormData
  isFormDirty: boolean
  
  // Actions
  updateNewAppointmentForm: (data: Partial<NewAppointmentFormData>) => void
  resetNewAppointmentForm: () => void
  setFormDirty: (dirty: boolean) => void
}

const defaultNewAppointmentForm: NewAppointmentFormData = {
  patient: '',
  doctor: '',
  date: '',
  time: '',
  type: '',
  notes: '',
}

export const useAppointmentFormStore = create<AppointmentFormState>()(
  devtools(
    (set) => ({
      // Initial state
      newAppointmentForm: defaultNewAppointmentForm,
      isFormDirty: false,
      
      // Form actions
      updateNewAppointmentForm: (data) => set((state) => ({
        newAppointmentForm: { ...state.newAppointmentForm, ...data },
        isFormDirty: true,
      })),
      
      resetNewAppointmentForm: () => set({
        newAppointmentForm: defaultNewAppointmentForm,
        isFormDirty: false,
      }),
      
      setFormDirty: (dirty) => set({ isFormDirty: dirty }),
    }),
    {
      name: 'appointment-form-store',
    }
  )
)
