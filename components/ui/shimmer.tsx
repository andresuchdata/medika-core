import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ShimmerProps {
  width?: string | number
  height?: string | number
  color?: string
  className?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  animation?: 'default' | 'fast' | 'slow' | 'vertical'
}

export const Shimmer = forwardRef<HTMLDivElement, ShimmerProps>(
  ({ 
    width = '100%', 
    height = '20px', 
    color = 'bg-gray-200',
    className, 
    rounded = 'md',
    animation = 'default'
  }, ref) => {
    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    }

    const animationClasses = {
      default: 'shimmer-animate',
      fast: 'shimmer-animate-fast',
      slow: 'shimmer-animate-slow',
      vertical: 'shimmer-animate-vertical'
    }

    return (
      <div
        ref={ref}
        className={cn(
          animationClasses[animation],
          color,
          roundedClasses[rounded],
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      />
    )
  }
)

Shimmer.displayName = 'Shimmer'

// Convenience components for common use cases
export const ShimmerText = ({ className, animation, ...props }: Omit<ShimmerProps, 'height'>) => (
  <Shimmer height="1em" className={cn('inline-block', className)} animation={animation} {...props} />
)

export const ShimmerAvatar = ({ className, animation, ...props }: Omit<ShimmerProps, 'width' | 'height'>) => (
  <Shimmer width={40} height={40} rounded="full" className={className} animation={animation} {...props} />
)

export const ShimmerCard = ({ className, animation, ...props }: Omit<ShimmerProps, 'width' | 'height'>) => (
  <Shimmer width="100%" height={120} rounded="lg" className={className} animation={animation} {...props} />
)

export const ShimmerButton = ({ className, animation, ...props }: Omit<ShimmerProps, 'width' | 'height'>) => (
  <Shimmer width={120} height={40} rounded="md" className={className} animation={animation} {...props} />
)
