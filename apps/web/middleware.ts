import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/problems(.*)',
  '/interview(.*)',
  '/interview-mode(.*)',
  '/progress(.*)',
  '/analytics(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const url = request.nextUrl

  if (userId && url.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webco)$).*)',
  ],
}
