'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, Play, Trophy, Zap, Clock, Building2 } from 'lucide-react'
import { DEFAULT_COMMUNITY_ID, DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'
import { track } from '@/lib/analytics'
import type { Drop } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

function WaitlistForm({ location = 'unknown' }: { location?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    track('waitlist_submit_attempt', { location })
    try {
      const res = await fetch(`${API_URL}/api/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMessage(data.message || "You're in!"); setEmail(''); track('waitlist_submit_success', { location }) }
      else { setStatus('error'); setMessage(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMessage('Something went wrong') }
  }

  if (status === 'success') return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      <span className="text-emerald-400 text-sm font-medium">{message}</span>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
        className="flex-1 h-11 px-4 rounded-xl bg-foreground/[0.06] border border-foreground/[0.1] text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-blue-500/50 transition-colors" style={{ fontSize: '16px' }} />
      <button type="submit" disabled={status === 'loading'}
        className="h-11 px-5 text-sm font-semibold rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 shrink-0">
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify me'}
      </button>
    </form>
  )
}

export default function HomePage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch(`${API_URL}/api/challenges?community_id=${DEFAULT_COMMUNITY_ID}`)
      .then(r => r.ok ? r.json() : { challenges: [] })
      .then(d => setDrops(d.challenges || []))
      .catch(() => {})
  }, [])

  const liveDrops = drops.filter(d => d.status === 'live')
  const totalSubmissions = drops.reduce((a, d) => a + d.submissions_count, 0)

  const handleStart = () => {
    track('cta_click', { cta: 'start_building', location: 'hero' })
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    router.push(`/c/${DEFAULT_COMMUNITY_SLUG}/drops`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 border-b border-foreground/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">AI</span>
            </div>
            <span className="font-bold text-sm tracking-tight">Alt AI Labs</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-foreground/50 hover:text-foreground transition-colors hidden sm:block">Sign In</Link>
            <button onClick={handleStart} className="text-sm font-semibold h-9 px-5 rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition-colors inline-flex items-center gap-1.5">
              Start Building <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-8">
            <Trophy className="w-4 h-4" /> Sponsored challenges with real cash prizes
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
            The club where<br />
            <span className="text-blue-500">AI builders are made.</span>
          </h1>

          <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed">
            We drop AI challenges every week. You build real projects, compete against other builders, and win cash prizes. The best performers get hired by us and our partners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button onClick={handleStart} className="w-full sm:w-auto h-12 px-8 text-sm font-bold rounded-xl text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all inline-flex items-center justify-center gap-2">
              Join the Club — It&apos;s Free <ArrowRight className="w-4 h-4" />
            </button>
            {liveDrops[0] && (
              <Link href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${liveDrops[0].slug}`}
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold rounded-xl text-foreground/70 border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all inline-flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> See This Week&apos;s Challenge
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-foreground/40">
            <span><span className="text-foreground font-bold">{127}+</span> members</span>
            <span><span className="text-foreground font-bold">{totalSubmissions}+</span> projects built</span>
            <span className="text-amber-500 font-bold">$7,500+ awarded</span>
          </div>
        </div>
      </section>

      {/* ── Live Drops (the product) ────────────────────────── */}
      {liveDrops.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs font-bold text-foreground/30 uppercase tracking-widest mb-6 text-center">Live Now</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {liveDrops.slice(0, 4).map(drop => {
                const videoId = drop.video_url?.split('/embed/')[1]?.split('?')[0]
                return (
                  <Link key={drop.id} href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${drop.slug}`}
                    className="group rounded-2xl overflow-hidden border border-foreground/[0.08] hover:border-blue-500/30 transition-all bg-foreground/[0.02] hover:bg-foreground/[0.04]">
                    {/* Thumbnail */}
                    {videoId && (
                      <div className="aspect-video relative overflow-hidden">
                        <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={drop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-500 px-2.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                          </span>
                          {drop.prize_amount > 0 && (
                            <span className="text-xs font-bold text-amber-300 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
                              <Trophy className="w-3 h-3 inline mr-1" />${drop.prize_amount}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="text-xs text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded-lg">{drop.duration_minutes} min</span>
                        </div>
                      </div>
                    )}
                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-blue-500 transition-colors">{drop.title}</h3>
                      <p className="text-xs text-foreground/50 line-clamp-2">{drop.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-foreground/40">
                        {drop.creator_name && <span>by {drop.creator_name}</span>}
                        <span>{drop.submissions_count} builds</span>
                        <span>{drop.difficulty}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-foreground/[0.06]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-4">How the club works</h2>
          <p className="text-foreground/50 text-sm text-center mb-16">Every week, a new AI challenge drops. You build it. The best win.</p>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { num: '1', title: 'Learn', desc: 'A creator drops a lesson — video, tutorial, or code walkthrough. Real skills, not theory.', icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { num: '2', title: 'Build', desc: 'The challenge unlocks. You have 7 days to build your own version. Any tools. Any approach.', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { num: '3', title: 'Compete', desc: 'Submit your project. The community votes. Top builders win cash prizes and get noticed by employers.', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((step, i) => (
              <div key={i}>
                <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mx-auto mb-5`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="text-xs font-bold text-foreground/30 mb-2">STEP {step.num}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Drops ─────────────────────────────────────────── */}
      {drops.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">This week&apos;s challenges</h2>
              <p className="text-foreground/50 text-sm">Created by top AI builders — Nate Herk, Dan Martell, Timur M., and more.</p>
            </div>
            <div className="space-y-2">
              {drops.map(drop => (
                <Link key={drop.id} href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${drop.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-foreground/[0.06] hover:border-foreground/[0.12] hover:bg-foreground/[0.02] transition-all group">
                  {/* Thumbnail or status icon */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-foreground/[0.04] flex items-center justify-center">
                    {drop.video_url ? (() => {
                      const vid = drop.video_url!.split('/embed/')[1]?.split('?')[0]
                      return vid ? <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" className="w-full h-full object-cover" />
                        : <Play className="w-5 h-5 text-foreground/30" />
                    })() : drop.status === 'live' ? (
                      <Zap className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-foreground/20" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm truncate group-hover:text-blue-500 transition-colors">{drop.title}</h3>
                      {drop.status === 'live' && (
                        <span className="text-[10px] font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full shrink-0">LIVE</span>
                      )}
                      {drop.status === 'upcoming' && (
                        <span className="text-[10px] font-medium text-foreground/30 bg-foreground/[0.05] px-2 py-0.5 rounded-full shrink-0">SOON</span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/40">{drop.creator_name && `${drop.creator_name} · `}{drop.difficulty} · {drop.duration_minutes}m{drop.submissions_count > 0 ? ` · ${drop.submissions_count} builds` : ''}</p>
                  </div>
                  {drop.prize_amount > 0 && (
                    <span className="text-sm font-bold text-amber-500 shrink-0">${drop.prize_amount}</span>
                  )}
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={handleStart} className="h-11 px-6 text-sm font-semibold rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                See All Challenges <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Sponsors ──────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-foreground/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Our sponsors fund the prizes</h2>
          <p className="text-foreground/50 text-sm mb-12">Companies sponsor challenges to discover and hire the best AI talent. Builders keep 100% of prize money.</p>

          <div className="rounded-2xl p-8 border border-amber-500/20 bg-amber-500/[0.03] mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-amber-500" />
              <h3 className="text-xl font-black">AITIM HOLDING</h3>
            </div>
            <p className="text-sm text-foreground/50 mb-4">Title sponsor — investing in the next generation of AI builders with <span className="text-amber-500 font-bold">$500 weekly prize pools</span>.</p>
            <div className="flex items-center justify-center gap-4 text-xs text-foreground/40">
              <span>5 challenges funded</span>
              <span>$2,500+ awarded</span>
              <span>Hiring top performers</span>
            </div>
          </div>

          <a href="mailto:hello@altailabs.com" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors">
            <Building2 className="w-4 h-4" /> Sponsor a challenge and find your next AI hire →
          </a>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Your future starts with what you build today.
          </h2>
          <p className="text-foreground/50 mb-8 text-sm">Join the club. Pick a challenge. Build something real. The best get hired.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button onClick={handleStart} className="w-full sm:w-auto h-12 px-8 text-sm font-bold rounded-xl text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all inline-flex items-center justify-center gap-2">
              Join the Club <ArrowRight className="w-4 h-4" />
            </button>
            <WaitlistForm location="footer" />
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-foreground/30">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Free</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> No credit card</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> New drops weekly</span>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-foreground/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <span className="text-[8px] font-black text-white">AI</span>
              </div>
              <span className="text-xs text-foreground/30">&copy; {new Date().getFullYear()} Alt AI Labs Club</span>
            </div>
            <div className="flex gap-5 text-xs text-foreground/30">
              <Link href="/login" className="hover:text-foreground/60 transition-colors">Sign In</Link>
              <a href="mailto:hello@altailabs.com" className="hover:text-foreground/60 transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-foreground/[0.04]">
            <p className="text-xs text-foreground/25">A product of <a href="https://altailabs.ai" className="text-foreground/40 hover:text-foreground/60 underline underline-offset-2 transition-colors">Alt AI Labs</a> — building the future of AI education.</p>
            <a href="https://altailabs.ai" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">altailabs.ai →</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
