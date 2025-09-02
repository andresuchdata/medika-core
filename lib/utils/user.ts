/**
 * User utility functions
 */

/**
 * Get user initials from a full name
 * @param name - The full name of the user
 * @param maxLength - Maximum number of initials to return (default: 2)
 * @returns Uppercase initials (e.g., "John Doe" -> "JD")
 */
export function getUserInitials(name: string, maxLength: number = 2): string {
  if (!name || typeof name !== 'string') {
    return ''
  }

  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxLength)
}

/**
 * Format user role for display
 * @param role - The user role string
 * @returns Formatted role with first letter capitalized
 */
export function formatUserRole(role: string): string {
  if (!role || typeof role !== 'string') {
    return ''
  }

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

/**
 * Get user display name
 * @param name - The user's full name
 * @param fallback - Fallback text if name is empty
 * @returns The user's name or fallback
 */
export function getUserDisplayName(name: string, fallback: string = 'User'): string {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return fallback
  }

  return name.trim()
}

/**
 * Validate user avatar URL
 * @param avatarUrl - The avatar URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidAvatarUrl(avatarUrl?: string): boolean {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return false
  }

  try {
    const url = new URL(avatarUrl)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Get user's first name from full name
 * @param name - The full name of the user
 * @returns The first name or empty string
 */
export function getFirstName(name: string): string {
  if (!name || typeof name !== 'string') {
    return ''
  }

  return name.trim().split(/\s+/)[0] || ''
}

/**
 * Get user's last name from full name
 * @param name - The full name of the user
 * @returns The last name or empty string
 */
export function getLastName(name: string): string {
  if (!name || typeof name !== 'string') {
    return ''
  }

  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? parts.slice(-1)[0] : ''
}

/**
 * Check if user has a specific role
 * @param userRole - The user's role
 * @param requiredRole - The role to check against
 * @returns True if user has the required role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  return userRole === requiredRole
}

/**
 * Check if user has any of the specified roles
 * @param userRole - The user's role
 * @param requiredRoles - Array of roles to check against
 * @returns True if user has any of the required roles
 */
export function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}
