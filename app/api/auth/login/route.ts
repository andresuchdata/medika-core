import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/db'
import { createJWT } from '@/lib/auth/auth'
import { LoginForm } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: LoginForm = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In production, you would hash and compare passwords
    // For now, we'll use a simple check
    if (password !== 'password123') {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

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
          phone: user.phone,
          avatar: user.avatar,
        },
        token,
      },
      message: 'Login successful',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
