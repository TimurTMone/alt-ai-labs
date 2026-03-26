'use client'

import { useState } from 'react'

interface AgeConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
}

export function AgeConfirmation({ onConfirm, onCancel }: AgeConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-white">Age Verification</h2>
        <p className="text-sm text-zinc-400">
          Alt AI Labs involves paid challenges with real cash prizes. You must be at least
          <strong className="text-white"> 18 years old</strong> to participate in paid challenges
          and receive payouts.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-zinc-300">
            I confirm that I am at least 18 years old and agree to the{' '}
            <a href="/terms" className="text-blue-400 underline">Terms of Service</a>.
          </span>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
