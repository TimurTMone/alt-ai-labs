'use client'

import Link from 'next/link'
import { ArrowRight, Play, Trophy, TrendingUp, Clock, Sparkles, CheckCircle2, MessageSquare, Medal, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { OnboardingOverlay } from '@/components/onboarding/onboarding-overlay'
import { WelcomeToast } from '@/components/onboarding/welcome-toast'
import { useCommunityRequired } from "@/lib/community-context"
import { getDropsForCommunity, getLeaderboardForCommunity, getPostsForCommunity, mockProfile, mockProgress } from '@/lib/mock-data'
import { DIFFICULTY_COLORS, calculatePrizePool } from '@/lib/constants'
import { getBuilderLevel } from '@/lib/constants'
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
  const level = getBuilderLevel(mockProfile.total_points)

  return (
    <AppLayout>
      <OnboardingOverlay />
      <WelcomeToast />
      <div className="space-y-6">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {mockProfile.full_name.split(' ')[0]}</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Watch the video. Do the challenge. Ship.</p>
        </div>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Points', value: mockProfile.total_points, icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Level', value: level.name, icon: Zap, color: level.color, bg: `${level.bg.split(' ')[0]}` },
            { label: 'Completed', value: `${completedDrops.length}/${drops.length}`, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Rank', value: '#5', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 glass">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <span className="text-xl font-bold block">{s.value}</span>
              <span className="text-[11px] text-zinc-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Level Progress ───────────────────────────────────────── */}
        {level.nextLevel && (
          <div className="rounded-2xl p-4 glass">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-zinc-400">
                <span className={level.color}>{level.emoji} {level.name}</span> → <span className={level.nextLevel.color}>{level.nextLevel.emoji} {level.nextLevel.name}</span>
              </span>
              <span className="text-[11px] text-zinc-600">{level.nextLevel.minPoints - level.points} pts to go</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${level.progressToNext}%` }} />
            </div>
          </div>
        )}

        {/* ── Current Drop (Hero) ──────────────────────────────────── */}
        {currentDrop && (
          <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden glass-strong glow-blue">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Week {currentDrop.week_number} — LIVE
                </span>
                <span className="text-[12px] text-zinc-500 ml-auto flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(currentDrop.challenge_deadline))} left</span>
              </div>
              <h2 className="text-xl font-bold mb-2 tracking-tight">{currentDrop.title}</h2>
              <p className="text-[13px] text-zinc-400 mb-5 max-w-lg">{currentDrop.description}</p>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="outline" className={`text-[11px] px-2 py-0.5 rounded-md ${DIFFICULTY_COLORS[currentDrop.difficulty]}`}>{currentDrop.difficulty}</Badge>
                <span className="flex items-center gap-1 text-[12px] text-zinc-500"><Play className="w-3 h-3" /> {currentDrop.duration_minutes} min</span>
                {currentDrop.prize_per_entrant > 0 && (() => {
                  const p = calculatePrizePool(currentDrop.submissions_count, currentDrop.prize_per_entrant, currentDrop.min_entrants_for_prize)
                  return <span className={`flex items-center gap-1 text-[12px] font-medium ${p.isActive ? 'text-amber-400' : 'text-zinc-500'}`}><Trophy className="w-3 h-3" /> {p.isActive ? `$${p.currentPool} pool` : `$${p.currentPool}/$${p.targetPool}`}</span>
                })()}
              </div>
              <div className="flex items-center gap-3 mb-5 text-[12px]">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${currentProgress?.watched ? 'bg-blue-500/10 text-blue-400' : 'bg-white/[0.04] text-zinc-500'}`}>
                  {currentProgress?.watched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {currentProgress?.watched ? 'Watched' : 'Watch video'}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${currentProgress?.submitted ? 'bg-blue-500/10 text-blue-400' : 'bg-white/[0.04] text-zinc-500'}`}>
                  {currentProgress?.submitted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5" />}
                  {currentProgress?.submitted ? 'Submitted' : 'Do challenge'}
                </span>
              </div>
              <Link href={`${base}/drops/${currentDrop.slug}`} className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white h-10 px-6 text-[13px] font-semibold rounded-xl transition-colors shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                {currentProgress?.watched ? 'View Challenge' : 'Start Drop'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Bottom Grid ──────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Community Feed */}
          <div className="lg:col-span-2 rounded-2xl p-5 glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[14px] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Community
              </h2>
              <Link href={`${base}/community`} className="text-[12px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-1">
              {posts.slice(0, 4).map(post => (
                <div key={post.id} className="rounded-xl p-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-medium text-zinc-400">{post.profile?.full_name?.[0]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{post.title}</p>
                    <p className="text-[11px] text-zinc-600">{post.profile?.full_name} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-white/[0.04] text-zinc-500 border-white/[0.06] shrink-0">{post.category}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-2xl p-5 glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[14px] flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-400" /> Leaderboard
              </h3>
              <Link href={`${base}/leaderboard`} className="text-[12px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-1">
              {leaderboard.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${entry.rank <= 3 ? 'bg-amber-500/10 text-amber-400' : 'bg-white/[0.04] text-zinc-600'}`}>{entry.rank}</span>
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] text-zinc-400">{entry.profile.full_name[0]}</span>
                  </div>
                  <span className="text-[13px] flex-1 truncate">{entry.profile.full_name}</span>
                  <span className="text-[11px] font-medium text-zinc-500">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Past Drops ───────────────────────────────────────────── */}
        {completedDrops.length > 0 && (
          <div className="rounded-2xl p-5 glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[14px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Past Drops
              </h2>
              <Link href={`${base}/drops`} className="text-[12px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {completedDrops.slice(0, 4).map(drop => {
                const progress = mockProgress.find(p => p.drop_id === drop.id)
                return (
                  <Link key={drop.id} href={`${base}/drops/${drop.slug}`} className="rounded-xl p-3.5 hover:bg-white/[0.03] transition-colors flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${progress?.submitted ? 'bg-blue-500/10' : 'bg-white/[0.04]'}`}>
                      {progress?.submitted ? <CheckCircle2 className="w-5 h-5 text-blue-400" /> : <Play className="w-5 h-5 text-zinc-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium truncate group-hover:text-white transition-colors">{drop.title}</p>
                      <p className="text-[11px] text-zinc-600">Week {drop.week_number} · {drop.difficulty}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
