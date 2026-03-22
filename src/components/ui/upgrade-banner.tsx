import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UpgradeBanner() {
  return (
    <div className="rounded-2xl p-5 glass glow-amber">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[13px] font-semibold text-white mb-1">Upgrade to Pro</h3>
          <p className="text-[12px] text-zinc-500 mb-3">
            Unlock all drops, paid challenges, prizes, and exclusive builder groups.
          </p>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-[12px] h-8 rounded-xl">
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
