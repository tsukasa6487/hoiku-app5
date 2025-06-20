import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Supabase configuration for middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/email', '/diary', '/records']

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/auth']

// Auth routes that should redirect authenticated users
const authRoutes = ['/login', '/register']

/**
 * Check if a route is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })
}

/**
 * Check if a route is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route))
}

/**
 * Create a redirect response with the intended destination preserved
 */
function createRedirect(url: string, request: NextRequest, destination?: string): NextResponse {
  const redirectUrl = new URL(url, request.url)
  
  // Preserve the intended destination for post-login redirect
  if (destination && destination !== '/') {
    redirectUrl.searchParams.set('redirect', destination)
  }
  
  return NextResponse.redirect(redirectUrl)
}

/**
 * Get session from Supabase using server-side client with proper cookie handling
 */
async function getSession(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create Supabase client for server-side use with proper cookie handling
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    })

    // Get current session with error handling
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware: Error getting session:', error)
      return { session: null, response, needsCleanup: true }
    }

    // If no session, return early
    if (!session) {
      return { session: null, response, needsCleanup: false }
    }

    // Check if session is expired or about to expire (within 5 minutes)
    const now = Math.floor(Date.now() / 1000)
    const expirationBuffer = 5 * 60 // 5 minutes in seconds
    
    if (session.expires_at && session.expires_at < (now + expirationBuffer)) {
      console.log('Middleware: Session expires soon, attempting refresh')
      
      // Try to refresh the session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError || !refreshData.session) {
        console.error('Middleware: Failed to refresh session:', refreshError)
        return { session: null, response, needsCleanup: true }
      }
      
      console.log('Middleware: Session refreshed successfully')
      return { session: refreshData.session, response, needsCleanup: false }
    }

    // Validate that the session user exists
    if (!session.user) {
      console.error('Middleware: Session exists but no user found')
      return { session: null, response, needsCleanup: true }
    }

    return { session, response, needsCleanup: false }
  } catch (error) {
    console.error('Middleware: Unexpected error getting session:', error)
    return { session: null, response: NextResponse.next(), needsCleanup: true }
  }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  try {
    // Get the current session
    const { session, response, needsCleanup } = await getSession(request)
    const isAuthenticated = !!session

    // Clean up invalid session cookies if needed
    if (needsCleanup && !isAuthenticated) {
      // Only redirect to login for protected routes, otherwise continue
      if (isProtectedRoute(pathname)) {
        const cleanupResponse = createRedirect('/login', request, pathname)
        cleanupResponse.cookies.delete('sb-access-token')
        cleanupResponse.cookies.delete('sb-refresh-token')
        console.log(`Middleware: Cleaning up invalid session and redirecting from ${pathname} to /login`)
        return cleanupResponse
      } else {
        // For public routes, just clean up cookies and continue
        const cleanupResponse = NextResponse.next()
        cleanupResponse.cookies.delete('sb-access-token')
        cleanupResponse.cookies.delete('sb-refresh-token')
        return cleanupResponse
      }
    }

    // Handle protected routes
    if (isProtectedRoute(pathname)) {
      if (!isAuthenticated) {
        console.log(`Middleware: Redirecting unauthenticated user from ${pathname} to /login`)
        return createRedirect('/login', request, pathname)
      }
      
      // User is authenticated, allow access with updated cookies
      console.log(`Middleware: Allowing authenticated user access to ${pathname}`)
      return response
    }

    // Handle auth routes (login, register)
    if (isAuthRoute(pathname) && isAuthenticated) {
      console.log(`Middleware: Redirecting authenticated user from ${pathname} to /dashboard`)
      return createRedirect('/dashboard', request)
    }

    // Handle public routes - always allow access
    if (isPublicRoute(pathname)) {
      return NextResponse.next()
    }

    // Default behavior for other routes
    return NextResponse.next()

  } catch (error) {
    console.error('Middleware: Unexpected error:', error)
    
    // On error, if it's a protected route, redirect to login
    if (isProtectedRoute(pathname)) {
      return createRedirect('/login', request, pathname)
    }
    
    // Otherwise, continue
    return NextResponse.next()
  }
}

/**
 * Middleware configuration
 * This tells Next.js which routes to run the middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}