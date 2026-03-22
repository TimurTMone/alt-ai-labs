'use client'

import Link from 'next/link'
import { Play, Trophy, Clock, CheckCircle2, Lock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { useCommunityRequired } from "@/lib/community-context"
import { getDropsForCommunity, mockProgress } from '@/lib/mock-data'
import { DIFFICULTY_COLORS, DROP_STATUS_COLORS } from '@/lib/constants'

export default function DropsPage() {
  const community = useCommunityRequired()
  const base = `/c/${community.slug}`
  const drops = getDropsForCommunity(community.id)
  const live = drops.filter(d => d.status === 'live')
  const upcoming = drops.filter(d => d.status === 'upcoming')
  const completed = drops.filter(d => d.status === 'completed')

  function DropCard({ drop }: { drop: typeof drops[0] }) {
    const progress = mockProgress.find(p => p.drop_id === drop.id)
    const isLive = drop.status === 'live'
    return (
      <Link href={`${base}/drops/${drop.slug}`} className={`group block rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all duration-200 ${isLive ? 'glow-green' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-neutral-600 tracking-widest">WEEK {drop.week_number}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DROP_STATUS_COLORS[drop.status]}`}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />}{drop.status}
          </Badge>
          {!drop.is_free && <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-amber-500/10 text-amber-400 border-amber-500/20"><Lock className="w-2.5 h-2.5 mr-0.5" /> Pro</Badge>}
        </div>
        <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-white transition-colors">{drop.title}</h3>
        <p className="text-[12px] text-neutral-500 line-clamp-2 mb-4">{drop.description}</p>
        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {drop.duration_minutes} min</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
          {drop.prize_amount > 0 && <span className="flex items-center gap-1 text-amber-400"><Trophy className="w-3 h-3" /> ${drop.prize_amount}</span>}
          {drop.status !== 'upcoming' && <span className="ml-auto">{drop.submissions_count} builds</span>}
        </div>
        {progress && (
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.06]">
            <span className={`flex items-center gap-1 text-[11px] ${progress.watched ? 'text-emerald-400' : 'text-neutral-600'}`}><CheckCircle2 className="w-3 h-3" /> Watched</span>
            <span className={`flex items-center gap-1 text-[11px] ${progress.submitted ? 'text-emerald-400' : 'text-neutral-600'}`}><CheckCircle2 className="w-3 h-3" /> Submitted</span>
          </div>
        )}
      </Link>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Weekly Drops</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Watch the lesson. Do the challenge. Ship.</p>
      </div>
      {live.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[12px] font-semibold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Now</h2>
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
          <h2 className="text-[12px] font-semibold text-neutral-500 mb-3 uppercase tracking-wider">Past Drops</h2>
          <div className="grid md:grid-cols-2 gap-3">{completed.map(d => <DropCard key={d.id} drop={d} />)}</div>
        </div>
      )}
    </AppLayout>
  )
}
