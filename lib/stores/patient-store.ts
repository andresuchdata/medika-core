import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface PatientFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  address: string
  bloodType: string
  allergies: string
  medicalHistory: string
  emergencyContact: string
  emergencyPhone: string
  emergencyRelation: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email?: string
  phone: string
  address?: string
  bloodType?: string
  allergies?: string
  medicalHistory?: string
  emergencyContact?: string
  emergencyPhone?: string
  emergencyRelation?: string
  createdAt: string
  updatedAt: string
}

interface PatientState {
  // Patient form state
  patientForm: PatientFormData
  isFormDirty: boolean
  
  // Patients list
  patients: Patient[]
  isLoading: boolean
  error: string | null
  
  // Actions
  updatePatientForm: (data: Partial<PatientFormData>) => void
  resetPatientForm: () => void
  setFormDirty: (dirty: boolean) => void
  
  // Patient CRUD
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void
  setPatients: (patients: Patient[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultPatientForm: PatientFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  bloodType: '',
  allergies: '',
  medicalHistory: '',
  emergencyContact: '',
  emergencyPhone: '',
  emergencyRelation: '',
}

export const usePatientStore = create<PatientState>()(
  devtools(
    (set, get) => ({
      // Initial state
      patientForm: defaultPatientForm,
      isFormDirty: false,
      patients: [
        {
          id: 'john-doe',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          email: 'john.doe@email.com',
          phone: '+1-555-0123',
          address: '123 Main St, Anytown, USA',
          bloodType: 'O+',
          allergies: 'Penicillin',
          medicalHistory: 'Appendectomy in 2010',
          emergencyContact: 'Jane Doe',
          emergencyPhone: '+1-555-0124',
          emergencyRelation: 'Spouse',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'jane-smith',
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1990-07-22',
          gender: 'female',
          email: 'jane.smith@email.com',
          phone: '+1-555-0125',
          address: '456 Oak Ave, Somewhere, USA',
          bloodType: 'A+',
          allergies: 'None',
          medicalHistory: 'C-section in 2022',
          emergencyContact: 'Bob Smith',
          emergencyPhone: '+1-555-0126',
          emergencyRelation: 'Husband',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ],
      isLoading: false,
      error: null,
      
      // Patient form actions
      updatePatientForm: (data) => set((state) => ({
        patientForm: { ...state.patientForm, ...data },
        isFormDirty: true,
      })),
      
      resetPatientForm: () => set({
        patientForm: defaultPatientForm,
        isFormDirty: false,
      }),
      
      setFormDirty: (dirty) => set({ isFormDirty: dirty }),
      
      // Patient CRUD actions
      addPatient: (patientData) => set((state) => ({
        patients: [
          ...state.patients,
          {
            ...patientData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      })),
      
      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map((patient) =>
          patient.id === id
            ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
            : patient
        ),
      })),
      
      deletePatient: (id) => set((state) => ({
        patients: state.patients.filter((patient) => patient.id !== id),
      })),
      
      setPatients: (patients) => set({ patients }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'patient-store',
    }
  )
)
