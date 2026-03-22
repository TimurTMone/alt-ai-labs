import Link from 'next/link'
import { ArrowRight, Play, Trophy, Medal, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { weeklyDrops } from '@/lib/mock-data'
import { PRICING } from '@/lib/constants'

export default function HomePage() {
  const liveDrop = weeklyDrops.find(d => d.status === 'live')

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center">
              <span className="text-xs font-bold text-black">A</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Alt AI Labs</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-neutral-400 hover:text-white text-[13px]">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="bg-white text-black hover:bg-neutral-200 text-[13px] font-semibold h-8 px-4 rounded-lg">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative">
          {liveDrop && (
            <Link href="/login" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-[12px] text-green-400 mb-8 hover:border-green-500/30 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Week {liveDrop.week_number} is live — {liveDrop.title}
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="gradient-text">Watch. Build.</span><br />
            <span className="gradient-text">Ship. Every week.</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-400 mb-10 max-w-lg mx-auto leading-relaxed">
            I drop a video lesson + build challenge every week. You watch, you build, you submit. Top builders win cash.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild className="bg-white text-black hover:bg-neutral-100 h-11 px-7 text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Link href="/signup">Join Free <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white/10 text-neutral-300 hover:bg-white/[0.04] hover:text-white h-11 px-7 text-sm rounded-xl">
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-white/[0.06]">
            <div className="text-center">
              <div className="text-xl font-bold">127+</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Builders</div>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-xl font-bold">{weeklyDrops.length}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Weekly Drops</div>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-xl font-bold">$1,750+</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">In Prizes</div>
            </div>
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
              { icon: <Play className="w-5 h-5" />, num: '01', title: 'Watch the drop', desc: 'A new video lesson lands every week. Real builds, not theory. Follow along or watch and learn.' },
              { icon: <Trophy className="w-5 h-5" />, num: '02', title: 'Take the challenge', desc: 'After watching, the challenge unlocks. Build your own version. You have until the deadline.' },
              { icon: <Medal className="w-5 h-5" />, num: '03', title: 'Ship & win', desc: 'Submit your build. Best submissions win cash prizes and climb the leaderboard. Build your portfolio.' },
            ].map((step, i) => (
              <div key={i} className="rounded-2xl p-6 glass group hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-600 tracking-widest">{step.num}</span>
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{step.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This week */}
      {liveDrop && (
        <section className="py-24 px-6 border-t border-white/[0.06] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.02] to-transparent" />
          <div className="max-w-2xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-[12px] text-green-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              This week&apos;s drop
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{liveDrop.title}</h2>
            <p className="text-sm text-neutral-400 mb-3 max-w-lg mx-auto">{liveDrop.description}</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-[12px] text-neutral-500">{liveDrop.duration_minutes} min video</span>
              {liveDrop.prize_amount > 0 && (
                <>
                  <span className="text-neutral-700">|</span>
                  <span className="text-[12px] text-amber-400">${liveDrop.prize_amount} prize</span>
                </>
              )}
            </div>
            <Button asChild className="bg-white text-black hover:bg-neutral-100 h-10 px-6 text-sm font-semibold rounded-xl">
              <Link href="/signup">Join to Watch & Compete <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </section>
      )}

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
              <ul className="space-y-3 mb-8">
                {PRICING.free.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-400">
                    <CheckCircle2 className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/[0.04] text-[13px] font-medium h-10 rounded-xl" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <div className="rounded-2xl p-7 relative glass-strong glow-amber">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[11px] font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Popular
                </span>
              </div>
              <h3 className="font-semibold text-[15px] mb-1">{PRICING.paid.name}</h3>
              <div className="text-4xl font-bold mb-6 mt-2">${PRICING.paid.price}<span className="text-sm font-normal text-neutral-500">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {PRICING.paid.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black text-[13px] font-semibold h-10 rounded-xl" asChild>
                <Link href="/signup">Start Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.06] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight gradient-text">Ready to build?</h2>
          <p className="text-neutral-400 mb-8 text-sm">New drop every week. Watch. Build. Ship.</p>
          <Button size="lg" asChild className="bg-white text-black hover:bg-neutral-100 h-11 px-8 text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Link href="/signup">Join Alt AI Labs <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
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
