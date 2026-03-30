'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Play } from 'lucide-react'
import { DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`)
      router.refresh()
    }
  }

  const handleOAuth = async (provider: 'apple' | 'google') => {
    setOauthLoading(provider)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        ...(provider === 'apple' ? { scopes: 'name email' } : {}),
      },
    })
    if (error) {
      setError(error.message)
      setOauthLoading(null)
    }
  }

  const handleExplore = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    router.push(`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="w-full max-w-[380px] relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}>
              <span className="text-sm font-bold text-white">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome to Alt AI Labs</h1>
          <p className="text-[14px] text-zinc-400 mt-2">Explore the platform and see what builders are shipping.</p>
        </div>

        {/* Primary CTA: Explore */}
        <button onClick={handleExplore} className="w-full text-white h-12 text-[15px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-3" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
          <Play className="w-4 h-4" /> Explore the Platform
        </button>

        <Link href="/signup" className="w-full border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.04] h-11 text-[13px] font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5">
          Join the Waitlist <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* OAuth Providers */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
          <div className="relative flex justify-center text-[11px]"><span className="bg-[#09090b] px-3 text-zinc-600">or continue with</span></div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handleOAuth('apple')}
            disabled={oauthLoading !== null}
            className="w-full bg-white text-black hover:bg-zinc-100 disabled:opacity-50 h-11 text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
          </button>

          <button
            onClick={() => handleOAuth('google')}
            disabled={oauthLoading !== null}
            className="w-full border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.04] disabled:opacity-50 h-11 text-[13px] font-medium rounded-xl transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        {error && oauthLoading === null && <p className="text-[13px] text-orange-500 text-center mt-3">{error}</p>}

        {!showLogin ? (
          <p className="text-center text-[13px] text-zinc-600 mt-6">
            Already have an account?{' '}
            <button onClick={() => setShowLogin(true)} className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</button>
          </p>
        ) : (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
              <div className="relative flex justify-center text-[11px]"><span className="bg-[#09090b] px-3 text-zinc-600">sign in with account</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-zinc-400">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-white/10 border-2 border-white/20 text-white rounded-xl placeholder:text-zinc-400" placeholder="you@example.com" style={{ fontSize: '16px' }} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-zinc-400">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-12 bg-white/10 border-2 border-white/20 text-white rounded-xl placeholder:text-zinc-400" placeholder="Your password" style={{ fontSize: '16px' }} />
              </div>
              {error && <p className="text-[13px] text-orange-500">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-50 text-white h-10 text-[13px] font-semibold rounded-xl transition-colors">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
