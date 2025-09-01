'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react'

// UI State Types
interface UIState {
  sidebarOpen: boolean
  searchOpen: boolean
  notificationsOpen: boolean
  mobileMenuOpen: boolean
  theme: 'light' | 'dark'
}

// UI Action Types
type UIAction = 
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'RESET_UI' }

// Initial State
const getInitialState = (): UIState => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('medika-ui-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          sidebarOpen: parsed.sidebarOpen ?? false, // Default to false
          searchOpen: parsed.searchOpen ?? false,
          notificationsOpen: parsed.notificationsOpen ?? false,
          mobileMenuOpen: parsed.mobileMenuOpen ?? false,
          theme: parsed.theme ?? 'light'
        }
      }
    } catch (error) {
      console.warn('Failed to parse saved UI state:', error)
    }
  }
  
  return {
    sidebarOpen: false, // Default to false as requested
    searchOpen: false,
    notificationsOpen: false,
    mobileMenuOpen: false,
    theme: 'light'
  }
}

// UI Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload }
    
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen }
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsOpen: !state.notificationsOpen }
    
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen }
    
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, mobileMenuOpen: action.payload }
    
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    
    case 'RESET_UI':
      return getInitialState()
    
    default:
      return state
  }
}

// UI Context
interface UIContextType {
  state: UIState
  dispatch: React.Dispatch<UIAction>
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSearch: () => void
  toggleNotifications: () => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  resetUI: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

// UI Provider Component
interface UIProviderProps {
  children: ReactNode
}

export function UIProvider({ children }: UIProviderProps) {
  const [state, dispatch] = useReducer(uiReducer, getInitialState())

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medika-ui-state', JSON.stringify(state))
    }
  }, [state])

  // Memoized convenience functions to prevent re-renders
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), [])
  const setSidebarOpen = useCallback((open: boolean) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open }), [])
  const toggleSearch = useCallback(() => dispatch({ type: 'TOGGLE_SEARCH' }), [])
  const toggleNotifications = useCallback(() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' }), [])
  const toggleMobileMenu = useCallback(() => dispatch({ type: 'TOGGLE_MOBILE_MENU' }), [])
  const setMobileMenuOpen = useCallback((open: boolean) => dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: open }), [])
  const setTheme = useCallback((theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme }), [])
  const resetUI = useCallback(() => dispatch({ type: 'RESET_UI' }), [])

  const value: UIContextType = {
    state,
    dispatch,
    toggleSidebar,
    setSidebarOpen,
    toggleSearch,
    toggleNotifications,
    toggleMobileMenu,
    setMobileMenuOpen,
    setTheme,
    resetUI
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

// Custom Hook to use UI Context
export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}

// Convenience hook for sidebar only
export function useSidebar() {
  const { state: { sidebarOpen }, toggleSidebar, setSidebarOpen } = useUI()
  return { sidebarOpen, toggleSidebar, setSidebarOpen }
}
