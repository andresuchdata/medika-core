'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, X, Edit3, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUserInitials } from '@/lib/utils/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange: (avatarUrl: string) => void
  onAvatarRemove?: () => void
  isEditable?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32'
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
  onAvatarRemove,
  isEditable = true,
  className,
  size = 'md'
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentFileHash, setCurrentFileHash] = useState<string | null>(null)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear preview when currentAvatar changes (indicating successful update)
  useEffect(() => {
    if (currentAvatar && previewUrl) {
      setPreviewUrl(null)
      setCurrentFileHash(null)
    }
  }, [currentAvatar, previewUrl])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current)
      }
    }
  }, [])

  // Generate a simple hash for the file to prevent duplicate uploads
  const generateFileHash = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`
  }

  // Debounced upload function
  const debouncedUpload = useCallback((file: File, preview: string) => {
    // Clear any existing timeout
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current)
    }

    // Set new timeout for debounced upload
    uploadTimeoutRef.current = setTimeout(() => {
      handleUpload(file, preview)
    }, 300) // 300ms debounce delay
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Generate file hash to check for duplicates
    const fileHash = generateFileHash(file)
    
    // If this is the same file and we're already uploading, don't do anything
    if (fileHash === currentFileHash && isUploading) {
      return
    }

    // If this is a different file, clear any existing preview and hash
    if (fileHash !== currentFileHash) {
      setPreviewUrl(null)
      setCurrentFileHash(fileHash)
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      setPreviewUrl(preview)
      
      // Start debounced upload
      debouncedUpload(file, preview)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async (file: File, preview: string) => {
    // Prevent multiple simultaneous uploads
    if (isUploading) {
      return
    }

    setIsUploading(true)
    
    try {
      // Convert file to base64 for storage
      const base64String = await fileToBase64(file)
      
      // Call the parent's onAvatarChange with the base64 string
      onAvatarChange(base64String)
      
      // Keep the preview until the parent component updates the currentAvatar
      // This prevents the flicker
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
      // Clear preview on error
      setPreviewUrl(null)
      setCurrentFileHash(null)
    } finally {
      setIsUploading(false)
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleRemoveAvatar = () => {
    // Clear any pending upload
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current)
    }
    
    setPreviewUrl(null)
    setCurrentFileHash(null)
    
    // Use the dedicated remove handler if provided, otherwise fall back to onAvatarChange
    if (onAvatarRemove) {
      onAvatarRemove()
    } else {
      // Fallback: call onAvatarChange with empty string (for backward compatibility)
      onAvatarChange('')
    }
    
    setShowRemoveDialog(false)
  }

  const openRemoveDialog = () => {
    setShowRemoveDialog(true)
  }

  const triggerFileInput = () => {
    // Don't allow new file selection if currently uploading
    if (isUploading) {
      return
    }
    
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    fileInputRef.current?.click()
  }

  // Use preview URL if available, otherwise fall back to current avatar
  // This prevents the flicker by maintaining the preview during upload
  const displayAvatar = previewUrl || currentAvatar

  return (
    <>
      <div className={cn('relative inline-block', className)}>
        <Avatar className={cn('relative ring-2 ring-gray-200 border-2 border-white shadow-sm hover:ring-gray-300 transition-all duration-200', sizeClasses[size])}>
          <AvatarImage 
            src={displayAvatar || undefined} 
            alt={userName} 
          />
          <AvatarFallback className={cn('text-2xl bg-gray-100 text-gray-600', sizeClasses[size])}>
            {getUserInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Edit overlay - only show if editable */}
        {isEditable && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white hover:text-black"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Remove button - only show if there's an avatar and it's editable */}
        {isEditable && displayAvatar && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={openRemoveDialog}
            disabled={isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Edit indicator - subtle edit icon */}
        {isEditable && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-500 text-white p-1 rounded-full shadow-sm hover:bg-gray-600 transition-colors">
              <Edit3 className="h-3 w-3" />
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Remove Avatar Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Avatar</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove your profile picture? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveAvatar}
            >
              Remove Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
