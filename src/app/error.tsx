'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-[15px] text-zinc-400 mb-6">An unexpected error occurred. Try refreshing the page.</p>
        <button
          onClick={reset}
          className="h-11 px-6 text-[14px] font-semibold rounded-xl text-white transition-all duration-200"
          style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
