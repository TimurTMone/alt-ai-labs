'use client'

import type { Streak, HeatmapDay } from '@/types/database'
import { STREAK_MILESTONES } from '@/lib/constants'

interface StreakCardProps {
  streak: Streak
  heatmap: HeatmapDay[]
}

export function StreakCard({ streak, heatmap }: StreakCardProps) {
  const isActive = streak.current > 0
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak.current)

  return (
    <div className="rounded-2xl p-5 glass relative overflow-hidden">
      {/* Glow effect for active streaks */}
      {isActive && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/8 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="relative">
        {/* Header: flame + count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isActive ? 'bg-orange-500/15' : 'bg-zinc-800'
            }`}>
              <span className={`text-2xl ${isActive ? 'animate-pulse' : 'grayscale opacity-40'}`}>🔥</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight">{streak.current}</span>
                <span className="text-xs text-zinc-500 font-medium">day streak</span>
              </div>
              {streak.longest > streak.current && (
                <p className="text-[10px] text-zinc-600">Best: {streak.longest} days</p>
              )}
            </div>
          </div>

          {/* Next milestone */}
          {nextMilestone && isActive && (
            <div className="text-right">
              <p className="text-[10px] text-zinc-600">{nextMilestone.days - streak.current}d to</p>
              <p className="text-xs text-zinc-400 font-medium">{nextMilestone.emoji} {nextMilestone.label}</p>
            </div>
          )}

          {!isActive && (
            <div className="text-right">
              <p className="text-xs text-zinc-500">Start building today</p>
            </div>
          )}
        </div>

        {/* Heatmap */}
        <ActivityHeatmap heatmap={heatmap} />
      </div>
    </div>
  )
}

function ActivityHeatmap({ heatmap }: { heatmap: HeatmapDay[] }) {
  // Build 12-week grid (84 days)
  const days = 84
  const today = new Date()
  const grid: { date: string; level: number }[] = []

  // Create lookup
  const lookup = new Map<string, number>()
  for (const day of heatmap) {
    lookup.set(day.activity_date.split('T')[0], day.count)
  }

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const count = lookup.get(dateStr) || 0
    const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3
    grid.push({ date: dateStr, level })
  }

  // Arrange into weeks (columns of 7)
  const weeks: typeof grid[] = []
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7))
  }

  const colors = [
    'bg-zinc-800/60',           // 0: no activity
    'bg-emerald-500/30',        // 1: light
    'bg-emerald-500/55',        // 2: medium
    'bg-emerald-400',           // 3: heavy
  ]

  return (
    <div className="flex gap-[3px] overflow-hidden">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day, di) => (
            <div
              key={di}
              className={`w-[10px] h-[10px] rounded-[2px] ${colors[day.level]} transition-colors`}
              title={`${day.date}: ${day.level > 0 ? 'Active' : 'No activity'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
