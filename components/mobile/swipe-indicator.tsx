'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useUI } from '@/lib/context/ui-context'

interface SwipeIndicatorProps {
  onClick?: () => void
}

export function SwipeIndicator({ onClick }: SwipeIndicatorProps) {
  const { state: { mobileMenuOpen } } = useUI()
  const [isVisible, setIsVisible] = useState(true)
  const [hasBeenUsed, setHasBeenUsed] = useState(false)

  // Check if user has used swipe before (localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasUsedSwipe = localStorage.getItem('medika-swipe-used')
      if (hasUsedSwipe) {
        setHasBeenUsed(true)
        setIsVisible(false)
      }
    }
  }, [])

  // Hide indicator when menu is opened (user discovered the feature)
  useEffect(() => {
    if (mobileMenuOpen && !hasBeenUsed) {
      setHasBeenUsed(true)
      setIsVisible(false)
      // Save to localStorage so we don't show it again
      if (typeof window !== 'undefined') {
        localStorage.setItem('medika-swipe-used', 'true')
      }
    }
  }, [mobileMenuOpen, hasBeenUsed])

  // Don't show if menu is open
  if (mobileMenuOpen) {
    return null
  }

  return (
    <div className="fixed left-0 top-1/3 -translate-y-1/2 z-[70] lg:hidden">
      {/* Minimal arrow indicator */}
      <div className="relative group">
        {/* Arrow container - compact and neutral */}
        <div 
          className="bg-white/95 backdrop-blur-sm text-gray-600 px-1.5 py-2 rounded-r-lg shadow-md border border-gray-300/60 w-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onClick}
        >
          <div className="flex justify-center">
            {/* Single bold arrow with subtle animation */}
            <div className="animate-bounce-horizontal">
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Subtle hint text (appears on hover/touch) */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Swipe to open
        </div>
      </div>
    </div>
  )
}
