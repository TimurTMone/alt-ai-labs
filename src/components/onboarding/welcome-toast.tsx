'use client'

import { useState, useEffect } from 'react'
import { X, Rocket } from 'lucide-react'

const WELCOME_TOAST_KEY = 'altai_welcome_toast_shown'

export function WelcomeToast() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const shown = localStorage.getItem(WELCOME_TOAST_KEY)
    if (!shown) {
      // Show after onboarding closes or after 8 seconds
      const t = setTimeout(() => {
        setVisible(true)
        localStorage.setItem(WELCOME_TOAST_KEY, 'true')
      }, 8000)
      return () => clearTimeout(t)
    }
  }, [])

  const handleClose = () => {
    setExiting(true)
    setTimeout(() => setVisible(false), 300)
  }

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (visible && !exiting) {
      const t = setTimeout(handleClose, 6000)
      return () => clearTimeout(t)
    }
  }, [visible, exiting])

  if (!visible) return null

  return (
    <div className={`fixed bottom-6 right-6 z-[90] transition-all duration-300 ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="flex items-start gap-3 rounded-2xl bg-[#111113] border border-white/[0.08] p-4 shadow-2xl max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center shrink-0">
          <Rocket className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white">You&apos;re in!</p>
          <p className="text-[12px] text-zinc-500 mt-0.5">Start with this week&apos;s drop — watch the video and ship your first build.</p>
        </div>
        <button
          onClick={handleClose}
          className="w-6 h-6 rounded-full hover:bg-white/[0.06] flex items-center justify-center shrink-0"
        >
          <X className="w-3.5 h-3.5 text-zinc-600" />
        </button>
      </div>
    </div>
  )
}
