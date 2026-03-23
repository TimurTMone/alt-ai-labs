'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Play, Trophy, Users, Sparkles, BookOpen, Zap } from 'lucide-react'
import { DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMessage(data.message || "You're on the list!"); setEmail('') }
      else { setStatus('error'); setMessage(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMessage('Something went wrong') }
  }

  if (status === 'success') return (
    <div className="flex items-center gap-2 justify-center py-3">
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20">
        <CheckCircle2 className="w-4 h-4 text-blue-400" />
        <span className="text-blue-400 text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-md mx-auto">
      <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 h-12 px-4 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white text-[14px] placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200" />
      <button type="submit" disabled={status === 'loading'} className="h-12 px-6 text-[13px] font-semibold rounded-xl shrink-0 bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_24px_rgba(59,130,246,0.25)] transition-all duration-300 inline-flex items-center justify-center gap-1.5 disabled:opacity-50">
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join Waitlist <ArrowRight className="w-3.5 h-3.5" /></>}
      </button>
    </form>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-12 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-white mb-10 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/15 text-[11px] text-blue-400 font-medium uppercase tracking-widest mb-5">
            <Zap className="w-3 h-3" /> Early Access
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Get in before we launch</h1>
          <p className="text-[15px] text-zinc-400 max-w-lg mx-auto">We&apos;re building the best way to learn AI by doing. Join the waitlist and be first in when we open the doors.</p>
        </div>

        {/* What's included */}
        <div className="rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06] mb-8">
          <h2 className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">Everything you get</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Play, title: 'Weekly AI Drops', desc: 'A new video lesson + build challenge every week', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
              { icon: Trophy, title: 'Cash Prizes', desc: 'Top builds win real money every single week', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
              { icon: BookOpen, title: 'Classroom & Guides', desc: 'Templates, starter kits, and deep-dive tutorials', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/15' },
              { icon: Users, title: 'Builder Community', desc: 'Share builds, get feedback, climb the leaderboard', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/15' },
              { icon: Sparkles, title: 'AI Templates', desc: 'Production-ready starters for chatbots, agents, RAG & more', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/15' },
              { icon: Zap, title: 'Stay Current', desc: 'New tools and techniques every week — never fall behind', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl">
                <div className={`w-10 h-10 rounded-xl border ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-white mb-0.5">{item.title}</h3>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist CTA */}
        <div className="rounded-2xl p-8 bg-white/[0.03] border border-blue-500/15 text-center shadow-[0_0_40px_rgba(59,130,246,0.06)]">
          <h2 className="text-xl font-bold mb-2">Ready to start building?</h2>
          <p className="text-[14px] text-zinc-400 mb-6">Join the waitlist — early members get founding perks.</p>
          <WaitlistForm />
          <div className="flex flex-wrap items-center justify-center gap-5 mt-5 text-[12px] text-zinc-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-600" /> Free to join</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-600" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-600" /> Early access priority</span>
          </div>
        </div>

        {/* Explore link */}
        <div className="text-center mt-8">
          <Link href={`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`} className="text-[13px] text-zinc-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
            onClick={() => { document.cookie = 'demo_mode=true; path=/; max-age=86400' }}>
            Or explore the platform first <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
