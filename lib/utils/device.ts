'use client'

import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    function updateDeviceType() {
      const width = window.innerWidth
      
      if (width < 768) {
        setDeviceType('mobile')
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width < 1024) {
        setDeviceType('tablet')
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else {
        setDeviceType('desktop')
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    // Initial check
    updateDeviceType()

    // Add event listener
    window.addEventListener('resize', updateDeviceType)

    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
  }
}

// Utility function to check if user agent is mobile
export function isMobileUserAgent(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
    'mobile', 'tablet', 'phone'
  ]
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

// Utility function to get viewport dimensions
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

// Utility function to check if device supports touch
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Utility function to get device pixel ratio
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  
  return window.devicePixelRatio || 1
}

// Utility function to get device type from CSS media queries
export function getDeviceTypeFromCSS(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'
  
  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile'
  } else if (window.matchMedia('(max-width: 1023px)').matches) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

// Utility function to check if current route is mobile
export function isMobileRoute(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.location.pathname.startsWith('/mobile')
}

// Utility function to get appropriate route based on device
export function getDeviceRoute(pathname: string, deviceType: DeviceType): string {
  if (deviceType === 'mobile' && !pathname.startsWith('/mobile')) {
    return `/mobile${pathname}`
  }
  
  if (deviceType === 'desktop' && pathname.startsWith('/mobile')) {
    return pathname.replace('/mobile', '')
  }
  
  return pathname
}
