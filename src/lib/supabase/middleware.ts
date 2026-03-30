import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Preview mode — lets visitors explore the app without signing in.
  const isDemo = request.cookies.get('demo_mode')?.value === 'true'

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

  // If Supabase is not configured, allow all access in demo mode
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const response = NextResponse.next({ request })
    response.cookies.set('demo_mode', 'true', { path: '/', maxAge: 86400 })
    return response
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/c/', '/profile']
    const isProtected = protectedPaths.some(p => path.startsWith(p))

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from auth pages
    const authPaths = ['/login', '/signup']
    if (authPaths.includes(request.nextUrl.pathname) && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch {
    // If Supabase is not configured (placeholder keys), allow access
    return NextResponse.next({ request })
  }

  return supabaseResponse
}
