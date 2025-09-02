import { create } from 'zustand'
import { Organization } from '@/types'

interface OrganizationState {
  // Organization data
  organizations: Record<string, Organization>
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchOrganization: (id: string) => Promise<Organization | null>
  clearError: () => void
}

export const useOrganizationStore = create<OrganizationState>()((set, get) => ({
  // Initial state
  organizations: {},
  isLoading: false,
  error: null,
  
  // Actions
  fetchOrganization: async (id: string): Promise<Organization | null> => {
    const state = get()
    
    // Return cached organization if available
    if (state.organizations[id]) {
      return state.organizations[id]
    }
    
    set({ isLoading: true, error: null })
    
    try {
      // For now, use mock data until we have the backend API ready
      // TODO: Replace with actual API call
      const mockOrganizations: Record<string, Organization> = {
        '01234567-89ab-cdef-0123-456789abcdef': {
          id: '01234567-89ab-cdef-0123-456789abcdef',
          name: 'Medika General Hospital',
          type: 'hospital',
          address: '123 Medical Center Dr, Healthcare City, HC 12345',
          phone: '+1-555-0123',
          email: 'info@medikahospital.com',
          website: 'https://medikahospital.com',
          businessHours: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        '01234567-89ab-cdef-0123-456789abcde0': {
          id: '01234567-89ab-cdef-0123-456789abcde0',
          name: 'Downtown Medical Clinic',
          type: 'clinic',
          address: '456 Downtown Ave, Medical District, MD 67890',
          phone: '+1-555-0456',
          email: 'contact@downtownmedical.com',
          website: 'https://downtownmedical.com',
          businessHours: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        '01234567-89ab-cdef-0123-456789abcde1': {
          id: '01234567-89ab-cdef-0123-456789abcde1',
          name: 'Private Practice Center',
          type: 'private_practice',
          address: '789 Health St, Wellness Plaza, WP 54321',
          phone: '+1-555-0789',
          email: 'info@privatepractice.com',
          website: 'https://privatepractice.com',
          businessHours: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
      
      const organization = mockOrganizations[id]
      
      if (organization) {
        set(state => ({
          organizations: { ...state.organizations, [id]: organization },
          isLoading: false
        }))
        return organization
      } else {
        set({ isLoading: false, error: 'Organization not found' })
        return null
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch organization' 
      })
      return null
    }
  },
  
  clearError: () => set({ error: null }),
}))

// Convenience hooks
export const useOrganization = (id?: string) => {
  const store = useOrganizationStore()
  
  if (!id) return { organization: null, isLoading: store.isLoading, error: store.error }
  
  return {
    organization: store.organizations[id] || null,
    isLoading: store.isLoading,
    error: store.error,
    fetchOrganization: () => store.fetchOrganization(id),
  }
}
