'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, ChevronRight, Play, Trophy, Users, Sparkles, Zap, Bot, Code2, Rocket, Clock } from 'lucide-react'
import { getDropsForCommunity } from '@/lib/mock-data'
import { DEFAULT_COMMUNITY_ID, DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'

/* ── Waitlist Form ─────────────────────────────────────────────── */
function WaitlistForm({ size = 'default', cta = 'Get Early Access' }: { size?: 'default' | 'large'; cta?: string }) {
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
      <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <span className="text-emerald-400 text-[15px] font-semibold">{message}</span>
      </div>
    </div>
  )

  const h = size === 'large' ? 'h-14' : 'h-12'

  return (
    <div className="relative max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required className={`w-full ${h} px-5 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-[16px] placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200`} style={{ fontSize: '16px' }} />
        <button type="submit" disabled={status === 'loading'} className={`w-full ${h} px-7 text-[15px] font-bold rounded-2xl shrink-0 text-white transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50`} style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{cta} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
      {status === 'error' && <p className="text-orange-500 text-[13px] text-center mt-2">{message}</p>}
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

/* ── Main Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  const drops = getDropsForCommunity(DEFAULT_COMMUNITY_ID)
  const liveDrop = drops.find(d => d.status === 'live')
  const totalSubmissions = drops.reduce((a, d) => a + d.submissions_count, 0)
  const router = useRouter()

  const handleExplore = () => {
    document.cookie = 'demo_mode=true; path=/; max-age=86400'
    router.push(`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              <span className="text-xs font-black text-white">AI</span>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">Alt AI Labs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#drops" className="hover:text-white transition-colors">Drops</a>
            <a href="#early-access" className="hover:text-white transition-colors">Early Access</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={handleExplore} className="text-[13px] text-zinc-400 hover:text-white transition-colors hidden sm:block">Explore</button>
            <Link href="/signup" className="text-[13px] font-bold h-9 px-5 rounded-xl text-white inline-flex items-center transition-all duration-200" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
              Join Waitlist
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-8 md:pt-36 md:pb-12 px-6 relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-blue-600/[0.12] via-violet-600/[0.06] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-[20%] w-[400px] h-[400px] bg-blue-500/[0.06] rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-40 right-[20%] w-[350px] h-[350px] bg-violet-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.95]">
            <span className="text-white">Build AI.</span><br />
            <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Win money.</span>
          </h1>

          <p className="text-[17px] md:text-[22px] text-zinc-300 mb-8 max-w-xl mx-auto leading-relaxed font-light">
            Every week: a new AI project. A video lesson. A build challenge. The best builds win <span className="text-amber-400 font-semibold">cash</span>.
          </p>

          <WaitlistForm size="large" cta="Get Early Access" />

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 text-[14px]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-zinc-400"><span className="text-white font-bold"><AnimatedCounter target={127} />+</span> builders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-zinc-400"><span className="text-white font-bold"><AnimatedCounter target={totalSubmissions} />+</span> shipped</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-zinc-400"><span className="text-amber-400 font-bold">$<AnimatedCounter target={4250} /></span> in prizes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE Drop Card (the heartbeat) ──────────────────── */}
      {liveDrop && (
        <section className="px-6 pb-16 pt-8">
          <div className="max-w-3xl mx-auto">
            <Link href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${liveDrop.slug}`} className="block group">
              <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-950/80 via-[#09090b] to-violet-950/60 p-1 shadow-[0_0_60px_rgba(59,130,246,0.15),0_0_120px_rgba(139,92,246,0.08)]">
                <div className="rounded-[calc(1.5rem-4px)] bg-[#0c0c10]/90 p-8 md:p-10 relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/[0.06] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                  <div className="relative">
                    {/* Live badge */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="flex items-center gap-2 text-[13px] font-bold text-white px-4 py-2 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                        </span>
                        WEEK {liveDrop.week_number} IS LIVE
                      </span>
                      <span className="text-[13px] text-zinc-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 days left</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight text-white group-hover:text-blue-200 transition-colors">{liveDrop.title}</h2>
                    <p className="text-[15px] md:text-[17px] text-zinc-400 mb-6 max-w-lg leading-relaxed">{liveDrop.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Play className="w-4 h-4 text-blue-400" /> {liveDrop.duration_minutes} min lesson</span>
                      <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Trophy className="w-4 h-4 text-amber-400" /> Cash prizes</span>
                      <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Users className="w-4 h-4 text-violet-400" /> {liveDrop.submissions_count} builders in</span>
                    </div>

                    <div className="inline-flex items-center gap-2 text-white h-12 px-7 text-[15px] font-bold rounded-2xl transition-all duration-300" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
                      Start This Challenge <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Three steps. Every week.</h2>
            <p className="text-zinc-400 mt-4 text-[16px]">No fluff. No 40-hour courses. Just build.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Watch', desc: 'A video lesson where I build something real from scratch. Follow along or riff on it.', icon: <Play className="w-7 h-7" />, bg: 'linear-gradient(135deg, #3b82f6, #22d3ee)' },
              { num: '02', title: 'Build', desc: 'The challenge unlocks. Build your own version — any stack, any spin. You have 7 days.', icon: <Code2 className="w-7 h-7" />, bg: 'linear-gradient(135deg, #8b5cf6, #e879f9)' },
              { num: '03', title: 'Win', desc: 'Submit your build. Top submissions win cash prizes. Every project goes in your portfolio.', icon: <Trophy className="w-7 h-7" />, bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
            ].map((step, i) => (
              <div key={i} className="rounded-3xl p-8 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] relative group transition-all duration-300 hover:translate-y-[-2px]">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg" style={{ background: step.bg }}>{step.icon}</div>
                <span className="text-[12px] font-bold text-zinc-600 tracking-widest">{step.num}</span>
                <h3 className="font-black text-[22px] text-white mt-1 mb-3">{step.title}</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Build ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
              <span className="text-white">Not tutorials.</span><br />
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Real products.</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-[16px] max-w-lg mx-auto">Each week you build something you&apos;d actually use — or sell.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Bot className="w-6 h-6" />, title: 'AI Assistants', desc: 'Custom chatbots with tool use, memory, and real integrations.', bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
              { icon: <Zap className="w-6 h-6" />, title: 'Autonomous Agents', desc: 'Agents that qualify leads, triage inboxes, and automate workflows.', bg: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
              { icon: <Code2 className="w-6 h-6" />, title: 'Full-Stack AI Apps', desc: 'Production apps with auth, payments, and deployment.', bg: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
              { icon: <Rocket className="w-6 h-6" />, title: 'AI Automations', desc: 'Systems that connect APIs, process data, and run on autopilot.', bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
            ].map((item, i) => (
              <div key={i} className="group rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg" style={{ background: item.bg }}>{item.icon}</div>
                <h3 className="font-bold text-[17px] text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Drop Timeline ───────────────────────────────────── */}
      <section id="drops" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">The roadmap</h2>
            <p className="text-zinc-400 mt-4 text-[16px]">8 weeks. 8 real AI products. Here&apos;s what&apos;s dropping.</p>
          </div>
          <div className="space-y-3">
            {drops.map(drop => (
              <Link key={drop.id} href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${drop.slug}`} className={`rounded-2xl p-5 flex items-center gap-4 group transition-all duration-300 block ${
                drop.status === 'live'
                  ? 'border border-blue-500/30'
                  : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
              }`} style={drop.status === 'live' ? { background: 'linear-gradient(to right, rgba(23,37,84,0.6), rgba(46,16,101,0.4))', boxShadow: '0 0 30px rgba(59,130,246,0.1)' } : undefined}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  drop.status !== 'live' && drop.status === 'completed'
                    ? 'bg-white/[0.06]'
                    : drop.status !== 'live'
                    ? 'bg-white/[0.04] border border-white/[0.08]'
                    : ''
                }`} style={drop.status === 'live' ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' } : undefined}>
                  <span className={`text-[15px] font-black ${drop.status === 'live' ? 'text-white' : drop.status === 'completed' ? 'text-zinc-500' : 'text-zinc-600'}`}>W{drop.week_number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-bold text-[15px] truncate transition-colors ${drop.status === 'live' ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>{drop.title}</h3>
                    {drop.status === 'live' && (
                      <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full text-white font-bold shrink-0" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
                        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" /></span>
                        LIVE
                      </span>
                    )}
                    {drop.status === 'upcoming' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-500 font-medium shrink-0">SOON</span>
                    )}
                    {drop.status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] text-zinc-500">{drop.difficulty} · {drop.duration_minutes} min{drop.submissions_count > 0 ? ` · ${drop.submissions_count} builds` : ''}</p>
                </div>
                {drop.prize_per_entrant > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-[14px] text-amber-400 font-bold">${drop.prize_per_entrant * 5}</span>
                  </div>
                )}
                <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white shrink-0 transition-colors group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Works ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Why this works</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <Clock className="w-5 h-5" />, title: 'Ship weekly', desc: 'One focused project per week. Not a 40-hour course.', gradient: 'from-blue-500/20 to-cyan-500/20' },
              { icon: <Trophy className="w-5 h-5" />, title: 'Real money', desc: 'Cash prizes for the best builds. Every. Single. Week.', gradient: 'from-amber-500/20 to-orange-500/20' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Portfolio', desc: 'Every submission is a real project you can show off.', gradient: 'from-violet-500/20 to-fuchsia-500/20' },
              { icon: <Zap className="w-5 h-5" />, title: 'Stay current', desc: 'New AI tools and techniques every week.', gradient: 'from-cyan-500/20 to-blue-500/20' },
              { icon: <Users className="w-5 h-5" />, title: 'Community', desc: 'Share builds, get feedback, find collaborators.', gradient: 'from-pink-500/20 to-rose-500/20' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Production-grade', desc: 'Real APIs, real auth, real deploys. No toy apps.', gradient: 'from-indigo-500/20 to-violet-500/20' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-6 bg-gradient-to-br ${item.gradient} border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300`}>
                <div className="text-white mb-3">{item.icon}</div>
                <h3 className="font-bold text-[15px] text-white mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Early Access ────────────────────────────────────── */}
      <section id="early-access" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/[0.06] via-violet-600/[0.03] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-blue-500/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-5 tracking-tight leading-[0.95]">
            <span className="text-white">Stop watching.</span><br />
            <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start building.</span>
          </h2>
          <p className="text-zinc-400 mb-10 text-[17px] max-w-lg mx-auto leading-relaxed">Join builders who ship a new AI product every week. Early members get founding perks.</p>

          <WaitlistForm size="large" cta="Get Early Access" />

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-[13px] text-zinc-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> Free to join</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> Founding member perks</span>
          </div>
        </div>
      </section>

      {/* ── Creator CTA ───────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 bg-gradient-to-br from-violet-950/60 to-fuchsia-950/40 border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.04] pointer-events-none" />
            <div className="relative text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-white">Run your own builder community</h3>
              <p className="text-[15px] text-zinc-400 mb-7 max-w-md mx-auto leading-relaxed">We&apos;re opening the platform to select creators. Teach AI, vibe coding, no-code — whatever you&apos;re best at.</p>
              <WaitlistForm cta="Request Creator Access" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                  <span className="text-[10px] font-black text-white">AI</span>
                </div>
                <span className="font-bold text-[14px] tracking-tight text-white">Alt AI Labs</span>
              </Link>
              <p className="text-[13px] text-zinc-600 max-w-xs leading-relaxed">Learn AI by building real products. New drop every week. Ship or get shipped.</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-[13px] text-zinc-600 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#drops" className="text-[13px] text-zinc-600 hover:text-white transition-colors">Weekly Drops</a></li>
                <li><a href="#early-access" className="text-[13px] text-zinc-600 hover:text-white transition-colors">Early Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-[13px] text-zinc-600 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-[13px] text-zinc-600 hover:text-white transition-colors">Join Waitlist</Link></li>
                <li><Link href={`/c/${DEFAULT_COMMUNITY_SLUG}/dashboard`} className="text-[13px] text-zinc-600 hover:text-white transition-colors">Explore</Link></li>
              </ul>
            </div>
          </div>
          <div className="h-px bg-white/[0.06] mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-zinc-600">
            <span>&copy; {new Date().getFullYear()} Alt AI Labs. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="mailto:hello@altailabs.com" className="hover:text-zinc-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
