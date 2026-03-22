import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRICING } from '@/lib/constants'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-12 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-4xl mx-auto relative">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-white mb-10 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Simple pricing</h1>
        <p className="text-[14px] text-neutral-500 text-center mb-12">Start free. Upgrade when you&apos;re ready to go pro.</p>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="rounded-2xl p-8 glass">
            <h3 className="font-semibold text-lg mb-1">{PRICING.free.name}</h3>
            <div className="text-4xl font-bold mb-6">$0<span className="text-base font-normal text-neutral-600">/mo</span></div>
            <ul className="space-y-3 mb-8">
              {PRICING.free.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-500">
                  <CheckCircle2 className="w-4 h-4 text-green-400/60 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.04] h-10 text-[13px] rounded-xl" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="rounded-2xl p-8 glass glow-amber relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-amber-500 text-black px-3 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
            <h3 className="font-semibold text-lg mb-1">{PRICING.paid.name}</h3>
            <div className="text-4xl font-bold mb-6">${PRICING.paid.price}<span className="text-base font-normal text-neutral-600">/mo</span></div>
            <ul className="space-y-3 mb-8">
              {PRICING.paid.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-10 text-[13px] rounded-xl" asChild>
              <Link href="/signup">Start Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
