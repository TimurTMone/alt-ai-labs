'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Trophy, Terminal, CheckCircle2, Loader2, ChevronRight, Zap, Bot, Code2, Cpu, GitBranch, Rocket, Users, Star, ArrowUpRight, Sparkles, Shield, Clock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDropsForCommunity } from '@/lib/mock-data'
import { PRICING } from '@/lib/constants'

function WaitlistForm({ size = 'default', cta = 'Get Early Access', variant = 'default' }: { size?: 'default' | 'large'; cta?: string; variant?: 'default' | 'dark' }) {
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
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )

  const h = size === 'large' ? 'h-13' : 'h-11'
  const inputBg = variant === 'dark' ? 'bg-white/[0.08]' : 'bg-white/[0.06]'
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 max-w-md mx-auto">
        <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required className={`flex-1 ${h} px-4 rounded-xl ${inputBg} border border-white/[0.1] text-white text-[14px] placeholder:text-neutral-600 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all duration-200`} />
        <Button type="submit" disabled={status === 'loading'} className={`${h} px-6 text-[13px] font-semibold rounded-xl shrink-0 bg-white text-black hover:bg-neutral-100 shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_40px_rgba(255,255,255,0.18)] transition-all duration-300`}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{cta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
        </Button>
      </form>
      {status === 'error' && <p className="text-red-400 text-[12px] text-center mt-2">{message}</p>}
    </div>
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 1500
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])
  return <>{count}{suffix}</>
}

export default function HomePage() {
  const drops = getDropsForCommunity('community-001')
  const liveDrop = drops.find(d => d.status === 'live')
  const totalSubmissions = drops.reduce((a, d) => a + d.submissions_count, 0)

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white via-neutral-200 to-neutral-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300">
              <span className="text-xs font-bold text-black">A</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Alt AI Labs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] text-neutral-500">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#drops" className="hover:text-white transition-colors">Drops</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-neutral-400 hover:text-white text-[13px] hidden sm:inline-flex"><Link href="/login">Sign In</Link></Button>
            <Button size="sm" asChild className="bg-white text-black hover:bg-neutral-200 text-[13px] font-semibold h-8 px-4 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.08)]"><Link href="/signup">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-green-500/[0.06] via-emerald-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.02] rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Live badge */}
          {liveDrop && (
            <Link href="/signup" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/[0.06] text-[12px] text-green-400 mb-8 hover:bg-green-500/[0.1] hover:border-green-500/30 transition-all duration-300 group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="font-medium">Week {liveDrop.week_number} is live</span>
              <span className="text-green-500/60">—</span>
              <span className="text-green-400/80">{liveDrop.title}</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.02]">
            <span className="gradient-text">Stop learning AI.</span><br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Start shipping it.</span>
          </h1>

          <p className="text-[17px] md:text-[20px] text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Every week: a new AI project. A video lesson. A build challenge.<br className="hidden md:block" />
            The best builds win <span className="text-amber-400 font-medium">cash prizes</span>.
          </p>

          <WaitlistForm size="large" cta="Join Free" />

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 md:gap-8 mt-8 text-[13px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-600" />
              <span><span className="text-white font-medium"><AnimatedCounter target={127} />+</span> builders</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-neutral-600" />
              <span><span className="text-white font-medium"><AnimatedCounter target={totalSubmissions} />+</span> builds shipped</span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-neutral-600" />
              <span><span className="text-amber-400 font-medium">$<AnimatedCounter target={1500} />+</span> in prizes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-b from-green-500/[0.04] via-transparent to-transparent rounded-3xl blur-2xl" />
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] relative shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
              </div>
              <span className="text-[11px] text-neutral-600 ml-2 font-mono">~/alt-ai-labs</span>
            </div>
            <div className="p-6 bg-[#0a0a0c] font-mono text-[13px] leading-loose space-y-0.5">
              <p><span className="text-green-400">$</span> <span className="text-white/80">cat this-week.md</span></p>
              <p className="text-neutral-600 mt-2"># {liveDrop?.title || 'Week 3: Automate Your Inbox with AI'}</p>
              <p className="text-neutral-500 mt-1">{liveDrop?.description || 'Build an AI system that reads, categorizes, and drafts responses.'}</p>
              <p className="text-neutral-600 mt-3">## Stack</p>
              <p className="text-blue-400/70">Claude API · Next.js · Gmail API · Vercel</p>
              <p className="text-neutral-600 mt-3">## Prize</p>
              <p className="text-amber-400/80">${liveDrop?.prize_amount || 250} to the best build</p>
              <p className="text-neutral-600 mt-3">## Status</p>
              <p className="text-green-400/80">LIVE — 6 days remaining</p>
              <p className="mt-3"><span className="text-green-400">$</span> <span className="text-white/40 animate-pulse">▌</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / trust strip */}
      <section className="py-12 px-6 border-t border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] text-neutral-600 uppercase tracking-[0.2em] mb-6 font-medium">Built with tools from</p>
          <div className="flex items-center justify-center gap-8 md:gap-14 text-neutral-600 flex-wrap">
            {['OpenAI', 'Anthropic', 'Vercel', 'Next.js', 'Supabase', 'Stripe'].map(name => (
              <span key={name} className="text-[14px] font-medium tracking-tight opacity-40 hover:opacity-70 transition-opacity">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-[11px] text-blue-400 font-medium uppercase tracking-widest mb-5">
              <Sparkles className="w-3 h-3" /> Real projects
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Not tutorials.<br />Production-grade AI.</h2>
            <p className="text-neutral-500 mt-4 text-[15px] max-w-lg mx-auto">Each week you build something you&apos;d actually use — or sell. Real APIs, real deployments, real users.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Bot className="w-5 h-5" />, title: 'AI Assistants', desc: 'Custom chatbots with tool use, memory, and real integrations.', color: 'text-green-400', glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]' },
              { icon: <Cpu className="w-5 h-5" />, title: 'Autonomous Agents', desc: 'Agents that qualify leads, triage inboxes, and automate workflows.', color: 'text-violet-400', glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Full-Stack AI Apps', desc: 'Production apps with Next.js, auth, payments, and deployment.', color: 'text-blue-400', glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]' },
              { icon: <GitBranch className="w-5 h-5" />, title: 'AI Automations', desc: 'Systems that connect APIs, process data, and run on autopilot.', color: 'text-amber-400', glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]' },
            ].map((item, i) => (
              <div key={i} className={`group rounded-2xl p-6 glass hover:bg-white/[0.04] transition-all duration-500 ${item.glow}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center ${item.color} shrink-0`}>{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[15px] mb-1">{item.title}</h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-neutral-400 font-medium uppercase tracking-widest mb-5">
              <Zap className="w-3 h-3" /> Every week
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Watch. Build. Ship.</h2>
            <p className="text-neutral-500 mt-4 text-[15px]">Three steps. Repeat weekly. Get dangerously good at AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Play className="w-6 h-6" />, num: '01', title: 'Watch the drop', desc: 'A new video lesson every week. I build something real from scratch — you follow along or riff on it.', color: 'text-blue-400', border: 'hover:border-blue-500/20' },
              { icon: <Terminal className="w-6 h-6" />, num: '02', title: 'Build the challenge', desc: 'The challenge unlocks after you watch. Build your own version. Any stack, any spin. You have 7 days.', color: 'text-green-400', border: 'hover:border-green-500/20' },
              { icon: <Trophy className="w-6 h-6" />, num: '03', title: 'Ship & win', desc: 'Submit your build. Top submissions win cash prizes. Every project goes in your portfolio.', color: 'text-amber-400', border: 'hover:border-amber-500/20' },
            ].map((step, i) => (
              <div key={i} className={`rounded-2xl p-7 glass relative group transition-all duration-500 ${step.border}`}>
                <span className="absolute top-5 right-6 text-[52px] font-bold text-white/[0.03] leading-none select-none">{step.num}</span>
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center ${step.color} mb-5 group-hover:bg-white/[0.06] transition-colors`}>{step.icon}</div>
                <h3 className="font-semibold text-[16px] mb-2.5">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past drops — what's been shipped */}
      <section id="drops" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-[11px] text-amber-400 font-medium uppercase tracking-widest mb-5">
              <Crown className="w-3 h-3" /> Track record
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Real builds. Real prizes.</h2>
            <p className="text-neutral-500 mt-4 text-[15px]">Here&apos;s what&apos;s been dropped so far.</p>
          </div>
          <div className="space-y-3">
            {drops.map((drop, i) => (
              <div key={drop.id} className={`rounded-2xl p-5 glass flex items-center gap-4 group hover:bg-white/[0.04] transition-all duration-300 ${drop.status === 'live' ? 'glow-green' : ''}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${drop.status === 'live' ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/[0.04]'}`}>
                  <span className={`text-[14px] font-bold ${drop.status === 'live' ? 'text-green-400' : 'text-neutral-600'}`}>W{drop.week_number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-[14px] truncate">{drop.title}</h3>
                    {drop.status === 'live' && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold shrink-0">
                        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" /></span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-600">{drop.difficulty} · {drop.duration_minutes} min · {drop.submissions_count} builds submitted</p>
                </div>
                {drop.prize_amount > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-amber-400/60" />
                    <span className="text-[13px] text-amber-400 font-semibold">${drop.prize_amount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors group">
              View all drops <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why builders choose this */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Built different.</h2>
            <p className="text-neutral-500 mt-4 text-[15px] max-w-lg mx-auto">This isn&apos;t a course. It&apos;s a weekly build gym for people who ship.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Clock className="w-5 h-5" />, title: 'Ship weekly', desc: 'No 40-hour courses. One focused project per week. Watch, build, submit.' },
              { icon: <Trophy className="w-5 h-5" />, title: 'Win real money', desc: 'Cash prizes for the best builds. Compete with other builders, not bots.' },
              { icon: <Star className="w-5 h-5" />, title: 'Build a portfolio', desc: 'Every submission is a real project. Stack them up. Show employers or clients.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Production-grade', desc: 'No toy apps. Real APIs, real auth, real deployments you can put in front of users.' },
              { icon: <Users className="w-5 h-5" />, title: 'Builder community', desc: 'Slack-style community. Share builds, get feedback, find collaborators.' },
              { icon: <Zap className="w-5 h-5" />, title: 'Stay current', desc: 'AI moves fast. New tools and techniques every week so you never fall behind.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 glass hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-500 mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[14px] mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Who this is for</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Developers', desc: 'You can code. You want real AI experience — not another 10-hour theory course. You want to ship.', icon: <Code2 className="w-6 h-6" />, tag: 'Most popular', color: 'text-green-400' },
              { title: 'Founders', desc: 'You need to prototype AI features fast. You want to understand the tech deeply enough to lead.', icon: <Rocket className="w-6 h-6" />, tag: 'Fast track', color: 'text-blue-400' },
              { title: 'Career Switchers', desc: 'You\'ve used ChatGPT. Now you want to build with AI — and have the portfolio to prove it.', icon: <Bot className="w-6 h-6" />, tag: 'Start here', color: 'text-violet-400' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-7 glass group hover:bg-white/[0.04] transition-all duration-300 relative">
                <div className="absolute top-5 right-5">
                  <span className={`text-[10px] font-semibold ${item.color} bg-white/[0.04] px-2.5 py-1 rounded-full`}>{item.tag}</span>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center ${item.color} mb-5`}>{item.icon}</div>
                <h3 className="font-semibold text-[17px] mb-2">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.01] to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-neutral-400 font-medium uppercase tracking-widest mb-5">
              Simple pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight gradient-text leading-tight">Start free. Upgrade when<br className="hidden md:block" /> you&apos;re ready to compete.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl p-8 glass">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[16px]">{PRICING.free.name}</h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">For getting started</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$0</div>
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
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/[0.06] text-[13px] font-semibold h-11 rounded-xl" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 relative glass-strong glow-amber">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="text-[11px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-black px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Zap className="w-3 h-3" /> Most Popular
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[16px]">{PRICING.paid.name}</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">For serious builders</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${PRICING.paid.price}<span className="text-sm font-normal text-neutral-500">/mo</span></div>
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
              <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black text-[13px] font-bold h-11 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]" asChild>
                <Link href="/signup">Join Pro Waitlist <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-10 glass-strong relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-blue-500/[0.04] group-hover:from-violet-500/[0.06] group-hover:to-blue-500/[0.06] transition-all duration-500" />
            <div className="relative text-center">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight gradient-text">Run your own builder community</h3>
              <p className="text-[14px] text-neutral-500 mb-7 max-w-md mx-auto leading-relaxed">We&apos;re opening the platform to select creators. Teach AI, vibe coding, no-code — whatever you&apos;re best at. Drop your email.</p>
              <WaitlistForm cta="Request Creator Access" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/[0.03] via-green-500/[0.01] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/[0.03] rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-[1.05]">
            <span className="gradient-text">Stop watching tutorials.</span><br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Start shipping AI.</span>
          </h2>
          <p className="text-neutral-500 mb-10 text-[16px] max-w-lg mx-auto">Join a community of builders who ship a new AI project every week. Free to start.</p>
          <WaitlistForm size="large" cta="Join Free — It's $0" />
          <div className="flex items-center justify-center gap-4 mt-6 text-[12px] text-neutral-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> New drops weekly</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-black">A</span>
                </div>
                <span className="font-semibold text-[14px] tracking-tight">Alt AI Labs</span>
              </Link>
              <p className="text-[13px] text-neutral-600 max-w-xs leading-relaxed">Learn AI by building real products. New drop every week. Ship or get shipped.</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-[13px] text-neutral-600 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#drops" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Weekly Drops</a></li>
                <li><a href="#pricing" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-[13px] text-neutral-600 hover:text-white transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>
          <div className="h-px bg-white/[0.06] mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-neutral-600">
            <span>&copy; {new Date().getFullYear()} Alt AI Labs. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
