import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/db'
import { createJWT } from '@/lib/auth/auth'
import { RegisterForm } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterForm = await request.json()
    const { name, email, password, confirmPassword, role, organizationId } = body

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate organization if provided
    if (organizationId) {
      const organization = await db.findOrganizationById(organizationId)
      if (!organization) {
        return NextResponse.json(
          { success: false, error: 'Invalid organization' },
          { status: 400 }
        )
      }
    }

    // Create user
    const user = await db.createUser({
      name,
      email,
      role,
      organizationId,
      isActive: true,
    })

    // Create JWT token
    const token = createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    })

    // Return user data and token
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        },
        token,
      },
      message: 'Registration successful',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
