'use client'

import Link from 'next/link'
import { Play, Trophy, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { DIFFICULTY_COLORS, DROP_STATUS_COLORS, calculatePrizePool } from '@/lib/constants'
import type { Community, WeeklyDrop, DropProgress } from '@/types/database'

interface DropsClientProps {
  community: Community
  drops: WeeklyDrop[]
  progress: DropProgress[]
}

export function DropsClient({ community, drops, progress }: DropsClientProps) {
  const base = `/c/${community.slug}`
  const live = drops.filter(d => d.status === 'live')
  const upcoming = drops.filter(d => d.status === 'upcoming')
  const completed = drops.filter(d => d.status === 'completed')

  function DropCard({ drop }: { drop: WeeklyDrop }) {
    const dropProgress = progress.find(p => p.drop_id === drop.id)
    const isLive = drop.status === 'live'
    return (
      <Link href={`${base}/drops/${drop.slug}`} className={`group block rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all duration-200 ${isLive ? 'glow-blue' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-zinc-600 tracking-widest">WEEK {drop.week_number}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DROP_STATUS_COLORS[drop.status]}`}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1" />}{drop.status}
          </Badge>
          {!drop.is_free && <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-blue-500/10 text-blue-400 border-blue-500/20">Featured</Badge>}
        </div>
        <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-white transition-colors">{drop.title}</h3>
        <p className="text-[12px] text-zinc-500 line-clamp-2 mb-4">{drop.description}</p>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {drop.duration_minutes} min</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
          {drop.prize_per_entrant > 0 && (() => {
            const p = calculatePrizePool(drop.submissions_count, drop.prize_per_entrant, drop.min_entrants_for_prize)
            return <span className={`flex items-center gap-1 ${p.isActive ? 'text-amber-400' : 'text-zinc-500'}`}><Trophy className="w-3 h-3" /> {p.isActive ? `$${p.currentPool}` : `$${p.currentPool}/$${p.targetPool}`}</span>
          })()}
          {drop.status !== 'upcoming' && <span className="ml-auto">{drop.submissions_count} builds</span>}
        </div>
        {dropProgress && (
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.06]">
            <span className={`flex items-center gap-1 text-[11px] ${dropProgress.watched ? 'text-blue-400' : 'text-zinc-600'}`}><CheckCircle2 className="w-3 h-3" /> Watched</span>
            <span className={`flex items-center gap-1 text-[11px] ${dropProgress.submitted ? 'text-blue-400' : 'text-zinc-600'}`}><CheckCircle2 className="w-3 h-3" /> Submitted</span>
          </div>
        )}
      </Link>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Weekly Drops</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Watch the lesson. Do the challenge. Ship.</p>
      </div>
      {live.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[12px] font-semibold text-blue-400 mb-3 flex items-center gap-2 uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Live Now</h2>
          <div className="grid md:grid-cols-2 gap-3">{live.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[12px] font-semibold text-blue-400 mb-3 uppercase tracking-wider">Coming Up</h2>
          <div className="grid md:grid-cols-2 gap-3">{upcoming.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h2 className="text-[12px] font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Past Drops</h2>
          <div className="grid md:grid-cols-2 gap-3">{completed.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}
    </AppLayout>
  )
}
