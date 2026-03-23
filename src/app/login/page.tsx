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

        {!showLogin ? (
          <p className="text-center text-[13px] text-zinc-600 mt-8">
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
