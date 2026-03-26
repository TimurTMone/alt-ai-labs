'use client'

import { useState, useEffect } from 'react'
import { Play, Trophy, Send, ArrowRight, X, Sparkles, Zap } from 'lucide-react'

const ONBOARDING_KEY = 'altai_onboarding_complete'

const steps = [
  {
    icon: Sparkles,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    title: 'Welcome to Alt AI Labs',
    subtitle: 'Here\'s how it works — 3 steps, every week.',
    description: 'Each week we drop a new AI project. Watch the lesson, build the challenge, and compete for prizes.',
  },
  {
    icon: Play,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    title: '1. Watch the Drop',
    subtitle: 'A new video lesson every week',
    description: 'Each drop includes a video tutorial showing you exactly how to build a real AI product — from API setup to deployment.',
  },
  {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    title: '2. Build the Challenge',
    subtitle: 'Ship something real',
    description: 'After watching, take on the weekly challenge. Build your own version, add your twist, and push it to GitHub.',
  },
  {
    icon: Trophy,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/20',
    title: '3. Submit & Win',
    subtitle: 'Compete for cash prizes',
    description: 'Submit your build before the deadline. Top builders win cash prizes and climb the leaderboard. Your portfolio grows every week.',
  },
  {
    icon: Send,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    title: 'You\'re all set!',
    subtitle: 'Start with the current drop',
    description: 'Head to this week\'s drop, watch the video, and submit your first build. The community is waiting to see what you ship.',
  },
]

export function OnboardingOverlay() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) {
      // Small delay so the dashboard loads first
      const t = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setExiting(true)
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setTimeout(() => setVisible(false), 300)
  }

  if (!visible) return null

  const current = steps[step]
  const isLast = step === steps.length - 1
  const Icon = current.icon

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Card */}
      <div className={`relative w-full max-w-md transition-all duration-300 ${exiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="rounded-3xl bg-[#111113] border border-white/[0.08] p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-blue-500' : i < step ? 'w-4 bg-blue-500/40' : 'w-4 bg-white/[0.08]'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl ${current.bg} ring-1 ${current.ring} flex items-center justify-center mb-6`}>
            <Icon className={`w-8 h-8 ${current.color}`} />
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">{current.title}</h2>
          <p className="text-[13px] font-medium text-zinc-400 mb-3">{current.subtitle}</p>
          <p className="text-[14px] text-zinc-500 leading-relaxed mb-8">{current.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 h-10 px-6 text-[13px] font-semibold rounded-xl transition-all duration-200 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
            >
              {isLast ? 'Start Building' : 'Next'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
