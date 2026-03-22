'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
      router.push('/c/alt-ai-labs/dashboard')
      router.refresh()
    }
  }

  const handleDemo = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="w-full max-w-[360px] relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-[13px] text-neutral-500 mt-1.5">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] text-neutral-400">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-neutral-600" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-neutral-400">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-neutral-600" placeholder="Your password" />
          </div>
          {error && <p className="text-[13px] text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white h-10 text-[13px] font-semibold rounded-xl transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
          <div className="relative flex justify-center text-[11px]"><span className="bg-[#0a0a0c] px-3 text-neutral-600">or</span></div>
        </div>

        <button onClick={handleDemo} className="w-full border border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.04] h-10 text-[13px] rounded-xl transition-colors flex items-center justify-center gap-1.5">
          Enter Demo Mode <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-center text-[13px] text-neutral-600 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
