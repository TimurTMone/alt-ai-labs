'use client'

import Link from 'next/link'
import { Play, Trophy, CheckCircle2, Clock, Users, Award, Zap, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { DIFFICULTY_COLORS, calculatePrizePool } from '@/lib/constants'
import type { Community, Drop, DropProgress } from '@/types/database'

interface DropsClientProps {
  community: Community
  drops: Drop[]
  progress: DropProgress[]
}

export function DropsClient({ community, drops, progress }: DropsClientProps) {
  const base = `/c/${community.slug}`
  const live = drops.filter(d => d.status === 'live')
  const upcoming = drops.filter(d => d.status === 'upcoming')
  const completed = drops.filter(d => d.status === 'completed')

  function DropCard({ drop }: { drop: Drop }) {
    const dropProgress = progress.find(p => p.drop_id === drop.id)
    const isLive = drop.status === 'live'
    const isVideo = drop.drop_type === 'video' || (!drop.drop_type && !!drop.video_url)
    return (
      <Link href={`${base}/drops/${drop.slug}`} className={`group block rounded-2xl overflow-hidden transition-all duration-200 ${isLive ? 'glow-border-live' : 'glass hover:bg-white/[0.04]'}`}>
        <div className="p-5">
          {/* Top row: week + badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-zinc-600 tracking-wider">{drop.difficulty}</span>
            {isLive ? (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />Live
              </Badge>
            ) : drop.status === 'upcoming' ? (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-500 border-white/[0.08]">Coming Soon</Badge>
            ) : (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-600 border-white/[0.06]">Completed</Badge>
            )}
            <Badge variant="outline" className={`text-xs px-2 py-0.5 rounded-lg ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
            {drop.sponsor_name && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border-amber-500/20 ml-auto">
                <Award className="w-3 h-3 mr-1" />${drop.prize_amount}
              </Badge>
            )}
          </div>

          {/* Title + description */}
          <h3 className="font-semibold text-base mb-1.5 text-zinc-200 group-hover:text-white transition-colors leading-snug">{drop.title}</h3>
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">{drop.description}</p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {drop.creator_name && (
              <span className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-[8px] font-bold text-white">
                  {drop.creator_name.split(' ').map(w => w[0]).join('')}
                </div>
                {drop.creator_name}
              </span>
            )}
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {drop.duration_minutes}m</span>
            {isVideo ? (
              <span className="flex items-center gap-1 text-blue-400"><Play className="w-3 h-3" /> Video</span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-600"><Play className="w-3 h-3" /> No video yet</span>
            )}
            {drop.submissions_count > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {drop.submissions_count}</span>}
            {!drop.sponsor_name && drop.prize_per_entrant > 0 && (() => {
              const p = calculatePrizePool(drop.submissions_count, drop.prize_per_entrant, drop.min_entrants_for_prize)
              return <span className={`flex items-center gap-1 ml-auto ${p.isActive ? 'text-amber-400' : ''}`}><Trophy className="w-3 h-3" /> ${p.isActive ? p.currentPool : `${p.currentPool}/${p.targetPool}`}</span>
            })()}
          </div>
        </div>

        {/* Progress bar if user has progress */}
        {dropProgress && (
          <div className="flex items-center gap-4 px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
            <span className={`flex items-center gap-1.5 text-xs ${dropProgress.watched ? 'text-blue-400' : 'text-zinc-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Watched
            </span>
            <span className={`flex items-center gap-1.5 text-xs ${dropProgress.submitted ? 'text-emerald-400' : 'text-zinc-600'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-700 ml-auto group-hover:text-white transition-colors" />
          </div>
        )}
      </Link>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Challenges</h1>
        <p className="text-sm text-zinc-500 mt-1">Watch the lesson. Build the challenge. Ship and win.</p>
      </div>

      {live.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Live Now — {live.length} active challenge{live.length > 1 ? 's' : ''}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">{live.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Coming Up
          </h2>
          <div className="grid md:grid-cols-2 gap-3">{upcoming.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-zinc-600 mb-3 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Past Challenges
          </h2>
          <div className="grid md:grid-cols-2 gap-3">{completed.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}
    </AppLayout>
  )
}
