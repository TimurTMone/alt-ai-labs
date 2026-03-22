import { Eye } from 'lucide-react'

export function PreviewBanner({ feature }: { feature: string }) {
  return (
    <div className="mb-6 rounded-xl px-4 py-3 bg-amber-500/[0.06] border border-amber-500/15 flex items-start gap-3">
      <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-[13px] text-amber-300 font-medium">Preview — {feature} is coming soon</p>
        <p className="text-[12px] text-amber-400/60 mt-0.5">This is a sneak peek at what we&apos;re building. Want it faster? Let us know.</p>
      </div>
    </div>
  )
}
