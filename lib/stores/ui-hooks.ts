import { useUIStore } from './ui-store'

// Convenience hook for sidebar management
export const useSidebar = () => {
  const { 
    sidebarExpanded, 
    sidebarCollapsed, 
    toggleSidebar, 
    setSidebarExpanded, 
    setSidebarCollapsed 
  } = useUIStore()
  
  return {
    sidebarExpanded,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarExpanded,
    setSidebarCollapsed,
  }
}

// Convenience hook for mobile menu
export const useMobileMenu = () => {
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore()
  
  return {
    mobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
  }
}

// Convenience hook for theme management
export const useTheme = () => {
  const { theme, colorScheme, setTheme, setColorScheme } = useUIStore()
  
  return {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
  }
}

// Convenience hook for notifications
export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    clearNotifications 
  } = useUIStore()
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  }
}

// Convenience hook for loading states
export const useLoading = () => {
  const { 
    globalLoading, 
    loadingStates, 
    setGlobalLoading, 
    setLoadingState, 
    clearLoadingStates 
  } = useUIStore()
  
  return {
    globalLoading,
    loadingStates,
    setGlobalLoading,
    setLoadingState,
    clearLoadingStates,
  }
}

// Convenience hook for toasts
export const useToasts = () => {
  const { 
    toastQueue, 
    addToast, 
    removeToast, 
    clearToastQueue 
  } = useUIStore()
  
  return {
    toastQueue,
    addToast,
    removeToast,
    clearToastQueue,
  }
}

// Convenience hook for modals
export const useModals = () => {
  const { 
    activeModals, 
    addModal, 
    removeModal, 
    clearModals 
  } = useUIStore()
  
  return {
    activeModals,
    addModal,
    removeModal,
    clearModals,
  }
}
