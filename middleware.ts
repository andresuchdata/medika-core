import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl
  
  // Check if mobile subdomain
  if (host.startsWith('m.')) {
    // Rewrite to mobile routes
    return NextResponse.rewrite(new URL(`/mobile${pathname}`, request.url))
  }
  
  // Check user agent for device detection
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
  const isTablet = /ipad|tablet/i.test(userAgent)
  
  // Add device info to headers for components to use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-device-type', isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop')
  
  // For now, keep responsive design but prepare for future mobile routing
  // Later we can add: if (isMobile) return NextResponse.redirect(new URL(`https://m.${host}${pathname}`))
  
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
