import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UpgradeBanner() {
  return (
    <div className="rounded-2xl p-5 glass glow-blue">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[13px] font-semibold text-white mb-1">Get Early Access</h3>
          <p className="text-[12px] text-zinc-500 mb-3">
            Join the waitlist to unlock all drops, prizes, templates, and builder groups when we launch.
          </p>
          <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold text-[12px] h-8 rounded-xl">
            <Link href="/signup">Join Waitlist</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
