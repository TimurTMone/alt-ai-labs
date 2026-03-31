import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Real auth — JWT issued by the Render backend
  const hasAuthToken = !!request.cookies.get('auth_token')?.value

  // Preview mode — lets visitors explore the app without signing in
  const isDemo = request.cookies.get('demo_mode')?.value === 'true'

  // Authenticated users: clear demo_mode if still lingering, allow through
  if (hasAuthToken) {
    const response = NextResponse.next({ request })
    if (isDemo) {
      response.cookies.set('demo_mode', '', { path: '/', maxAge: 0 })
    }
    return response
  }

  // Public community routes — auto-enable demo mode for unauthenticated visitors
  const isPublicCommunityRoute = /^\/c\/[^/]+\/(drops|dashboard|leaderboard|community)/.test(path)
  if (isPublicCommunityRoute && !isDemo) {
    const response = NextResponse.next({ request })
    response.cookies.set('demo_mode', 'true', { path: '/', maxAge: 86400 })
    return response
  }

  if (isDemo) {
    // Block admin and profile in preview mode — those require real auth
    if (path.includes('/admin') || path.startsWith('/profile')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  // No auth token, no demo mode — protected routes require login
  const protectedPaths = ['/c/', '/profile']
  const isProtected = protectedPaths.some(p => path.startsWith(p))

  if (isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}
