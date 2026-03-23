'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, CheckCircle2, Loader2, Sparkles, Users, Play, Trophy } from 'lucide-react'
import { DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: fullName }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  const handleExplore = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    router.push(`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`)
    router.refresh()
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">You&apos;re on the list!</h1>
          <p className="text-[15px] text-zinc-400 mb-2">We&apos;ll notify <span className="text-white font-medium">{email}</span> when your spot is ready.</p>
          <p className="text-[13px] text-zinc-600 mb-8">Early members get priority access + founding member perks.</p>

          <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] mb-6">
            <h3 className="text-[13px] font-semibold text-zinc-400 mb-4 uppercase tracking-wider">While you wait</h3>
            <p className="text-[14px] text-zinc-300 mb-5">Explore the full platform in preview mode — browse drops, check out the classroom, and see what builders are shipping.</p>
            <button
              onClick={handleExplore}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white h-11 text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center gap-1.5"
            >
              Explore the Platform <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link href="/" className="text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors">
            Back to homepage
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Join the waitlist</h1>
          <p className="text-[14px] text-zinc-400 mt-2">Get early access to Alt AI Labs — learn AI by building real products every week.</p>
        </div>

        {/* What you get */}
        <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] mb-6 space-y-3">
          {[
            { icon: Play, text: 'New AI project drop every week', color: 'text-blue-400' },
            { icon: Users, text: 'Builder community & leaderboard', color: 'text-violet-400' },
            { icon: Trophy, text: 'Cash prizes for top builds', color: 'text-amber-400' },
            { icon: Sparkles, text: 'Templates, guides & starter kits', color: 'text-cyan-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-[13px]">
              <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
              <span className="text-zinc-300">{item.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] text-zinc-400">Full Name</Label>
            <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} required className="h-12 bg-white/10 border-2 border-white/20 text-white rounded-xl placeholder:text-zinc-400" placeholder="Your name" style={{ fontSize: '16px' }} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] text-zinc-400">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-white/10 border-2 border-white/20 text-white rounded-xl placeholder:text-zinc-400" placeholder="you@example.com" style={{ fontSize: '16px' }} />
          </div>
          {error && <p className="text-[13px] text-orange-500">{error}</p>}
          <button type="submit" disabled={status === 'loading'} className="w-full disabled:opacity-50 text-white h-12 text-[15px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Get Early Access <ArrowRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
          <div className="relative flex justify-center text-[11px]"><span className="bg-[#09090b] px-3 text-zinc-600">or explore first</span></div>
        </div>

        <button onClick={handleExplore} className="w-full border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] h-10 text-[13px] rounded-xl transition-colors flex items-center justify-center gap-1.5">
          Preview the Platform <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-center text-[13px] text-zinc-600 mt-8">
          Already exploring?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
