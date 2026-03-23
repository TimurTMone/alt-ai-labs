'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Trophy, CheckCircle2, AlertCircle, Play, Lock, Send, Github, Globe, Video, Paperclip, X, FileText, Zap, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/layout/app-layout'
import { useCommunityRequired } from "@/lib/community-context"
import { DIFFICULTY_COLORS, DROP_STATUS_COLORS, calculatePrizePool } from '@/lib/constants'
import { getDropsForCommunity, mockProgress } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { useParams } from 'next/navigation'

export function DropDetailPage() {
  const community = useCommunityRequired()
  const params = useParams()
  const dropSlug = params.dropSlug as string
  const base = `/c/${community.slug}`
  const drops = getDropsForCommunity(community.id)
  const drop = drops.find(d => d.slug === dropSlug)
  if (!drop) notFound()

  const existingProgress = mockProgress.find(p => p.drop_id === drop.id)
  const [watched, setWatched] = useState(existingProgress?.watched ?? false)
  const [submitted, setSubmitted] = useState(existingProgress?.submitted ?? false)
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [demoVideoUrl, setDemoVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [attachInput, setAttachInput] = useState('')
  const pool = calculatePrizePool(drop.submissions_count, drop.prize_per_entrant, drop.min_entrants_for_prize)
  const isUpcoming = drop.status === 'upcoming'
  const challengeUnlocked = watched

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  return (
    <AppLayout>
      {/* Back nav */}
      <Link href={`${base}/drops`} className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Drops
      </Link>

      <div className="max-w-3xl">
        {/* ── Hero Card ────────────────────────────────────────────── */}
        <div className="rounded-2xl p-6 md:p-8 glass-strong glow-blue relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-bold text-zinc-500 tracking-widest">WEEK {drop.week_number}</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DROP_STATUS_COLORS[drop.status]}`}>
                {drop.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1" />}
                {drop.status}
              </Badge>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
              {!drop.is_free && <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-blue-500/10 text-blue-400 border-blue-500/20">Featured</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">{drop.title}</h1>
            <p className="text-[14px] text-zinc-400 leading-relaxed max-w-xl">{drop.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-[12px] text-zinc-500"><Clock className="w-3.5 h-3.5" /> {drop.duration_minutes} min</span>
              {drop.prize_per_entrant > 0 && (
                <span className={`flex items-center gap-1.5 text-[12px] font-medium ${pool.isActive ? 'text-amber-400' : 'text-zinc-500'}`}>
                  <Trophy className="w-3.5 h-3.5" /> {pool.isActive ? `$${pool.currentPool} pool` : `$${pool.currentPool}/$${pool.targetPool} to unlock`}
                </span>
              )}
              {drop.status === 'live' && <span className="flex items-center gap-1.5 text-[12px] text-blue-400"><Zap className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(drop.challenge_deadline))} left</span>}
              <span className="flex items-center gap-1.5 text-[12px] text-zinc-600">{drop.submissions_count} builds submitted</span>
            </div>
          </div>
        </div>

        {/* ── Progress Steps ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { step: 1, label: 'Watch', done: watched, icon: Play },
            { step: 2, label: 'Build', done: submitted, active: challengeUnlocked, icon: Zap },
            { step: 3, label: 'Submit', done: submitted, active: challengeUnlocked, icon: Send },
          ].map(s => (
            <div key={s.step} className={`rounded-xl p-4 text-center transition-all duration-300 ${s.done ? 'glass-strong glow-blue' : s.active || s.step === 1 ? 'glass' : 'glass opacity-40'}`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${s.done ? 'bg-blue-500/15' : 'bg-white/[0.04]'}`}>
                {s.done ? <CheckCircle2 className="w-5 h-5 text-blue-400" /> : <s.icon className={`w-5 h-5 ${s.active || s.step === 1 ? 'text-zinc-400' : 'text-zinc-600'}`} />}
              </div>
              <span className={`text-[12px] font-semibold ${s.done ? 'text-blue-400' : 'text-zinc-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Video Section ────────────────────────────────────────── */}
        <div className="rounded-2xl p-6 glass mb-6">
          <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-zinc-400">
            <Play className="w-4 h-4 text-blue-400" /> The Lesson
          </h2>
          {isUpcoming && !drop.video_url ? (
            <div className="aspect-video rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3"><Play className="w-6 h-6 text-zinc-600" /></div>
                <p className="text-[13px] text-zinc-600">Video drops soon</p>
              </div>
            </div>
          ) : drop.video_url ? (
            <>
              <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.06] mb-4">
                <iframe src={drop.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              {!watched ? (
                <button onClick={() => setWatched(true)} className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white h-9 px-5 text-[13px] font-semibold rounded-xl transition-colors shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <CheckCircle2 className="w-4 h-4" /> Mark as Watched
                </button>
              ) : (
                <p className="text-[12px] text-blue-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Video completed</p>
              )}
            </>
          ) : null}
        </div>

        {/* ── Challenge Section ────────────────────────────────────── */}
        <div className={`transition-all duration-300 ${!challengeUnlocked ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="rounded-2xl p-6 glass mb-6">
            <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-zinc-400">
              <Trophy className="w-4 h-4 text-amber-400" /> The Challenge
              {!challengeUnlocked && <span className="text-[11px] text-zinc-600 normal-case tracking-normal ml-1">(watch the video first)</span>}
            </h2>
            <div className="text-[13px] text-zinc-300 leading-relaxed space-y-2 mb-6">
              {drop.challenge_brief.split('\n').map((line, i) => {
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-400">{line.replace('- ', '')}</li>
                if (line.trim() === '') return <br key={i} />
                return <p key={i}>{line}</p>
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" /> What to Submit
                </h3>
                <ul className="space-y-2">{drop.challenge_deliverables.map((d, i) => <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400/60 shrink-0 mt-0.5" /> {d}</li>)}</ul>
              </div>
              <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-zinc-500" /> Rules
                </h3>
                <ul className="space-y-2">{drop.challenge_rules.map((r, i) => <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400"><AlertCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" /> {r}</li>)}</ul>
              </div>
            </div>

            {drop.status === 'live' && (
              <p className="text-[12px] text-zinc-500 mt-4 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Deadline: {formatDistanceToNow(new Date(drop.challenge_deadline))} left</p>
            )}
          </div>

          {/* ── Submit Form ────────────────────────────────────────── */}
          {challengeUnlocked && !submitted && drop.status === 'live' && (
            <div className="rounded-2xl p-6 glass mb-6">
              <h2 className="text-[13px] font-semibold mb-5 flex items-center gap-2 uppercase tracking-wider text-zinc-400">
                <Send className="w-4 h-4 text-blue-400" /> Submit Your Build
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-1.5">
                  <Label htmlFor="github" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" /> GitHub Repository *
                  </Label>
                  <Input id="github" placeholder="https://github.com/you/project" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
                  <p className="text-[11px] text-zinc-600">Public repo with your source code</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="live" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Live URL
                  </Label>
                  <Input id="live" placeholder="https://your-app.vercel.app" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
                  <p className="text-[11px] text-zinc-600">Deployed app on Vercel, Netlify, or any host</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="demo" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" /> Demo Video
                  </Label>
                  <Input id="demo" placeholder="https://youtube.com/watch?v=... or https://loom.com/..." value={demoVideoUrl} onChange={e => setDemoVideoUrl(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
                  <p className="text-[11px] text-zinc-600">YouTube, Loom, or any video link showing your build</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="desc" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> What you built *
                  </Label>
                  <Textarea id="desc" placeholder="Describe your build: what it does, how it works, what stack you used..." value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" /> Attachments
                  </Label>
                  <p className="text-[11px] text-zinc-600 mb-2">Links to PRDs, Figma files, docs, slides, etc.</p>
                  <div className="flex gap-2">
                    <Input placeholder="https://docs.google.com/..." value={attachInput} onChange={e => setAttachInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (attachInput.trim()) { setAttachments([...attachments, attachInput.trim()]); setAttachInput('') } } }} className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
                    <button type="button" onClick={() => { if (attachInput.trim()) { setAttachments([...attachments, attachInput.trim()]); setAttachInput('') } }} className="h-9 px-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-[12px] text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0">Add</button>
                  </div>
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attachments.map((url, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-400 max-w-[280px]">
                          <Paperclip className="w-3 h-3 shrink-0" />
                          <span className="truncate">{url}</span>
                          <button type="button" onClick={() => setAttachments(attachments.filter((_, j) => j !== i))} className="shrink-0 text-zinc-600 hover:text-orange-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/[0.06]" />

                <button type="submit" disabled={!githubUrl || !description} className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white h-11 text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Build
                </button>
                <p className="text-[11px] text-zinc-600 text-center">You can edit your submission until the deadline</p>
              </form>
            </div>
          )}

          {/* ── Success State ──────────────────────────────────────── */}
          {submitted && (
            <div className="rounded-2xl p-8 text-center glass-strong glow-blue mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Build Submitted!</h3>
              <p className="text-[13px] text-zinc-400 mb-5">Your submission is in. Good luck!</p>
              <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[12px] text-zinc-500">
                {githubUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Github className="w-3 h-3" /> Repo linked</span>}
                {liveUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Globe className="w-3 h-3" /> Live demo</span>}
                {demoVideoUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Video className="w-3 h-3" /> Video</span>}
                {attachments.length > 0 && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Paperclip className="w-3 h-3" /> {attachments.length} file{attachments.length > 1 ? 's' : ''}</span>}
              </div>
            </div>
          )}
        </div>

        {/* ── Prize Pool Tracker ─────────────────────────────────── */}
        {drop.prize_per_entrant > 0 && (
          <div className={`rounded-2xl p-5 glass ${pool.isActive ? 'glow-amber' : ''}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pool.isActive ? 'bg-amber-500/10' : 'bg-white/[0.04]'}`}>
                <Award className={`w-5 h-5 ${pool.isActive ? 'text-amber-400' : 'text-zinc-600'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-[14px] ${pool.isActive ? 'text-amber-400' : 'text-white'}`}>
                    {pool.isActive ? `$${pool.currentPool} Prize Pool` : 'Prize Pool'}
                  </span>
                  <span className="text-[12px] text-zinc-500">{pool.entrants}/{pool.minEntrants} builders</span>
                </div>
                <p className="text-[12px] text-zinc-500 mb-3">
                  {pool.isActive
                    ? 'Pool is active! Every new Pro entrant adds more.'
                    : `${pool.remainingToActivate} more Pro builder${pool.remainingToActivate === 1 ? '' : 's'} needed to activate the pool`}
                </p>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                  <div className={`h-full rounded-full transition-all duration-500 ${pool.isActive ? 'bg-amber-500' : 'bg-zinc-600'}`} style={{ width: `${pool.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-600">
                  <span>${pool.currentPool} raised</span>
                  <span>+${drop.prize_per_entrant} per entrant</span>
                </div>
              </div>
            </div>

            {/* Prize split */}
            {pool.isActive && pool.split && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
                {pool.split.map(s => (
                  <div key={s.place} className="text-center rounded-xl p-3 bg-white/[0.02]">
                    <span className="text-[16px] block mb-1">{s.emoji}</span>
                    <span className="text-[14px] font-bold text-white block">${s.amount}</span>
                    <span className="text-[11px] text-zinc-500">{s.label} · {s.pct}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* How it works — only show when pool is inactive */}
            {!pool.isActive && (
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-[11px] text-zinc-600">
                  Prize pool is funded by Pro subscriptions — the creator never pays out of pocket. Each Pro participant who enters adds ${drop.prize_per_entrant} to the pool. Once {pool.minEntrants} builders join, the pool activates and prizes are split: 60% / 25% / 15%.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
