import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import { authService } from '@/lib/auth/auth-service'

interface User {
  id: string
  email: string
  name: string
  role: string
  organizationId?: string
  phone?: string
  avatar?: string
  isActive: boolean
}

interface AuthState {
  // Auth state
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<boolean>
  setLoading: (loading: boolean) => void
  updateAvatar: (avatarUrl: string) => void
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
        
        // Actions
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        
        checkAuth: async (): Promise<boolean> => {
          try {
            const storedToken = localStorage.getItem('auth_token')
            const storedUser = localStorage.getItem('auth_user')

            if (storedToken && storedUser) {
              const parsedUser = JSON.parse(storedUser)
              
              // TODO: Verify token with backend in production
              // For now, just check if token exists and user data is valid
              if (parsedUser.id && parsedUser.email) {
                // Ensure all required fields are present
                const userObj = {
                  id: parsedUser.id,
                  email: parsedUser.email,
                  name: parsedUser.name || '',
                  role: parsedUser.role || '',
                  organizationId: parsedUser.organizationId,
                  phone: parsedUser.phone,
                  avatar: parsedUser.avatar,
                  isActive: parsedUser.isActive !== undefined ? parsedUser.isActive : true
                }
                
                set({
                  token: storedToken,
                  user: userObj,
                  isAuthenticated: true,
                  isLoading: false
                })

                return true
              }
            }
            
            set({ isLoading: false, isAuthenticated: false })
            return false
          } catch (error) {
            console.error('Auth check failed:', error)
            set({ isLoading: false, isAuthenticated: false })
            return false
          }
        },
        
        login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
          set({ isLoading: true })
          
          try {
            const response = await authService.login({ email, password })

            if (response.success && response.data) {
              const userObj = {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.name,
                role: response.data.user.role,
                organizationId: response.data.user.organizationId,
                phone: response.data.user.phone,
                avatar: response.data.user.avatar,
                isActive: response.data.user.isActive
              }

              set({
                token: response.data.token,
                user: userObj,
                isAuthenticated: true,
                isLoading: false
              })
              
              // Store in localStorage and set cookie for middleware
              localStorage.setItem('auth_token', response.data.token)
              localStorage.setItem('auth_user', JSON.stringify(userObj))
              
              // Set cookie for middleware to read
              document.cookie = `auth_token=${response.data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
              
              return { success: true }
            } else {
              set({ isLoading: false })
              return { 
                success: false, 
                error: response.message || 'Login failed' 
              }
            }
          } catch (error) {
            set({ isLoading: false })
            return { 
              success: false, 
              error: 'Network error. Please try again.' 
            }
          }
        },
        
        register: async (name: string, email: string, password: string, role: string = 'patient'): Promise<{ success: boolean; error?: string }> => {
          set({ isLoading: true })
          
          try {
            const response = await authService.register({ name, email, password, role })

            if (response.success && response.data) {
              const userObj = {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.name,
                role: response.data.user.role,
                organizationId: response.data.user.organizationId,
                phone: response.data.user.phone,
                avatar: response.data.user.avatar,
                isActive: response.data.user.isActive
              }

              set({
                token: response.data.token,
                user: userObj,
                isAuthenticated: true,
                isLoading: false
              })
              
              // Store in localStorage and set cookie for middleware
              localStorage.setItem('auth_token', response.data.token)
              localStorage.setItem('auth_user', JSON.stringify(userObj))
              
              // Set cookie for middleware to read
              document.cookie = `auth_token=${response.data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
              
              return { success: true }
            } else {
              set({ isLoading: false })
              return { 
                success: false, 
                error: response.message || 'Registration failed' 
              }
            }
          } catch (error) {
            set({ isLoading: false })
            return { 
              success: false, 
              error: 'Network error. Please try again.' 
            }
          }
        },
        
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          
          // Clear cookie
          document.cookie = 'auth_token=; path=/; max-age=0'
          
          // Redirect to appropriate login page based on current route
          const currentPath = window.location.pathname
          const loginPath = currentPath.startsWith('/mobile') ? '/mobile/login' : '/login'
          window.location.href = loginPath
        },
        
        updateAvatar: (avatarUrl: string) => {
          set(state => {
            if (state.user) {
              const updatedUser = { ...state.user, avatar: avatarUrl }
              
              // Update localStorage
              localStorage.setItem('auth_user', JSON.stringify(updatedUser))
              
              return { user: updatedUser }
            }
            return state
          })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
        onRehydrateStorage: () => (state) => {
          // Rehydrate isAuthenticated based on stored data
          if (state) {
            state.isAuthenticated = !!(state.user && state.token)
          }
        },
      }
    )
  )
)

// Initialize auth check on mount
if (typeof window !== 'undefined') {
  const store = useAuthStore.getState()
  store.checkAuth()
}

// Convenience hooks
export const useAuth = () => {
  const store = useAuthStore()

  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
    updateAvatar: store.updateAvatar,
  }
}

export const useUser = () => {
  const { user, isAuthenticated } = useAuthStore()
  return { user, isAuthenticated }
}

export const useAuthStatus = () => {
  const { isLoading, isAuthenticated } = useAuthStore()
  return { isLoading, isAuthenticated }
}
