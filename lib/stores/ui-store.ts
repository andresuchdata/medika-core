import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  createdAt: string
}

interface UIState {
  // Sidebar state
  sidebarExpanded: boolean
  sidebarCollapsed: boolean
  
  // Mobile menu state
  mobileMenuOpen: boolean
  
  // Theme and appearance
  theme: 'light' | 'dark' | 'system'
  colorScheme: 'blue' | 'green' | 'purple' | 'orange'
  
  // Notifications
  notifications: Notification[]
  
  // Modal and overlay states
  activeModals: string[]
  
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Toast and snackbar
  toastQueue: Notification[]
  
  // Actions
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setColorScheme: (scheme: 'blue' | 'green' | 'purple' | 'orange') => void
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  addModal: (modalId: string) => void
  removeModal: (modalId: string) => void
  clearModals: () => void
  
  setGlobalLoading: (loading: boolean) => void
  setLoadingState: (key: string, loading: boolean) => void
  clearLoadingStates: () => void
  
  addToast: (toast: Omit<Notification, 'id' | 'createdAt'>) => void
  removeToast: (id: string) => void
  clearToastQueue: () => void
}

const defaultUIState: Omit<UIState, 'toggleSidebar' | 'setSidebarExpanded' | 'setSidebarCollapsed' | 'toggleMobileMenu' | 'setMobileMenuOpen' | 'setTheme' | 'setColorScheme' | 'addNotification' | 'removeNotification' | 'clearNotifications' | 'addModal' | 'removeModal' | 'clearModals' | 'setGlobalLoading' | 'setLoadingState' | 'clearLoadingStates' | 'addToast' | 'removeToast' | 'clearToastQueue'> = {
  sidebarExpanded: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  theme: 'system',
  colorScheme: 'blue',
  notifications: [],
  activeModals: [],
  globalLoading: false,
  loadingStates: {},
  toastQueue: [],
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultUIState,
        
        // Sidebar actions
        toggleSidebar: () => set((state) => ({
          sidebarExpanded: !state.sidebarExpanded,
          sidebarCollapsed: !state.sidebarExpanded,
        })),
        
        setSidebarExpanded: (expanded) => set({
          sidebarExpanded: expanded,
          sidebarCollapsed: !expanded,
        }),
        
        setSidebarCollapsed: (collapsed) => set({
          sidebarCollapsed: collapsed,
          sidebarExpanded: !collapsed,
        }),
        
        // Mobile menu actions
        toggleMobileMenu: () => set((state) => ({
          mobileMenuOpen: !state.mobileMenuOpen,
        })),
        
        setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
        
        // Theme actions
        setTheme: (theme) => set({ theme }),
        setColorScheme: (colorScheme) => set({ colorScheme }),
        
        // Notification actions
        addNotification: (notification) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        // Modal actions
        addModal: (modalId) => set((state) => ({
          activeModals: [...state.activeModals, modalId],
        })),
        
        removeModal: (modalId) => set((state) => ({
          activeModals: state.activeModals.filter((id) => id !== modalId),
        })),
        
        clearModals: () => set({ activeModals: [] }),
        
        // Loading actions
        setGlobalLoading: (globalLoading) => set({ globalLoading }),
        
        setLoadingState: (key, loading) => set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading,
          },
        })),
        
        clearLoadingStates: () => set({ loadingStates: {} }),
        
        // Toast actions
        addToast: (toast) => set((state) => ({
          toastQueue: [
            ...state.toastQueue,
            {
              ...toast,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
        
        removeToast: (id) => set((state) => ({
          toastQueue: state.toastQueue.filter((t) => t.id !== id),
        })),
        
        clearToastQueue: () => set({ toastQueue: [] }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          // Only persist user preferences, not temporary UI state
          theme: state.theme,
          colorScheme: state.colorScheme,
          sidebarExpanded: state.sidebarExpanded,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)
