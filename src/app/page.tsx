'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, ChevronRight, Play, Trophy, Users, Sparkles, Zap, Bot, Code2, Rocket, Clock, Building2, Award } from 'lucide-react'
import { getDropsForCommunity } from '@/lib/mock-data'
import { DEFAULT_COMMUNITY_ID, DEFAULT_COMMUNITY_SLUG } from '@/lib/constants'

/* ── API URL ───────────────────────────────────────────────────── */
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

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
      const res = await fetch(`${API_URL}/api/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
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
            <a href="#challenges" className="hover:text-white transition-colors">Challenges</a>
            <a href="#sponsors" className="hover:text-white transition-colors">For Sponsors</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/signup" className="text-[13px] text-zinc-400 hover:text-white transition-colors hidden sm:block">Join Waitlist</Link>
            <button onClick={handleExplore} className="text-[13px] font-bold h-9 px-5 rounded-xl text-white inline-flex items-center gap-1.5 transition-all duration-200" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
              Start Building <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
            <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Get paid.</span>
          </h1>

          <p className="text-[17px] md:text-[22px] text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            A new AI challenge drops every week. Sponsors fund the prizes. The best builders <span className="text-amber-400 font-semibold">win cash</span> and get hired.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button onClick={handleExplore} className="w-full sm:w-auto h-14 px-8 text-[15px] font-bold rounded-2xl text-white inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/signup" className="w-full sm:w-auto h-14 px-8 text-[15px] font-bold rounded-2xl text-white inline-flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-200">
              Join Waitlist
            </Link>
          </div>

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
              <span className="text-zinc-400"><span className="text-amber-400 font-bold">$<AnimatedCounter target={7500} /></span> in prizes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sponsor Banner ──────────────────────────────────── */}
      <section className="px-6 pt-8 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
            <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-[14px] text-zinc-300">
              Weekly challenges sponsored by <span className="text-amber-400 font-bold">AITIM HOLDING</span> — <span className="text-white font-semibold">$500 prizes</span> every week
            </span>
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
        </div>
      </section>

      {/* ── LIVE Drop Card (the heartbeat) ──────────────────── */}
      {liveDrop && (
        <section className="px-6 pb-16 pt-4">
          <div className="max-w-3xl mx-auto">
            <Link href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${liveDrop.slug}`} className="block group">
              <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 bg-gradient-to-br from-blue-950/80 via-[#09090b] to-violet-950/60 p-1 shadow-[0_0_60px_rgba(59,130,246,0.15),0_0_120px_rgba(139,92,246,0.08)]">
                <div className="rounded-[calc(1.5rem-4px)] bg-[#0c0c10]/90 p-8 md:p-10 relative overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/[0.06] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                  <div className="relative">
                    {/* Live badge + Sponsor */}
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      <span className="flex items-center gap-2 text-[13px] font-bold text-white px-4 py-2 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                        </span>
                        THIS WEEK&apos;S CHALLENGE
                      </span>
                      {liveDrop.sponsor_name && (
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                          <Award className="w-3.5 h-3.5" /> Sponsored by {liveDrop.sponsor_name}
                        </span>
                      )}
                      <span className="text-[13px] text-zinc-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 6 days left</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight text-white group-hover:text-blue-200 transition-colors">{liveDrop.title}</h2>
                    <p className="text-[15px] md:text-[17px] text-zinc-400 mb-6 max-w-lg leading-relaxed">{liveDrop.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Play className="w-4 h-4 text-blue-400" /> {liveDrop.duration_minutes} min lesson</span>
                      {liveDrop.prize_amount > 0 && (
                        <span className="flex items-center gap-2 text-[13px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl"><Trophy className="w-4 h-4 text-amber-400" /> ${liveDrop.prize_amount} prize</span>
                      )}
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

      {/* ── Featured Builds ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
              <span className="text-white">Built on</span>{' '}
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Alt AI Labs</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-[16px]">Real projects shipped by our builders. Not demos — products people use.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: 'Solo OS',
                desc: 'A personal AI operating system — tasks, notes, calendar, and habits unified in one AI-powered command center. Natural language control, smart daily planning, and integrations with Google Calendar, Notion, and Todoist.',
                builder: 'Timur M.',
                tags: ['AI Agents', 'Full-Stack', 'Productivity'],
                gradient: 'from-blue-600/20 to-cyan-600/10',
                border: 'border-blue-500/20 hover:border-blue-500/40',
                icon: <Bot className="w-6 h-6 text-blue-400" />,
                status: 'Live',
              },
              {
                title: 'AI Site Builder',
                desc: 'Generate production-ready websites from a single prompt. Responsive design, real copy (not lorem ipsum), SEO optimization, and one-click deploy to Vercel. Built 12 client sites in the first month.',
                builder: 'Timur M.',
                tags: ['No-Code', 'Web Dev', 'AI Generation'],
                gradient: 'from-violet-600/20 to-fuchsia-600/10',
                border: 'border-violet-500/20 hover:border-violet-500/40',
                icon: <Code2 className="w-6 h-6 text-violet-400" />,
                status: 'Live',
              },
              {
                title: 'AI Song Creator',
                desc: 'Turn a text prompt into a full song — lyrics, melody, arrangement, and production. Supports multiple genres. Exported tracks used by 3 independent artists on Spotify. Built with Claude + Suno API.',
                builder: 'Timur M.',
                tags: ['AI Music', 'Creative AI', 'API Integration'],
                gradient: 'from-pink-600/20 to-rose-600/10',
                border: 'border-pink-500/20 hover:border-pink-500/40',
                icon: <Sparkles className="w-6 h-6 text-pink-400" />,
                status: 'Live',
              },
              {
                title: 'AI YouTube Pipeline',
                desc: 'End-to-end content automation — topic research, script generation with hooks and CTAs, thumbnail concepts, SEO-optimized titles and descriptions. Batch-plan 30 days of videos from one brainstorm session.',
                builder: 'Timur M.',
                tags: ['Content AI', 'Automation', 'YouTube'],
                gradient: 'from-amber-600/20 to-orange-600/10',
                border: 'border-amber-500/20 hover:border-amber-500/40',
                icon: <Play className="w-6 h-6 text-amber-400" />,
                status: 'Live',
              },
            ].map((project, i) => (
              <div key={i} className={`rounded-2xl p-6 bg-gradient-to-br ${project.gradient} border ${project.border} transition-all duration-300 group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center">{project.icon}</div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{project.status}</span>
                </div>
                <h3 className="font-bold text-[18px] text-white mb-2">{project.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="text-[11px] text-zinc-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-bold text-zinc-400">T</div>
                  <span className="text-[12px] text-zinc-500">{project.builder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Challenges ────────────────────────────────────────── */}
      <section id="challenges" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">Challenges</h2>
            <p className="text-zinc-400 mt-4 text-[16px]">New challenge every week. Jump in anytime. Build your portfolio.</p>
          </div>
          <div className="space-y-3">
            {drops.map(drop => (
              <Link key={drop.id} href={`/c/${DEFAULT_COMMUNITY_SLUG}/drops/${drop.slug}`} className={`rounded-2xl p-5 flex items-center gap-4 group transition-all duration-300 block ${
                drop.status === 'live'
                  ? 'border border-blue-500/30'
                  : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
              }`} style={drop.status === 'live' ? { background: 'linear-gradient(to right, rgba(23,37,84,0.6), rgba(46,16,101,0.4))', boxShadow: '0 0 30px rgba(59,130,246,0.1)' } : undefined}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  drop.status === 'live'
                    ? ''
                    : drop.status === 'completed'
                    ? 'bg-white/[0.06]'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`} style={drop.status === 'live' ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' } : undefined}>
                  {drop.status === 'live' ? (
                    <Zap className="w-6 h-6 text-white" />
                  ) : drop.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-zinc-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
                    {drop.sponsor_name && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold shrink-0">
                        {drop.sponsor_name}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-zinc-500">{drop.difficulty} · {drop.duration_minutes} min{drop.submissions_count > 0 ? ` · ${drop.submissions_count} builds` : ''}</p>
                </div>
                {(drop.prize_amount > 0 || drop.prize_per_entrant > 0) && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-[14px] text-amber-400 font-bold">${drop.prize_amount > 0 ? drop.prize_amount : drop.prize_per_entrant * 5}</span>
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

      {/* ── For Sponsors ─────────────────────────────────────── */}
      <section id="sponsors" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-600/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">For Sponsors</h2>
            <p className="text-zinc-400 mt-4 text-[16px] max-w-lg mx-auto">Put your brand in front of active AI builders. Fund challenges. Get first look at top talent.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { icon: <Trophy className="w-7 h-7" />, title: 'Fund a Challenge', desc: 'Your brand sponsors a weekly AI challenge. Prize pool starts at $500. Your logo on every submission.', bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
              { icon: <Users className="w-7 h-7" />, title: 'Access Talent', desc: 'Browse submissions from builders who ship. Hire the best directly. Skip the resume pile.', bg: 'linear-gradient(135deg, #3b82f6, #22d3ee)' },
              { icon: <Sparkles className="w-7 h-7" />, title: 'Build Your Brand', desc: 'Every sponsored challenge gets your name in front of thousands of AI builders, creators, and founders.', bg: 'linear-gradient(135deg, #8b5cf6, #e879f9)' },
            ].map((item, i) => (
              <div key={i} className="rounded-3xl p-8 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg" style={{ background: item.bg }}>{item.icon}</div>
                <h3 className="font-black text-[18px] text-white mb-3">{item.title}</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="mailto:hello@altailabs.com" className="inline-flex items-center gap-2 h-14 px-8 text-[15px] font-bold rounded-2xl text-white transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(to right, #f59e0b, #f97316)', boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}>
              <Building2 className="w-5 h-5" /> Become a Sponsor <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-zinc-600 text-[13px] mt-4">Starting at $500/week. Custom packages available.</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/[0.06] via-violet-600/[0.03] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-blue-500/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-5 tracking-tight leading-[0.95]">
            <span className="text-white">Stop watching.</span><br />
            <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start building.</span>
          </h2>
          <p className="text-zinc-400 mb-10 text-[17px] max-w-lg mx-auto leading-relaxed">New challenges drop every week. Join free. Build something real. Win cash.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button onClick={handleExplore} className="w-full sm:w-auto h-14 px-8 text-[15px] font-bold rounded-2xl text-white inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
              Start Building <ArrowRight className="w-4 h-4" />
            </button>
            <WaitlistForm cta="Get Notified" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-[13px] text-zinc-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> Free to join</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500/60" /> New challenge every week</span>
          </div>
        </div>
      </section>

      {/* ── Sponsors & Partners ──────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">Sponsors & Partners</h2>
            <p className="text-zinc-400 mt-4 text-[16px]">Our sponsors fund weekly prize pools so builders get paid to learn.</p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-6 max-w-xl mx-auto">
            {/* AITIM HOLDING */}
            <div className="rounded-3xl p-8 bg-gradient-to-br from-amber-950/40 to-orange-950/30 border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-orange-500/[0.02] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20" style={{ boxShadow: '0 0 30px rgba(245,158,11,0.15)' }}>
                    <Building2 className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">AITIM HOLDING</h3>
                    <p className="text-[13px] text-amber-400 font-semibold">Title Sponsor</p>
                  </div>
                </div>
                <p className="text-[15px] text-zinc-300 leading-relaxed mb-5">Sponsoring weekly AI challenges with <span className="text-amber-400 font-bold">$500 prize pools</span>. Building the next generation of AI builders through hands-on competition.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Trophy className="w-4 h-4 text-amber-400" /> $500/week prizes</span>
                  <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Zap className="w-4 h-4 text-blue-400" /> AI Sales Agents</span>
                  <span className="flex items-center gap-2 text-[13px] text-zinc-300 bg-white/[0.06] px-3.5 py-2 rounded-xl"><Rocket className="w-4 h-4 text-violet-400" /> Content AI</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <p className="text-zinc-500 text-[14px] mb-4">Want to sponsor a challenge and reach AI builders?</p>
            <a href="mailto:hello@altailabs.com" className="inline-flex items-center gap-2 text-[14px] font-bold text-white h-11 px-6 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-200">
              <Building2 className="w-4 h-4" /> Become a Sponsor
            </a>
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
                <li><a href="#challenges" className="text-[13px] text-zinc-600 hover:text-white transition-colors">Challenges</a></li>
                <li><a href="#sponsors" className="text-[13px] text-zinc-600 hover:text-white transition-colors">For Sponsors</a></li>
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
