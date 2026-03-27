import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const PUBLIC_PATHS = ['/', '/login', '/register']
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function verifySession(request: NextRequest): Promise<boolean> {
  // Fast path: no cookie → not authenticated
  const cookie = getSessionCookie(request)
  if (!cookie) return false

  // Validate against the server to catch stale/expired cookies
  try {
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    })
    if (!res.ok) return false
    const data = await res.json()
    return !!data?.session
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p)

  const authenticated = await verifySession(request)

  // Redirect authenticated users away from auth pages
  if (authenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Redirect unauthenticated users to login
  if (!authenticated && !isPublic) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
