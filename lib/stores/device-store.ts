import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceState {
  // Device detection state
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  
  // Viewport dimensions
  viewport: {
    width: number
    height: number
  }
  
  // Device capabilities
  isTouchDevice: boolean
  devicePixelRatio: number
  
  // Actions
  updateDeviceType: () => void
  setViewport: (width: number, height: number) => void
  isMobileUserAgent: () => boolean
  isMobileRoute: () => boolean
  getDeviceRoute: (pathname: string) => string
  getAppropriateRoute: (pathname: string) => string | null
}

// Device detection logic
const detectDeviceType = (width: number): DeviceType => {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

const isMobileUserAgent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
    'mobile', 'tablet', 'phone'
  ]
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const useDeviceStore = create<DeviceState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    viewport: { width: 0, height: 0 },
    isTouchDevice: false,
    devicePixelRatio: 1,
    
    // Actions
    updateDeviceType: () => {
      if (typeof window === 'undefined') return
      
      const width = window.innerWidth
      const height = window.innerHeight
      const deviceType = detectDeviceType(width)
      
      set({
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        viewport: { width, height },
        isTouchDevice: isTouchDevice(),
        devicePixelRatio: window.devicePixelRatio || 1,
      })
    },
    
    setViewport: (width: number, height: number) => {
      set({ viewport: { width, height } })
    },
    
    isMobileUserAgent: () => isMobileUserAgent(),
    
    isMobileRoute: () => {
      if (typeof window === 'undefined') return false
      return window.location.pathname.startsWith('/mobile')
    },
    
    getDeviceRoute: (pathname: string) => {
      const { deviceType } = get()
      
      if (deviceType === 'mobile' && !pathname.startsWith('/mobile')) {
        return `/mobile${pathname}`
      }
      
      if (deviceType === 'desktop' && pathname.startsWith('/mobile')) {
        return pathname.replace('/mobile', '')
      }
      
      return pathname
    },
    
    getAppropriateRoute: (pathname: string) => {
      const { isMobile, isTablet, isDesktop } = get()
      
      // If already on appropriate route, no redirect needed
      if (pathname.startsWith('/mobile') && (isMobile || isTablet)) return null
      if (pathname.startsWith('/dashboard') && isDesktop) return null
      if (pathname === '/' && isDesktop) return null
      
      // For mobile/tablet devices
      if (isMobile || isTablet) {
        if (pathname === '/') return '/mobile/dashboard'
        if (pathname.startsWith('/dashboard')) return `/mobile${pathname}`
        if (pathname === '/login') return '/mobile/login'
        if (pathname === '/register') return '/mobile/register'
      }
      
      // For desktop devices
      if (isDesktop) {
        if (pathname.startsWith('/mobile')) return pathname.replace('/mobile', '')
        if (pathname === '/') return '/dashboard'
      }
      
      return null
    },
  }))
)

// Initialize device detection on mount
if (typeof window !== 'undefined') {
  const store = useDeviceStore.getState()
  store.updateDeviceType()
  
  // Add resize listener
  window.addEventListener('resize', () => {
    store.updateDeviceType()
  })
}

// Convenience hooks
export const useDevice = () => {
  const store = useDeviceStore()

  return {
    deviceType: store.deviceType,
    isMobile: store.isMobile,
    isTablet: store.isTablet,
    isDesktop: store.isDesktop,
    viewport: store.viewport,
    isTouchDevice: store.isTouchDevice,
    devicePixelRatio: store.devicePixelRatio,
    updateDeviceType: store.updateDeviceType,
    isMobileUserAgent: store.isMobileUserAgent,
    isMobileRoute: store.isMobileRoute,
    getDeviceRoute: store.getDeviceRoute,
    getAppropriateRoute: store.getAppropriateRoute,
  }
}

export const useDeviceRedirect = () => {
  const { getAppropriateRoute } = useDevice()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  
  return {
    shouldRedirect: getAppropriateRoute(pathname) !== null,
    targetRoute: getAppropriateRoute(pathname),
    currentPath: pathname,
  }
}
