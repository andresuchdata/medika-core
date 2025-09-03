import { useCallback } from 'react'
import { useAuth } from '@/lib/stores/auth-store'
import { authService } from '@/lib/auth/auth-service'
import { toast } from 'sonner'

interface UseAvatarReturn {
  handleAvatarChange: (avatarUrl: string) => Promise<void>
  handleAvatarRemove: () => Promise<void>
  isUploading: boolean
}

export function useAvatar(): UseAvatarReturn {
  const { user, updateAvatar } = useAuth()

  const handleAvatarChange = useCallback(async (avatarUrl: string) => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    try {
      // Call the backend API to update avatar using auth service
      const response = await authService.updateAvatar(user.id, { avatar_url: avatarUrl })

      if (response.success) {
        // Update the auth store with new avatar
        updateAvatar(avatarUrl)
        toast.success('Avatar updated successfully!')
      } else {
        throw new Error(response.message || 'Failed to update avatar')
      }
    } catch (error) {
      console.error('Avatar update failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update avatar'
      toast.error(errorMessage)
      throw error // Re-throw to allow parent components to handle if needed
    }
  }, [user, updateAvatar])

  const handleAvatarRemove = useCallback(async () => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    try {
      // Call the backend API to remove avatar using auth service
      const response = await authService.updateAvatar(user.id, { avatar_url: '' })

      if (response.success) {
        // Update the auth store with empty avatar
        updateAvatar('')
        toast.success('Avatar removed successfully!')
      } else {
        throw new Error(response.message || 'Failed to remove avatar')
      }
    } catch (error) {
      console.error('Avatar removal failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove avatar'
      toast.error(errorMessage)
      throw error // Re-throw to allow parent components to handle if needed
    }
  }, [user, updateAvatar])

  return {
    handleAvatarChange,
    handleAvatarRemove,
    isUploading: false, // This could be enhanced with actual upload state if needed
  }
}
