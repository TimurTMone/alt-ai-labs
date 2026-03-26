'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  deadline: string | Date
  label?: string
  onExpired?: () => void
}

export function CountdownTimer({ deadline, label = 'Time remaining', onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(deadline)
      setTimeLeft(tl)
      if (tl.total <= 0) {
        clearInterval(timer)
        onExpired?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [deadline, onExpired])

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Deadline passed
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      )}
      <div className="flex gap-2">
        <TimeBlock value={timeLeft.days} unit="d" />
        <TimeBlock value={timeLeft.hours} unit="h" />
        <TimeBlock value={timeLeft.minutes} unit="m" />
        <TimeBlock value={timeLeft.seconds} unit="s" />
      </div>
    </div>
  )
}

function TimeBlock({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-lg font-mono font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-zinc-500">{unit}</span>
    </div>
  )
}

function getTimeLeft(deadline: string | Date) {
  const total = new Date(deadline).getTime() - Date.now()
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}
