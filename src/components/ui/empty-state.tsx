import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-neutral-600" />
      </div>
      <h3 className="text-[14px] font-medium text-white mb-1">{title}</h3>
      {description && (
        <p className="text-[12px] text-neutral-600 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}
