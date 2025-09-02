import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'

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
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            const { data: loginData } = data

            if (data.success && loginData) {
              const userObj = {
                id: loginData.user.id,
                email: loginData.user.email,
                name: loginData.user.name,
                role: loginData.user.role,
                organizationId: loginData.user.organization_id,
                phone: loginData.user.phone,
                avatar: loginData.user.avatar_url,
                isActive: loginData.user.is_active
              }

              set({
                token: loginData.token,
                user: userObj,
                isAuthenticated: true,
                isLoading: false
              })
              
              // Store in localStorage and set cookie for middleware
              localStorage.setItem('auth_token', data.token)
              localStorage.setItem('auth_user', JSON.stringify(userObj))
              
              // Set cookie for middleware to read
              document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
              
              return { success: true }
            } else {
              set({ isLoading: false })
              return { 
                success: false, 
                error: data.message || data.error || 'Login failed' 
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
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, email, password, role }),
            })

            const data = await response.json()

            if (data.success && data.token && data.user) {
              const userObj = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                organizationId: data.user.organization_id,
                phone: data.user.phone,
                avatar: data.user.avatar_url,
                isActive: data.user.is_active
              }

              set({
                token: data.token,
                user: userObj,
                isAuthenticated: true,
                isLoading: false
              })
              
              // Store in localStorage and set cookie for middleware
              localStorage.setItem('auth_token', data.token)
              localStorage.setItem('auth_user', JSON.stringify(userObj))
              
              // Set cookie for middleware to read
              document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
              
              return { success: true }
            } else {
              set({ isLoading: false })
              return { 
                success: false, 
                error: data.message || data.error || 'Registration failed' 
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
