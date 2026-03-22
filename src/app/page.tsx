'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Trophy, Terminal, CheckCircle2, Loader2, ChevronRight, Zap, Bot, Code2, Cpu, GitBranch, Medal, Rocket, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDropsForCommunity } from '@/lib/mock-data'
import { PRICING } from '@/lib/constants'

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

  if (status === 'success') return <div className="flex items-center gap-2 justify-center text-green-400 text-[14px] font-medium py-2"><CheckCircle2 className="w-4 h-4" /> {message}</div>

  const h = size === 'large' ? 'h-12' : 'h-11'
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-md mx-auto">
        <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required className={`flex-1 ${h} px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-[14px] placeholder:text-neutral-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all`} />
        <Button type="submit" disabled={status === 'loading'} className={`bg-white text-black hover:bg-neutral-100 ${h} px-6 text-[13px] font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0`}>
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{cta} <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
        </Button>
      </form>
      {status === 'error' && <p className="text-red-400 text-[12px] text-center mt-2">{message}</p>}
    </div>
  )
}

export default function HomePage() {
  const drops = getDropsForCommunity('community-001')
  const liveDrop = drops.find(d => d.status === 'live')
  const totalSubmissions = drops.reduce((a, d) => a + d.submissions_count, 0)

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
            <Button size="sm" asChild className="bg-white text-black hover:bg-neutral-200 text-[13px] font-semibold h-8 px-4 rounded-lg"><Link href="/signup">Join Free</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-green-500/[0.04] via-blue-500/[0.02] to-transparent rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          {liveDrop && (
            <Link href="/signup" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-[12px] text-green-400 mb-8 hover:border-green-500/30 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Week {liveDrop.week_number} is live — {liveDrop.title}
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="gradient-text">Learn AI by</span><br />
            <span className="gradient-text">building real products</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Every week I drop a video lesson + build challenge. You watch, you build, you submit. Top builders win cash prizes.
          </p>
          <WaitlistForm size="large" cta="Join the Waitlist" />
          <p className="text-[12px] text-neutral-600 mt-3">Free to join · {totalSubmissions}+ builds shipped · No credit card required</p>
        </div>
      </section>

      {/* Terminal preview */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/[0.08]">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" /><div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" /><div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" /></div>
              <span className="text-[11px] text-neutral-600 ml-2 font-mono">this-week</span>
            </div>
            <div className="p-5 bg-[#0a0a0c] font-mono text-[13px] leading-relaxed space-y-1">
              <p className="text-neutral-600"># {liveDrop?.title || 'Week 3: Automate Your Inbox with AI'}</p>
              <p className="text-neutral-500 mt-2">{liveDrop?.description || 'Build an AI system that reads, categorizes, and drafts responses.'}</p>
              <p className="text-neutral-600 mt-3">## Stack</p>
              <p className="text-neutral-500">Claude API · Next.js · Gmail API · Vercel</p>
              <p className="text-neutral-600 mt-3">## Prize</p>
              <p className="text-amber-400/70">${liveDrop?.prize_amount || 250} to the best build</p>
              <p className="text-neutral-600 mt-3">## How it works</p>
              <p className="text-green-400/70">1. Watch the video → 2. Build it → 3. Submit → 4. Win</p>
              <p className="mt-3"><span className="text-green-400">$</span> <span className="text-white/60 animate-pulse">_</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold text-blue-400 uppercase tracking-widest mb-3">Real projects, not tutorials</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">What you&apos;ll build</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: <Bot className="w-5 h-5" />, title: 'AI Assistants', desc: 'Custom chatbots with tool use, memory, and real integrations.' },
              { icon: <Cpu className="w-5 h-5" />, title: 'AI Agents', desc: 'Autonomous agents that qualify leads, triage inboxes, and automate workflows.' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Full-Stack AI Apps', desc: 'Production-ready apps with Next.js, APIs, auth, and deployment.' },
              { icon: <GitBranch className="w-5 h-5" />, title: 'AI Automations', desc: 'Systems that connect APIs, process data, and run on autopilot.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-5 glass group hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors">{item.icon}</div>
                  <div><h3 className="font-semibold text-[14px]">{item.title}</h3><p className="text-[12px] text-neutral-500 mt-0.5">{item.desc}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Three steps. Every week.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Play className="w-5 h-5" />, num: '01', title: 'Watch the drop', desc: 'A new video lesson lands every week. I build something real on screen — you follow along or just watch.' },
              { icon: <Terminal className="w-5 h-5" />, num: '02', title: 'Build the challenge', desc: 'After watching, a challenge unlocks. Build your own version using any stack. You have 7 days.' },
              { icon: <Trophy className="w-5 h-5" />, num: '03', title: 'Ship & compete', desc: 'Submit your build. Best submissions win cash prizes. Every build goes on your portfolio.' },
            ].map((step, i) => (
              <div key={i} className="rounded-2xl p-6 glass relative">
                <span className="absolute top-5 right-5 text-[40px] font-bold text-white/[0.03] leading-none">{step.num}</span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-400 mb-4">{step.icon}</div>
                <h3 className="font-semibold text-[15px] mb-2">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past drops */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Previous drops</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Real builds. Real builders.</h2>
          </div>
          <div className="space-y-3">
            {drops.slice(0, 4).map(drop => (
              <div key={drop.id} className="rounded-2xl p-5 glass flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0"><span className="text-[13px] font-bold text-neutral-500">W{drop.week_number}</span></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[14px] truncate">{drop.title}</h3>
                  <p className="text-[12px] text-neutral-600 mt-0.5">{drop.difficulty} · {drop.duration_minutes} min · {drop.submissions_count} builds</p>
                </div>
                <div className="text-right shrink-0">
                  {drop.prize_amount > 0 ? <span className="text-[12px] text-amber-400 font-medium">${drop.prize_amount}</span> : <span className="text-[12px] text-neutral-600">Free</span>}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${drop.status === 'live' ? 'bg-green-500/10 text-green-400' : drop.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/[0.04] text-neutral-600'}`}>
                  {drop.status === 'live' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-1 align-middle" />}{drop.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Who this is for</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">Built for builders</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Developers', desc: 'You can code but want hands-on experience building AI products — not watching 10-hour courses.', icon: <Code2 className="w-5 h-5" /> },
              { title: 'Founders', desc: 'You want to prototype AI features fast and understand the tech well enough to lead your team.', icon: <Rocket className="w-5 h-5" /> },
              { title: 'AI Curious', desc: "You've used ChatGPT but want to go deeper — build your own tools, agents, and automations.", icon: <Bot className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 glass">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-500 mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[15px] mb-2">{item.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{item.desc}</p>
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
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/[0.04] text-[13px] font-medium h-10 rounded-xl" asChild><Link href="/signup">Join Free</Link></Button>
            </div>
            <div className="rounded-2xl p-7 relative glass-strong glow-amber">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="text-[11px] font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-1 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> Popular</span></div>
              <h3 className="font-semibold text-[15px] mb-1">{PRICING.paid.name}</h3>
              <div className="text-4xl font-bold mb-6 mt-2">${PRICING.paid.price}<span className="text-sm font-normal text-neutral-500">/mo</span></div>
              <ul className="space-y-3 mb-8">{PRICING.paid.features.map(f => <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-300"><CheckCircle2 className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />{f}</li>)}</ul>
              <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black text-[13px] font-semibold h-10 rounded-xl" asChild><Link href="/signup">Join Waitlist for Pro</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="py-16 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-8 glass text-center">
            <Users className="w-8 h-8 text-violet-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Want to run your own builder community?</h3>
            <p className="text-[13px] text-neutral-500 mb-5 max-w-md mx-auto">We&apos;re opening the platform to select creators. Drop your email and we&apos;ll reach out.</p>
            <WaitlistForm cta="Request Access" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-white/[0.06] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/[0.02] to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight gradient-text">Stop watching tutorials.</h2>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight gradient-text">Start building.</h2>
          <p className="text-neutral-500 mb-8 text-[14px]">New drop every week. Join builders who ship.</p>
          <WaitlistForm size="large" cta="Join the Waitlist" />
          <p className="text-[12px] text-neutral-600 mt-3">Free to join. Unsubscribe anytime.</p>
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
