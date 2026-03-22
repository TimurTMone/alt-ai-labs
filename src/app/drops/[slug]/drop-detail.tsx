'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Trophy, CheckCircle2, AlertCircle, Play, Lock, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/layout/app-layout'
import { DIFFICULTY_COLORS, DROP_STATUS_COLORS } from '@/lib/constants'
import { weeklyDrops, mockProgress } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export default function DropDetail({ slug }: { slug: string }) {
  const drop = weeklyDrops.find(d => d.slug === slug)
  if (!drop) notFound()

  const existingProgress = mockProgress.find(p => p.drop_id === drop.id)
  const [watched, setWatched] = useState(existingProgress?.watched ?? false)
  const [submitted, setSubmitted] = useState(existingProgress?.submitted ?? false)
  const [projectUrl, setProjectUrl] = useState('')
  const [notes, setNotes] = useState('')

  const isUpcoming = drop.status === 'upcoming'
  const challengeUnlocked = watched

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <AppLayout>
      <Link href="/drops" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Drops
      </Link>

      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-neutral-600 tracking-widest">WEEK {drop.week_number}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DROP_STATUS_COLORS[drop.status]}`}>
              {drop.status}
            </Badge>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DIFFICULTY_COLORS[drop.difficulty]}`}>
              {drop.difficulty}
            </Badge>
            {!drop.is_free && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-amber-500/10 text-amber-400 border-amber-500/20">
                <Lock className="w-2.5 h-2.5 mr-0.5" /> Pro
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{drop.title}</h1>
          <p className="text-[14px] text-neutral-400 leading-relaxed">{drop.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[12px] text-neutral-500">
              <Clock className="w-3 h-3" /> {drop.duration_minutes} min
            </span>
            {drop.prize_amount > 0 && (
              <span className="flex items-center gap-1.5 text-[12px] text-amber-400">
                <Trophy className="w-3 h-3" /> ${drop.prize_amount} prize
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10 p-4 rounded-2xl glass">
          <div className={`flex items-center gap-2 text-[13px] font-medium ${watched ? 'text-green-400' : 'text-white'}`}>
            {watched ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">1</div>}
            Watch
          </div>
          <div className={`flex-1 h-px ${watched ? 'bg-green-500/30' : 'bg-white/[0.06]'}`} />
          <div className={`flex items-center gap-2 text-[13px] font-medium ${challengeUnlocked ? (submitted ? 'text-green-400' : 'text-white') : 'text-neutral-600'}`}>
            {submitted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">2</div>}
            Build
          </div>
          <div className={`flex-1 h-px ${submitted ? 'bg-green-500/30' : 'bg-white/[0.06]'}`} />
          <div className={`flex items-center gap-2 text-[13px] font-medium ${submitted ? 'text-green-400' : 'text-neutral-600'}`}>
            {submitted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">3</div>}
            Submit
          </div>
        </div>

        {/* STEP 1: VIDEO */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-neutral-400">
            <Play className="w-4 h-4 text-blue-400" /> The Lesson
          </h2>

          {isUpcoming && !drop.video_url ? (
            <div className="aspect-video rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-neutral-600" />
                </div>
                <p className="text-[13px] text-neutral-600">Video drops soon</p>
              </div>
            </div>
          ) : drop.video_url ? (
            <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.06] mb-4">
                <iframe src={drop.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              {!watched ? (
                <Button onClick={() => setWatched(true)} className="bg-white text-black hover:bg-neutral-100 h-9 px-5 text-[13px] font-semibold rounded-xl">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark as Watched
                </Button>
              ) : (
                <p className="text-[12px] text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Video completed
                </p>
              )}
            </>
          ) : null}
        </div>

        {/* STEP 2: CHALLENGE */}
        <div className={`mb-10 transition-opacity duration-300 ${!challengeUnlocked ? 'opacity-30 pointer-events-none' : ''}`}>
          <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-neutral-400">
            <Trophy className="w-4 h-4 text-amber-400" /> The Challenge
            {!challengeUnlocked && <span className="text-[11px] text-neutral-600 normal-case tracking-normal ml-1">(watch the video first)</span>}
          </h2>

          <div className="rounded-2xl p-6 glass mb-4">
            <div className="text-[13px] text-neutral-300 leading-relaxed space-y-2">
              {drop.challenge_brief.split('\n').map((line, i) => {
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-neutral-400">{line.replace('- ', '')}</li>
                if (line.trim() === '') return <br key={i} />
                return <p key={i}>{line}</p>
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="rounded-2xl p-5 glass">
              <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">What to Submit</h3>
              <ul className="space-y-2">
                {drop.challenge_deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400/60 shrink-0 mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-5 glass">
              <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">Rules</h3>
              <ul className="space-y-2">
                {drop.challenge_rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-neutral-400">
                    <AlertCircle className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {drop.status === 'live' && (
            <p className="text-[12px] text-neutral-500">Deadline: {formatDistanceToNow(new Date(drop.challenge_deadline))} left</p>
          )}
        </div>

        {/* STEP 3: SUBMIT */}
        {challengeUnlocked && !submitted && drop.status === 'live' && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-neutral-400">
              <Send className="w-4 h-4 text-green-400" /> Submit Your Build
            </h2>
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 glass space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-[13px] text-neutral-400">Project URL *</Label>
                <Input id="url" placeholder="https://github.com/you/project" value={projectUrl} onChange={e => setProjectUrl(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-neutral-600" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-[13px] text-neutral-400">Notes (optional)</Label>
                <Textarea id="notes" placeholder="What you built, how it works..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-neutral-600" />
              </div>
              <Button type="submit" disabled={!projectUrl} className="w-full bg-white text-black hover:bg-neutral-100 h-10 text-[13px] font-semibold rounded-xl">
                Submit Build
              </Button>
            </form>
          </div>
        )}

        {submitted && (
          <div className="rounded-2xl p-8 text-center glass-strong glow-green">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">Build Submitted!</h3>
            <p className="text-[13px] text-neutral-400">Your submission is in. Good luck!</p>
          </div>
        )}

        {drop.prize_amount > 0 && drop.prize_description && (
          <div className="rounded-2xl p-5 mt-6 glass glow-amber">
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-[13px] text-amber-400">Prize</span>
            </div>
            <p className="text-[13px] text-neutral-300">{drop.prize_description}</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
