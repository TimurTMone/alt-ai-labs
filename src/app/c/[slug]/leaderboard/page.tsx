'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Trophy, Crown, Medal, TrendingUp, Flame, ChevronUp } from 'lucide-react'
import { useCommunityRequired } from "@/lib/community-context"
import { getLeaderboardForCommunity } from '@/lib/mock-data'
import { BUILDER_LEVELS, getBuilderLevel } from '@/lib/constants'

const PODIUM_COLORS = [
  { ring: 'ring-amber-400/30', glow: 'shadow-[0_0_24px_rgba(251,191,36,0.12)]', icon: Crown, iconColor: 'text-amber-400', bg: 'bg-amber-400/5' },
  { ring: 'ring-neutral-300/20', glow: '', icon: Trophy, iconColor: 'text-neutral-300', bg: 'bg-white/[0.02]' },
  { ring: 'ring-amber-600/20', glow: '', icon: Medal, iconColor: 'text-amber-600', bg: 'bg-amber-600/5' },
]

export default function LeaderboardPage() {
  const community = useCommunityRequired()
  const leaderboard = getLeaderboardForCommunity(community.id)

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Top builders ranked by total points. Level up by shipping.</p>
      </div>

      {/* Level legend */}
      <div className="mb-8 max-w-3xl">
        <button
          className="text-[11px] text-neutral-600 uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5 hover:text-neutral-400 transition-colors cursor-default"
        >
          <TrendingUp className="w-3 h-3" /> Level System
        </button>
        <div className="flex flex-wrap gap-2">
          {BUILDER_LEVELS.map(level => (
            <div key={level.level} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium ${level.bg} ${level.color}`}>
              <span>{level.emoji}</span>
              <span>{level.name}</span>
              <span className="text-[9px] opacity-50">{level.minPoints}+</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl">
        {/* Podium - Top 3 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Show in order: 2nd, 1st, 3rd for visual podium */}
          {[1, 0, 2].map(idx => {
            const entry = leaderboard[idx]
            if (!entry) return null
            const style = PODIUM_COLORS[idx]
            const level = getBuilderLevel(entry.points)
            const RankIcon = style.icon
            const podiumOrder = idx === 0 ? 'order-2' : idx === 1 ? 'order-1 md:-mt-4' : 'order-3'

            return (
              <div key={entry.id} className={`rounded-2xl p-5 text-center bg-white/[0.02] border border-white/[0.06] ring-1 ${style.ring} ${style.glow} ${podiumOrder} transition-all duration-300`}>
                <div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center mx-auto mb-3`}>
                  <RankIcon className={`w-5 h-5 ${style.iconColor}`} />
                </div>
                <div className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-2.5">
                  <span className="text-[16px] font-semibold text-neutral-200">{entry.profile.full_name[0]}</span>
                </div>
                <p className="text-[14px] font-semibold truncate mb-1">{entry.profile.full_name}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${level.bg} ${level.color} mb-2`}>
                  <span>{level.emoji}</span> {level.name}
                </div>
                <p className="text-[18px] font-bold text-white">{entry.points}</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">points</p>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
          <div className="grid grid-cols-[2.5rem_1fr_auto_4.5rem] md:grid-cols-[3rem_1fr_auto_5rem] gap-3 px-4 md:px-5 py-3 text-[11px] text-neutral-600 uppercase tracking-wider font-medium border-b border-white/[0.06]">
            <span>#</span>
            <span>Builder</span>
            <span className="hidden sm:block">Level</span>
            <span className="text-right">Points</span>
          </div>
          {leaderboard.map((entry, i) => {
            const level = getBuilderLevel(entry.points)
            const isTop3 = entry.rank <= 3
            return (
              <div key={entry.id} className={`grid grid-cols-[2.5rem_1fr_auto_4.5rem] md:grid-cols-[3rem_1fr_auto_5rem] gap-3 px-4 md:px-5 py-3.5 items-center border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${isTop3 ? 'bg-white/[0.01]' : ''}`}>
                {/* Rank */}
                <span className={`text-[13px] font-bold ${isTop3 ? PODIUM_COLORS[entry.rank - 1].iconColor : 'text-neutral-600'}`}>
                  {entry.rank}
                </span>

                {/* Avatar + Name + Level progress */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 ${isTop3 ? `ring-1 ${PODIUM_COLORS[entry.rank - 1].ring}` : ''}`}>
                    <span className="text-[12px] font-medium text-neutral-300">{entry.profile.full_name[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium truncate">{entry.profile.full_name}</p>
                      {entry.profile.membership_tier === 'paid' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">PRO</span>
                      )}
                    </div>
                    {/* Progress bar to next level */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-[120px]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            level.level >= 6 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                            level.level >= 4 ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${level.progressToNext}%` }}
                        />
                      </div>
                      {level.nextLevel && (
                        <span className="text-[9px] text-neutral-700">{level.nextLevel.minPoints - entry.points} to next</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Level badge */}
                <div className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium shrink-0 ${level.bg} ${level.color}`}>
                  <span className="text-[11px]">{level.emoji}</span> {level.name}
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="text-[14px] font-semibold text-white">{entry.points}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* How to earn points */}
        <div className="mt-8 rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06]">
          <h3 className="text-[13px] font-semibold mb-4 flex items-center gap-2 text-neutral-400">
            <Flame className="w-4 h-4 text-amber-400" /> How to earn points
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { action: 'Watch a drop', pts: 5, icon: '👀' },
              { action: 'Submit a build', pts: 25, icon: '🛠️' },
              { action: 'Win 1st place', pts: 100, icon: '🥇' },
              { action: 'Win 2nd place', pts: 50, icon: '🥈' },
              { action: 'Win 3rd place', pts: 25, icon: '🥉' },
              { action: 'Create a post', pts: 5, icon: '💬' },
              { action: 'Leave a comment', pts: 2, icon: '💭' },
              { action: 'Streak bonus', pts: 10, icon: '🔥' },
            ].map(item => (
              <div key={item.action} className="flex items-center gap-2.5 py-2">
                <span className="text-[16px]">{item.icon}</span>
                <div>
                  <p className="text-[12px] text-neutral-300 font-medium">{item.action}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">+{item.pts} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your level card (mockup for current user) */}
        <div className="mt-4 rounded-2xl p-5 bg-white/[0.02] border border-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-[13px] font-medium text-emerald-300">A</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold">Your Progress</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    🤖 Agent Builder
                  </span>
                  <ChevronUp className="w-3 h-3 text-neutral-600" />
                  <span className="text-[10px] text-neutral-600">115 pts to Full-Stack AI</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[20px] font-bold text-white">185</p>
              <p className="text-[10px] text-neutral-600">total pts</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: '67%' }} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
