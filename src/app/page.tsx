'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Trophy, Terminal, CheckCircle2, Loader2, ChevronRight, Zap, Bot, Code2, Cpu, GitBranch, Rocket, Users, Star, ArrowUpRight, Sparkles, Shield, Clock, Crown } from 'lucide-react'
import { getDropsForCommunity } from '@/lib/mock-data'
import { PRICING } from '@/lib/constants'

/* ── Waitlist Form ─────────────────────────────────────────────── */
function WaitlistForm({ size = 'default', cta = 'Get Early Access', accent = 'emerald' }: { size?: 'default' | 'large'; cta?: string; accent?: 'emerald' | 'amber' | 'violet' }) {
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

  if (status === 'success') return (
    <div className="flex items-center gap-2 justify-center py-3">
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )

  const h = size === 'large' ? 'h-[52px]' : 'h-11'
  const btnColors = {
    emerald: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.35)]',
    amber: 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_24px_rgba(245,158,11,0.25)] hover:shadow-[0_0_32px_rgba(245,158,11,0.35)]',
    violet: 'bg-violet-500 hover:bg-violet-400 text-white shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:shadow-[0_0_32px_rgba(139,92,246,0.35)]',
  }

  return (
    <div className="relative max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required className={`flex-1 ${h} px-4 rounded-xl bg-white/[0.07] border border-white/[0.12] text-white text-[14px] placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/15 transition-all duration-200`} />
        <button type="submit" disabled={status === 'loading'} className={`${h} px-6 text-[13px] font-semibold rounded-xl shrink-0 ${btnColors[accent]} transition-all duration-300 inline-flex items-center justify-center gap-1.5 disabled:opacity-50`}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{cta} <ArrowRight className="w-3.5 h-3.5" /></>}
        </button>
      </form>
      {status === 'error' && <p className="text-red-400 text-[12px] text-center mt-2">{message}</p>}
    </div>
  )
}

/* ── Animated Counter ──────────────────────────────────────────── */
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const steps = 40
    const inc = target / steps
    let c = 0
    const t = setInterval(() => { c += inc; if (c >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(c)) }, 1500 / steps)
    return () => clearInterval(t)
  }, [target])
  return <>{count}</>
}

/* ── Logo Component ────────────────────────────────────────────── */
function Logo({ size = 'default' }: { size?: 'default' | 'small' }) {
  const s = size === 'small' ? 'w-7 h-7' : 'w-8 h-8'
  return (
    <div className={`${s} rounded-lg bg-emerald-500 flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/[0.15]" />
      <span className="relative text-xs font-black text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>AI</span>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  const drops = getDropsForCommunity('community-001')
  const liveDrop = drops.find(d => d.status === 'live')
  const totalSubmissions = drops.reduce((a, d) => a + d.submissions_count, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo />
            <span className="font-semibold text-[15px] tracking-tight text-white">Alt AI Labs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] text-neutral-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#drops" className="hover:text-white transition-colors">Drops</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link href="/signup" className="text-[13px] font-semibold h-8 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white inline-flex items-center transition-all duration-200 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/[0.07] via-emerald-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          {liveDrop && (
            <Link href={`/c/alt-ai-labs/drops/${liveDrop.slug}`} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-[12px] text-emerald-400 mb-8 hover:bg-emerald-500/[0.1] hover:border-emerald-500/30 transition-all duration-300 group max-w-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-medium shrink-0">Week {liveDrop.week_number} is live</span>
              <span className="text-emerald-300/80 truncate hidden sm:inline">{liveDrop.title}</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="text-white">Stop learning AI.</span><br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Start shipping it.</span>
          </h1>

          <p className="text-[17px] md:text-[20px] text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Every week: a new AI project. A video lesson. A build challenge.<br className="hidden md:block" />
            The best builds win <span className="text-amber-400 font-medium">cash prizes</span>.
          </p>

          <WaitlistForm size="large" cta="Join Free" accent="emerald" />

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 mt-8 text-[13px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500/50" />
              <span><span className="text-white font-medium"><AnimatedCounter target={127} />+</span> builders</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08] hidden md:block" />
            <div className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-emerald-500/50" />
              <span><span className="text-white font-medium"><AnimatedCounter target={totalSubmissions} />+</span> builds shipped</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08] hidden md:block" />
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500/50" />
              <span><span className="text-amber-400 font-medium">$<AnimatedCounter target={4250} />+</span> in prizes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Terminal Preview ──────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-6 bg-gradient-to-b from-emerald-500/[0.05] via-transparent to-transparent rounded-3xl blur-2xl" />
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] relative shadow-2xl shadow-black/60">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[11px] text-neutral-500 ml-2 font-mono">~/alt-ai-labs</span>
            </div>
            <div className="p-6 bg-[#0c0c0e] font-mono text-[13px] leading-loose space-y-0.5">
              <p><span className="text-emerald-400">$</span> <span className="text-white/80">cat this-week.md</span></p>
              <p className="text-neutral-500 mt-2"># {liveDrop?.title || 'AI Executive Assistant in Claude Code + VS Code'}</p>
              <p className="text-neutral-600 mt-1">{liveDrop?.description || 'Build a full AI executive assistant — email triage, calendar management, daily briefings.'}</p>
              <p className="text-neutral-500 mt-3">## Stack</p>
              <p className="text-blue-400/80">Claude Code + VS Code + Claude API + Vercel</p>
              <p className="text-neutral-500 mt-3">## Prize</p>
              <p className="text-amber-400/90">${liveDrop?.prize_amount || 500} to the best build</p>
              <p className="text-neutral-500 mt-3">## Status</p>
              <p className="text-emerald-400/90">LIVE — 6 days remaining</p>
              <p className="mt-3"><span className="text-emerald-400">$</span> <span className="text-white/40 animate-pulse">▌</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ───────────────────────────────────────── */}
      <section className="py-10 px-6 border-t border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[10px] text-neutral-600 uppercase tracking-[0.25em] mb-5 font-medium">Build with industry tools</p>
          <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
            {['OpenAI', 'Anthropic', 'Vercel', 'Next.js', 'Supabase', 'Stripe'].map(name => (
              <span key={name} className="text-[13px] font-medium text-neutral-700 hover:text-neutral-400 transition-colors cursor-default">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You'll Build ─────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/15 text-[11px] text-blue-400 font-medium uppercase tracking-widest mb-5">
              <Sparkles className="w-3 h-3" /> Real projects
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Not tutorials.<br /><span className="text-neutral-400">Production-grade AI.</span></h2>
            <p className="text-neutral-500 mt-4 text-[15px] max-w-lg mx-auto">Each week you build something you&apos;d actually use — or sell.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Bot className="w-5 h-5" />, title: 'AI Assistants', desc: 'Custom chatbots with tool use, memory, and real integrations.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
              { icon: <Cpu className="w-5 h-5" />, title: 'Autonomous Agents', desc: 'Agents that qualify leads, triage inboxes, and automate workflows.', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/15' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Full-Stack AI Apps', desc: 'Production apps with Next.js, auth, payments, and deployment.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
              { icon: <GitBranch className="w-5 h-5" />, title: 'AI Automations', desc: 'Systems that connect APIs, process data, and run on autopilot.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
            ].map((item, i) => (
              <div key={i} className="group rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl border ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-white mb-1">{item.title}</h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.015] via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/15 text-[11px] text-emerald-400 font-medium uppercase tracking-widest mb-5">
              <Zap className="w-3 h-3" /> Every week
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Watch. Build. Ship.</h2>
            <p className="text-neutral-500 mt-4 text-[15px]">Three steps. Repeat weekly. Get dangerously good at AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Play className="w-6 h-6" />, num: '01', title: 'Watch the drop', desc: 'A new video lesson every week. I build something real from scratch — you follow along or riff on it.', color: 'text-blue-400', accent: 'border-blue-500/15 bg-blue-500/[0.06]' },
              { icon: <Terminal className="w-6 h-6" />, num: '02', title: 'Build the challenge', desc: 'The challenge unlocks after watching. Build your own version. Any stack, any spin. 7 days.', color: 'text-emerald-400', accent: 'border-emerald-500/15 bg-emerald-500/[0.06]' },
              { icon: <Trophy className="w-6 h-6" />, num: '03', title: 'Ship & win', desc: 'Submit your build. Top submissions win cash prizes. Every project goes in your portfolio.', color: 'text-amber-400', accent: 'border-amber-500/15 bg-amber-500/[0.06]' },
            ].map((step, i) => (
              <div key={i} className="rounded-2xl p-7 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] relative group transition-all duration-300">
                <span className="absolute top-5 right-6 text-[52px] font-bold text-white/[0.03] leading-none select-none">{step.num}</span>
                <div className={`w-12 h-12 rounded-2xl border ${step.accent} flex items-center justify-center ${step.color} mb-5`}>{step.icon}</div>
                <h3 className="font-semibold text-[16px] text-white mb-2.5">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Drops ─────────────────────────────────────────────── */}
      <section id="drops" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/15 text-[11px] text-amber-400 font-medium uppercase tracking-widest mb-5">
              <Crown className="w-3 h-3" /> Track record
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Real builds. Real prizes.</h2>
            <p className="text-neutral-500 mt-4 text-[15px]">Here&apos;s what&apos;s been dropped so far.</p>
          </div>
          <div className="space-y-3">
            {drops.map(drop => (
              <Link key={drop.id} href={`/c/alt-ai-labs/drops/${drop.slug}`} className={`rounded-2xl p-5 bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 group hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 block ${drop.status === 'live' ? 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]' : ''}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${drop.status === 'live' ? 'bg-emerald-500/10 border border-emerald-500/20' : drop.status === 'upcoming' ? 'bg-blue-500/10 border border-blue-500/15' : 'bg-white/[0.04] border border-white/[0.06]'}`}>
                  <span className={`text-[14px] font-bold ${drop.status === 'live' ? 'text-emerald-400' : drop.status === 'upcoming' ? 'text-blue-400' : 'text-neutral-600'}`}>W{drop.week_number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-[14px] text-white truncate group-hover:text-emerald-300 transition-colors">{drop.title}</h3>
                    {drop.status === 'live' && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
                        LIVE
                      </span>
                    )}
                    {drop.status === 'upcoming' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold shrink-0">SOON</span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-600">{drop.difficulty} · {drop.duration_minutes} min{drop.submissions_count > 0 ? ` · ${drop.submissions_count} builds` : ''}</p>
                </div>
                {drop.prize_amount > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-amber-400/60" />
                    <span className="text-[13px] text-amber-400 font-semibold">${drop.prize_amount}</span>
                  </div>
                )}
                <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-white shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/c/alt-ai-labs/drops" className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-emerald-400 transition-colors group">
              View all drops <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Alt AI Labs ───────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.008] to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Why builders choose us</h2>
            <p className="text-neutral-500 mt-4 text-[15px] max-w-lg mx-auto">This isn&apos;t a course. It&apos;s a weekly build gym for people who ship.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Clock className="w-5 h-5" />, title: 'Ship weekly', desc: 'No 40-hour courses. One focused project per week.', color: 'text-emerald-400' },
              { icon: <Trophy className="w-5 h-5" />, title: 'Win real money', desc: 'Cash prizes for the best builds every single week.', color: 'text-amber-400' },
              { icon: <Star className="w-5 h-5" />, title: 'Build a portfolio', desc: 'Every submission is a real project you can show off.', color: 'text-blue-400' },
              { icon: <Shield className="w-5 h-5" />, title: 'Production-grade', desc: 'Real APIs, real auth, real deploys. No toy apps.', color: 'text-violet-400' },
              { icon: <Users className="w-5 h-5" />, title: 'Builder community', desc: 'Share builds, get feedback, find collaborators.', color: 'text-pink-400' },
              { icon: <Zap className="w-5 h-5" />, title: 'Stay current', desc: 'New tools and techniques every week. Never fall behind.', color: 'text-cyan-400' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${item.color} mb-4`}>{item.icon}</div>
                <h3 className="font-semibold text-[14px] text-white mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who This Is For ───────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Who this is for</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Developers', desc: 'You can code. You want real AI experience — not another theory course. You want to ship.', icon: <Code2 className="w-6 h-6" />, tag: 'Most popular', color: 'text-emerald-400', tagBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' },
              { title: 'Founders', desc: 'You need to prototype AI features fast and understand the tech well enough to lead your team.', icon: <Rocket className="w-6 h-6" />, tag: 'Fast track', color: 'text-blue-400', tagBg: 'bg-blue-500/10 text-blue-400 border-blue-500/15' },
              { title: 'Career Switchers', desc: 'You\'ve used ChatGPT. Now you want to build with AI — and have the portfolio to prove it.', icon: <Bot className="w-6 h-6" />, tag: 'Start here', color: 'text-violet-400', tagBg: 'bg-violet-500/10 text-violet-400 border-violet-500/15' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-7 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] group transition-all duration-300 relative">
                <div className="absolute top-5 right-5">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${item.tagBg}`}>{item.tag}</span>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${item.color} mb-5`}>{item.icon}</div>
                <h3 className="font-semibold text-[17px] text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.008] to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-neutral-400 font-medium uppercase tracking-widest mb-5">
              Simple pricing
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Start free. Upgrade when<br className="hidden md:block" /> you&apos;re ready to compete.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[16px] text-white">{PRICING.free.name}</h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">For getting started</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">$0</div>
                  <p className="text-[11px] text-neutral-600">forever</p>
                </div>
              </div>
              <div className="h-px bg-white/[0.06] mb-6" />
              <ul className="space-y-3.5 mb-8">
                {PRICING.free.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-[13px] text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full h-11 rounded-xl border border-white/[0.1] text-[13px] font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-200 flex items-center justify-center">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative bg-white/[0.03] border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="text-[11px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Zap className="w-3 h-3" /> Most Popular
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[16px] text-white">{PRICING.paid.name}</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">For serious builders</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">${PRICING.paid.price}<span className="text-sm font-normal text-neutral-500">/mo</span></div>
                  <p className="text-[11px] text-neutral-600">cancel anytime</p>
                </div>
              </div>
              <div className="h-px bg-white/[0.08] mb-6" />
              <ul className="space-y-3.5 mb-8">
                {PRICING.paid.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-[13px] text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-[13px] font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 flex items-center justify-center gap-1.5">
                Join Pro Waitlist <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Creator CTA ───────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-10 bg-white/[0.02] border border-violet-500/15 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-blue-500/[0.04] group-hover:from-violet-500/[0.06] group-hover:to-blue-500/[0.06] transition-all duration-500" />
            <div className="relative text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white">Run your own builder community</h3>
              <p className="text-[14px] text-neutral-500 mb-7 max-w-md mx-auto leading-relaxed">We&apos;re opening the platform to select creators. Teach AI, vibe coding, no-code — whatever you&apos;re best at.</p>
              <WaitlistForm cta="Request Creator Access" accent="violet" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.04] via-emerald-500/[0.01] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
            <span className="text-white">Stop watching tutorials.</span><br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Start shipping AI.</span>
          </h2>
          <p className="text-neutral-500 mb-10 text-[16px] max-w-lg mx-auto">Join a community of builders who ship a new AI project every week.</p>
          <WaitlistForm size="large" cta="Join Free — $0 Forever" accent="emerald" />
          <div className="flex flex-wrap items-center justify-center gap-5 mt-6 text-[12px] text-neutral-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> New drops weekly</span>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <Logo size="small" />
                <span className="font-semibold text-[14px] tracking-tight text-white">Alt AI Labs</span>
              </Link>
              <p className="text-[13px] text-neutral-600 max-w-xs leading-relaxed">Learn AI by building real products. New drop every week. Ship or get shipped.</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-[13px] text-neutral-600 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#drops" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Weekly Drops</a></li>
                <li><a href="#pricing" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/c/alt-ai-labs/drops" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Browse Drops</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/c/alt-ai-labs/dashboard" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="h-px bg-white/[0.06] mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-neutral-600">
            <span>&copy; {new Date().getFullYear()} Alt AI Labs. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="mailto:hello@altailabs.com" className="hover:text-neutral-400 transition-colors">Contact</a>
              <a href="https://github.com/TimurTMone/alt-ai-labs" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
