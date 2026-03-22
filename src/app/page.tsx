'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Play, Trophy, CheckCircle2, Loader2, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockCommunities, weeklyDrops } from '@/lib/mock-data'
import { PRICING } from '@/lib/constants'

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
      if (res.ok) { setStatus('success'); setMessage(data.message || "You're in!"); setEmail('') }
      else { setStatus('error'); setMessage(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMessage('Something went wrong') }
  }

  if (status === 'success') return <div className="flex items-center gap-2 justify-center text-green-400 text-[14px] font-medium py-2"><CheckCircle2 className="w-4 h-4" /> {message}</div>

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto">
        <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 h-12 px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-[14px] placeholder:text-neutral-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all" />
        <Button type="submit" disabled={status === 'loading'} className="bg-white text-black hover:bg-neutral-100 h-12 px-6 text-[13px] font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Get Early Access <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
        </Button>
      </form>
      {status === 'error' && <p className="text-red-400 text-[12px] text-center mt-2">{message}</p>}
    </div>
  )
}

const ACCENT_COLORS: Record<string, string> = {
  green: 'from-green-500/20 to-green-500/5 border-green-500/20 hover:border-green-500/30',
  violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 hover:border-violet-500/30',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 hover:border-blue-500/30',
}

const ACCENT_TEXT: Record<string, string> = { green: 'text-green-400', violet: 'text-violet-400', blue: 'text-blue-400' }

export default function HomePage() {
  const totalMembers = mockCommunities.reduce((a, c) => a + c.member_count, 0)
  const totalDrops = weeklyDrops.length
  const liveDrops = weeklyDrops.filter(d => d.status === 'live').length

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center"><span className="text-xs font-bold text-black">A</span></div>
            <span className="font-semibold text-[15px] tracking-tight">Alt AI Labs</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-neutral-400 hover:text-white text-[13px]"><Link href="/login">Sign In</Link></Button>
            <Button size="sm" asChild className="bg-white text-black hover:bg-neutral-200 text-[13px] font-semibold h-8 px-4 rounded-lg"><Link href="/signup">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/[0.04] via-violet-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-[12px] text-green-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {liveDrops} live drop{liveDrops !== 1 ? 's' : ''} across {mockCommunities.length} communities
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="gradient-text">The platform for</span><br />
            <span className="gradient-text">builder communities</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Creators drop weekly video lessons + build challenges. Members watch, build, and compete for cash prizes. Skool for builders.
          </p>
          <WaitlistForm />
          <p className="text-[12px] text-neutral-600 mt-3">{totalMembers}+ builders across {mockCommunities.length} communities</p>
        </div>
      </section>

      {/* Communities */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Active communities</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Join a community. Start building.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {mockCommunities.map(community => {
              const drops = weeklyDrops.filter(d => d.community_id === community.id)
              const liveDrop = drops.find(d => d.status === 'live')
              const totalPrize = drops.reduce((a, d) => a + d.prize_amount, 0)
              return (
                <Link key={community.id} href={`/c/${community.slug}/dashboard`} className={`group block rounded-2xl p-6 border bg-gradient-to-b ${ACCENT_COLORS[community.accent_color]} transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center">
                      <span className={`text-[15px] font-bold ${ACCENT_TEXT[community.accent_color]}`}>{community.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] group-hover:text-white transition-colors">{community.name}</h3>
                      <span className="text-[11px] text-neutral-500">{community.member_count} members</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-neutral-500 mb-4 line-clamp-2">{community.description}</p>
                  {liveDrop && (
                    <div className="rounded-xl p-3 bg-white/[0.04] mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-green-400 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live now
                      </div>
                      <p className="text-[12px] font-medium truncate">{liveDrop.title}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {drops.length} drops</span>
                    {totalPrize > 0 && <span className="flex items-center gap-1 text-amber-400/60"><Trophy className="w-3 h-3" /> ${totalPrize}</span>}
                    <ChevronRight className="w-3 h-3 ml-auto text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">For creators</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Launch your builder community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Record a lesson', desc: 'Film a video showing how to build something real. Upload it as your weekly drop.' },
              { num: '02', title: 'Set a challenge', desc: 'Write a build challenge. Set the rules, deliverables, deadline, and prize amount.' },
              { num: '03', title: 'Watch them ship', desc: 'Your community builds and submits. Pick the winner. The leaderboard updates automatically.' },
            ].map((step, i) => (
              <div key={i} className="rounded-2xl p-6 glass relative">
                <span className="absolute top-5 right-5 text-[40px] font-bold text-white/[0.03] leading-none">{step.num}</span>
                <h3 className="font-semibold text-[15px] mb-2">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Start free. Go pro when ready.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="rounded-2xl p-7 glass">
              <h3 className="font-semibold text-[15px] mb-1">{PRICING.free.name}</h3>
              <div className="text-4xl font-bold mb-6 mt-2">$0<span className="text-sm font-normal text-neutral-500">/mo</span></div>
              <ul className="space-y-3 mb-8">{PRICING.free.features.map(f => <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-400"><CheckCircle2 className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/[0.04] text-[13px] font-medium h-10 rounded-xl" asChild><Link href="/signup">Get Started</Link></Button>
            </div>
            <div className="rounded-2xl p-7 relative glass-strong glow-amber">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="text-[11px] font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-1 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> Popular</span></div>
              <h3 className="font-semibold text-[15px] mb-1">{PRICING.paid.name}</h3>
              <div className="text-4xl font-bold mb-6 mt-2">${PRICING.paid.price}<span className="text-sm font-normal text-neutral-500">/mo</span></div>
              <ul className="space-y-3 mb-8">{PRICING.paid.features.map(f => <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-300"><CheckCircle2 className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black text-[13px] font-semibold h-10 rounded-xl" asChild><Link href="/signup">Start Pro</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-white/[0.06] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/[0.02] to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight gradient-text">Ready to build?</h2>
          <p className="text-neutral-500 mb-8 text-[14px]">Join a community. Watch. Build. Ship. Win.</p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[12px] text-neutral-600">
          <span>&copy; {new Date().getFullYear()} Alt AI Labs</span>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-neutral-400 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-neutral-400 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
