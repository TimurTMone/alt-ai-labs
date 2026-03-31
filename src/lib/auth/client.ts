export function signOut() {
  localStorage.removeItem('auth_token')
  document.cookie = 'auth_token=; path=/; max-age=0'
  document.cookie = 'demo_mode=; path=/; max-age=0'
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}
