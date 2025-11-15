import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { NextRequest, NextResponse } from "next/server"

const publicRoutes = ["/", "/sign-in", "/sign-up"]

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
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
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
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
