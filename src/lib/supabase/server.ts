import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getProfile() {
  const session = await getSession()
  if (!session) return null

  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    const { redirect } = await import('next/navigation')
    redirect('/login')
  }
  return session
}

export async function requireAdmin() {
  const profile = await getProfile()
  if (!profile?.is_admin) {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard')
  }
  return profile
}

export async function requirePaid() {
  const profile = await getProfile()
  if (!profile || profile.membership_tier !== 'paid') {
    return null
  }
  return profile
}
