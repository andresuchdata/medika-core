import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl
  
  // Check user agent for device detection (moved to top)
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
  const isTablet = /ipad|tablet/i.test(userAgent)
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/mobile',
  ]
  
  // Define public routes (always accessible)
  const publicRoutes = [
    '/login',
    '/register',
    '/mobile/login',
    '/mobile/register',
    '/api/auth/login',
    '/api/auth/register',
  ]
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) && 
                          !publicRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Authentication check for protected routes
  if (isProtectedRoute && !authToken) {
    // Check if it's a mobile route request
    const isMobileRequest = isMobile || isTablet || pathname.startsWith('/mobile')
    const loginUrl = new URL(isMobileRequest ? '/mobile/login' : '/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect authenticated users away from auth pages
  if (authToken && isPublicRoute && (
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/mobile/login' || 
    pathname === '/mobile/register'
  )) {
    // Try to get return URL or default to appropriate dashboard
    const defaultUrl = pathname.startsWith('/mobile') ? '/mobile/dashboard' : '/dashboard'
    const returnUrl = request.nextUrl.searchParams.get('returnUrl') || defaultUrl
    return NextResponse.redirect(new URL(returnUrl, request.url))
  }
  
  // Handle root path redirect
  if (pathname === '/') {
    const isMobileRequest = isMobile || isTablet
    if (authToken) {
      const dashboardUrl = isMobileRequest ? '/mobile/dashboard' : '/dashboard'
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    } else {
      const loginUrl = isMobileRequest ? '/mobile/login' : '/login'
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }
  }
  
  // Check if mobile subdomain
  if (host.startsWith('m.')) {
    // Rewrite to mobile routes
    return NextResponse.rewrite(new URL(`/mobile${pathname}`, request.url))
  }
  
  // Add device info and auth status to headers for components to use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-device-type', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
  requestHeaders.set('x-auth-status', authToken ? 'authenticated' : 'unauthenticated')
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
