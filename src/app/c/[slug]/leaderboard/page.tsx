'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Trophy, Crown, Medal } from 'lucide-react'
import { useCommunityRequired } from "@/lib/community-context"
import { getLeaderboardForCommunity } from '@/lib/mock-data'

const RANK_ICONS = [Crown, Trophy, Medal]
const RANK_COLORS = ['text-amber-400', 'text-neutral-300', 'text-amber-600']

export default function LeaderboardPage() {
  const community = useCommunityRequired()
  const leaderboard = getLeaderboardForCommunity(community.id)

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Top builders ranked by total points earned.</p>
      </div>
      <div className="max-w-2xl">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {leaderboard.slice(0, 3).map(entry => {
            const RankIcon = RANK_ICONS[entry.rank - 1]
            return (
              <div key={entry.id} className={`rounded-2xl p-5 text-center glass ${entry.rank === 1 ? 'glow-amber' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-3"><RankIcon className={`w-5 h-5 ${RANK_COLORS[entry.rank - 1]}`} /></div>
                <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-2"><span className="text-[14px] font-medium text-neutral-300">{entry.profile.full_name[0]}</span></div>
                <p className="text-[13px] font-semibold truncate">{entry.profile.full_name}</p>
                <p className="text-[12px] text-neutral-500 mt-0.5">{entry.points} pts</p>
              </div>
            )
          })}
        </div>
        <div className="rounded-2xl overflow-hidden glass">
          <div className="grid grid-cols-[3rem_1fr_5rem] gap-3 px-5 py-3 text-[11px] text-neutral-600 uppercase tracking-wider font-medium border-b border-white/[0.06]">
            <span>Rank</span><span>Builder</span><span className="text-right">Points</span>
          </div>
          {leaderboard.map(entry => (
            <div key={entry.id} className="grid grid-cols-[3rem_1fr_5rem] gap-3 px-5 py-3.5 items-center border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <span className={`text-[13px] font-bold ${entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : 'text-neutral-600'}`}>{entry.rank}</span>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0"><span className="text-[10px] font-medium text-neutral-400">{entry.profile.full_name[0]}</span></div>
                <div className="min-w-0"><p className="text-[13px] truncate">{entry.profile.full_name}</p><p className="text-[10px] text-neutral-600">{entry.profile.membership_tier === 'paid' ? 'Pro' : 'Free'}</p></div>
              </div>
              <span className="text-[13px] font-medium text-neutral-400 text-right">{entry.points}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
