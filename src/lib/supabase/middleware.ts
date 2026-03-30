import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Preview mode — lets visitors explore the app without signing in.
  // Only allows read-only access to /c/ routes. Admin and profile are blocked.
  const isDemo = request.cookies.get('demo_mode')?.value === 'true'
  if (isDemo) {
    const path = request.nextUrl.pathname
    // Block admin and profile in preview mode — those require real auth
    if (path.includes('/admin') || path.startsWith('/profile')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // Public routes within /c/ — allow anyone to view (sets demo mode automatically)
    const path = request.nextUrl.pathname
    const isPublicCommunityRoute = path.match(/^\/c\/[^/]+\/(drops|dashboard|leaderboard|community)/)
    if (isPublicCommunityRoute && !user) {
      const response = NextResponse.next({ request })
      response.cookies.set('demo_mode', 'true', { path: '/', maxAge: 86400 })
      return response
    }

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
