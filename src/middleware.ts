import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { NextRequest, NextResponse } from "next/server"

const publicRoutes = ["/", "/sign-in", "/sign-up"]

/**
 * Apply security headers to all responses
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // ============================================================================
  // CONTENT SECURITY POLICY (CSP)
  // Prevents XSS attacks by restricting resource loading
  // ============================================================================
  const cspHeader = [
    // Default: only allow same-origin resources
    "default-src 'self'",

    // Scripts: allow self + inline (Next.js requires this)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

    // Styles: allow self + inline (Tailwind CSS requires this)
    "style-src 'self' 'unsafe-inline'",

    // Images: allow self, data URIs, and https
    "img-src 'self' data: https:",

    // Fonts: allow self and data URIs
    "font-src 'self' data:",

    // External APIs: only Gemini API
    "connect-src 'self' https://generativelanguage.googleapis.com",

    // Prevent clickjacking
    "frame-ancestors 'none'",

    // Form submission: only to self
    "form-action 'self'",

    // Base tag: only self
    "base-uri 'self'",

    // Object/embed: none (disable Flash, Java applets)
    "object-src 'none'",

    // Media: self only
    "media-src 'self'",

    // Manifest: self only
    "manifest-src 'self'",

    // Worker: self only
    "worker-src 'self'",

    // Require secure transport for XHR/fetch
    "upgrade-insecure-requests",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  // ============================================================================
  // X-Frame-Options - Prevent clickjacking
  // ============================================================================
  response.headers.set('X-Frame-Options', 'DENY')

  // ============================================================================
  // X-Content-Type-Options - Prevent MIME-sniffing
  // ============================================================================
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // ============================================================================
  // X-XSS-Protection - XSS protection for older browsers
  // ============================================================================
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // ============================================================================
  // Referrer-Policy - Control referrer information
  // ============================================================================
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // ============================================================================
  // Permissions-Policy - Restrict browser features
  // ============================================================================
  response.headers.set('Permissions-Policy', [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '))

  // ============================================================================
  // Cross-Origin policies
  // ============================================================================
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  // ============================================================================
  // HSTS - Force HTTPS in production
  // ============================================================================
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Check if user has a valid session
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  )

  // If no session and trying to access protected route, redirect to sign-in
  if (!session) {
    const signInUrl = new URL("/sign-in", request.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", pathname)
    const response = NextResponse.redirect(signInUrl)
    return addSecurityHeaders(response)
  }

  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
