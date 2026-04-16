'use client'

import { useState, useEffect } from 'react'
import { Bot, Sparkles, CheckCircle2, ArrowUp, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface AIReview {
  score: number
  strengths: string[]
  improvements: string[]
  summary: string
}

interface AIFeedbackCardProps {
  submissionId: string
}

export function AIFeedbackCard({ submissionId }: AIFeedbackCardProps) {
  const [review, setReview] = useState<AIReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchReview() {
      try {
        const res = await fetch(`${API_URL}/api/submissions/${submissionId}/ai-review`)
        if (res.ok) {
          const data = await res.json()
          if (data.review && !cancelled) {
            setReview(data.review)
            setLoading(false)
            return true
          }
        }
      } catch { /* ignore */ }
      return false
    }

    // Poll every 5 seconds for up to 60 seconds
    async function poll() {
      const found = await fetchReview()
      if (found || cancelled) return

      if (pollCount < 12) {
        setTimeout(() => {
          if (!cancelled) setPollCount(p => p + 1)
        }, 5000)
      } else {
        if (!cancelled) setLoading(false)
      }
    }

    poll()
    return () => { cancelled = true }
  }, [submissionId, pollCount])

  if (loading) {
    return (
      <div className="rounded-2xl p-5 glass mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-medium">AI reviewing your build...</p>
            <p className="text-[11px] text-zinc-600">Usually takes 15-30 seconds</p>
          </div>
        </div>
      </div>
    )
  }

  if (!review) return null

  const scoreColor = review.score >= 80 ? 'text-emerald-400' : review.score >= 60 ? 'text-amber-400' : 'text-orange-400'
  const scoreBg = review.score >= 80 ? 'bg-emerald-500/15' : review.score >= 60 ? 'bg-amber-500/15' : 'bg-orange-500/15'

  return (
    <div className="rounded-2xl overflow-hidden glass mt-4 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-[13px] font-semibold">AI Review</h3>
          <p className="text-[10px] text-zinc-600">Powered by Claude</p>
        </div>
        <div className={`${scoreBg} px-3 py-1.5 rounded-xl`}>
          <span className={`text-lg font-bold ${scoreColor}`}>{review.score}</span>
          <span className="text-[10px] text-zinc-500">/100</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary */}
        <p className="text-[13px] text-zinc-300 leading-relaxed">{review.summary}</p>

        {/* Strengths */}
        {review.strengths?.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Strengths</span>
            </div>
            <ul className="space-y-1.5">
              {review.strengths.map((s, i) => (
                <li key={i} className="text-[12px] text-zinc-400 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {review.improvements?.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Level up</span>
            </div>
            <ul className="space-y-1.5">
              {review.improvements.map((s, i) => (
                <li key={i} className="text-[12px] text-zinc-400 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
