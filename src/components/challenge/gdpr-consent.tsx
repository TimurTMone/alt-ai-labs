'use client'

import { useState, useEffect } from 'react'

export function GdprConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('gdpr_consent')
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('gdpr_consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('gdpr_consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <p className="text-sm text-zinc-400 flex-1">
          We use essential cookies for authentication and preferences. No tracking or advertising cookies.{' '}
          <a href="/privacy" className="text-blue-400 underline">Privacy Policy</a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-500 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
