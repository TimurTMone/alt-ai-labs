'use client'

interface TosCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function TosCheckbox({ checked, onChange }: TosCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer py-3 px-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
      />
      <span className="text-sm text-zinc-400">
        I accept the{' '}
        <a href="/terms" className="text-blue-400 underline hover:text-blue-300">Terms of Service</a>
        {' '}and understand that entry fees are held in escrow until the challenge closes.
        Refunds are issued if the challenge is cancelled.
      </span>
    </label>
  )
}
