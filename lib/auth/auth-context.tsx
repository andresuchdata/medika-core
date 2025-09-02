'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  organizationId?: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && !!token

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        
        // TODO: Verify token with backend in production
        // For now, just check if token exists and user data is valid
        if (parsedUser.id && parsedUser.email) {
          setToken(storedToken)
          setUser(parsedUser)
          setIsLoading(false)
          return true
        }
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoading(false)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.token && data.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          organizationId: data.user.organization_id,
          isActive: data.user.is_active
        }

        setToken(data.token)
        setUser(userObj)
        
        // Store in localStorage and set cookie for middleware
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(userObj))
        
        // Set cookie for middleware to read
        document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
        
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { 
          success: false, 
          error: data.message || data.error || 'Login failed' 
        }
      }
    } catch (error) {
      setIsLoading(false)
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  const register = async (name: string, email: string, password: string, role: string = 'patient'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
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
          isActive: data.user.is_active
        }

        setToken(data.token)
        setUser(userObj)
        
        // Store in localStorage and set cookie for middleware
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(userObj))
        
        // Set cookie for middleware to read
        document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
        
        setIsLoading(false)
        return { success: true }
      } else {
        setIsLoading(false)
        return { 
          success: false, 
          error: data.message || data.error || 'Registration failed' 
        }
      }
    } catch (error) {
      setIsLoading(false)
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    
    // Clear cookie
    document.cookie = 'auth_token=; path=/; max-age=0'
    
    // Redirect to appropriate login page based on current route
    const currentPath = window.location.pathname
    const loginPath = currentPath.startsWith('/mobile') ? '/mobile/login' : '/login'
    router.push(loginPath)
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
