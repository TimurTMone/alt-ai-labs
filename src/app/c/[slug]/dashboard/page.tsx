'use client'

import Link from 'next/link'
import { ArrowRight, Play, Trophy, TrendingUp, Clock, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { useCommunityRequired } from "@/lib/community-context"
import { getDropsForCommunity, getLeaderboardForCommunity, getPostsForCommunity, mockProfile, mockProgress } from '@/lib/mock-data'
import { DIFFICULTY_COLORS } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPage() {
  const community = useCommunityRequired()
  const base = `/c/${community.slug}`
  const drops = getDropsForCommunity(community.id)
  const leaderboard = getLeaderboardForCommunity(community.id)
  const posts = getPostsForCommunity(community.id)
  const currentDrop = drops.find(d => d.status === 'live')
  const completedDrops = drops.filter(d => d.status === 'completed')
  const currentProgress = currentDrop ? mockProgress.find(p => p.drop_id === currentDrop.id) : null

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {mockProfile.full_name.split(' ')[0]}</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Watch the video. Do the challenge. Ship.</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Points', value: mockProfile.total_points, icon: Sparkles, color: 'text-amber-400' },
            { label: 'Completed', value: `${completedDrops.length}/${drops.length}`, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Rank', value: '#5', icon: TrendingUp, color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 glass">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">{s.label}</span>
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        {currentDrop && (
          <div className="rounded-2xl p-6 relative overflow-hidden glass-strong glow-green">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Week {currentDrop.week_number} — LIVE
                </span>
                <span className="text-[12px] text-neutral-500 ml-auto">{formatDistanceToNow(new Date(currentDrop.challenge_deadline))} left</span>
              </div>
              <h2 className="text-xl font-bold mb-1.5 tracking-tight">{currentDrop.title}</h2>
              <p className="text-[13px] text-neutral-400 mb-5 max-w-lg">{currentDrop.description}</p>
              <div className="flex items-center gap-3 mb-5">
                <Badge variant="outline" className={`text-[11px] px-2 py-0.5 rounded-md ${DIFFICULTY_COLORS[currentDrop.difficulty]}`}>{currentDrop.difficulty}</Badge>
                <span className="flex items-center gap-1 text-[12px] text-neutral-500"><Clock className="w-3 h-3" /> {currentDrop.duration_minutes} min</span>
                {currentDrop.prize_amount > 0 && <span className="flex items-center gap-1 text-[12px] text-amber-400"><Trophy className="w-3 h-3" /> ${currentDrop.prize_amount}</span>}
              </div>
              <div className="flex items-center gap-3 mb-5 text-[12px]">
                <span className={`flex items-center gap-1.5 ${currentProgress?.watched ? 'text-green-400' : 'text-neutral-500'}`}>
                  {currentProgress?.watched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {currentProgress?.watched ? 'Watched' : 'Watch video'}
                </span>
                <div className="w-6 h-px bg-neutral-700" />
                <span className={`flex items-center gap-1.5 ${currentProgress?.submitted ? 'text-green-400' : 'text-neutral-500'}`}>
                  {currentProgress?.submitted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                  {currentProgress?.submitted ? 'Submitted' : 'Do challenge'}
                </span>
              </div>
              <Button size="sm" asChild className="bg-white text-black hover:bg-neutral-100 h-9 px-5 text-[13px] font-semibold rounded-xl">
                <Link href={`${base}/drops/${currentDrop.slug}`}>
                  {currentProgress?.watched ? 'View Challenge' : 'Watch Video'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[15px]">Community</h2>
                <Link href={`${base}/community`} className="text-[12px] text-neutral-500 hover:text-white transition-colors">View all</Link>
              </div>
              <div className="space-y-2">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="rounded-xl p-3.5 glass hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-medium text-neutral-400">{post.profile?.full_name?.[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{post.title}</p>
                      <p className="text-[11px] text-neutral-600">{post.profile?.full_name} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl p-5 glass">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[14px]">Leaderboard</h3>
                <Link href={`${base}/leaderboard`} className="text-[11px] text-neutral-500 hover:text-white transition-colors">View all</Link>
              </div>
              <div className="space-y-2.5">
                {leaderboard.slice(0, 5).map(entry => (
                  <div key={entry.id} className="flex items-center gap-3">
                    <span className={`w-5 text-[12px] font-bold text-center ${entry.rank <= 3 ? 'text-amber-400' : 'text-neutral-600'}`}>{entry.rank}</span>
                    <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <span className="text-[10px] text-neutral-400">{entry.profile.full_name[0]}</span>
                    </div>
                    <span className="text-[13px] flex-1 truncate">{entry.profile.full_name}</span>
                    <span className="text-[11px] font-medium text-neutral-500">{entry.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
