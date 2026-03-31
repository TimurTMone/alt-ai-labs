import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ── JWT helpers ─────────────────────────────────────────────────

function decodeJwtPayload(token: string): { sub: string; email: string; exp: number } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

// ── Public API ──────────────────────────────────────────────────

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value || null
}

export async function getSession(): Promise<{ user: { id: string; email: string } } | null> {
  const token = await getAuthToken()
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null
  if (payload.exp && payload.exp * 1000 < Date.now()) return null

  return { user: { id: payload.sub, email: payload.email } }
}

export async function getProfile() {
  const token = await getAuthToken()
  if (!token) return null

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user ?? null
  } catch {
    return null
  }
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
