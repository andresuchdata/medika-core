'use client'

import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, X, Edit3, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUserInitials } from '@/lib/utils/user'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange: (avatarUrl: string) => void
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
  isEditable = true,
  className,
  size = 'md'
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


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

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate upload and get URL
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    
    try {
      // TODO: Replace with actual file upload API
      // For now, we'll simulate the upload and use the preview URL
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, you would:
      // 1. Upload the file to your storage service
      // 2. Get back a URL
      // 3. Call onAvatarChange with that URL
      
      const uploadedUrl = previewUrl || URL.createObjectURL(file)
      onAvatarChange(uploadedUrl)
      
      // Clear preview after successful upload
      setPreviewUrl(null)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setPreviewUrl(null)
    onAvatarChange('')
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayAvatar = previewUrl || currentAvatar

  return (
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
          onClick={handleRemoveAvatar}
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
  )
}
