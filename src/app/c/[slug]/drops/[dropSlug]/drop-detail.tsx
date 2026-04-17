'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Trophy, CheckCircle2, AlertCircle, Play, Send, Github, Globe, Video, Paperclip, X, FileText, Zap, Award, Users, ChevronDown, ExternalLink, Heart } from 'lucide-react'
import { ShareButtons } from '@/components/social/share-buttons'
import { AIFeedbackCard } from '@/components/submissions/ai-feedback-card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/layout/app-layout'
import { DIFFICULTY_COLORS, calculatePrizePool } from '@/lib/constants'
import { track } from '@/lib/analytics'
import { formatDistanceToNow } from 'date-fns'
import type { Community, Drop, DropProgress } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface DropDetailClientProps {
  community: Community
  drop: Drop
  initialProgress: DropProgress | null
}

export function DropDetailClient({ community, drop, initialProgress }: DropDetailClientProps) {
  const base = `/c/${community.slug}`

  const [watched, setWatched] = useState(initialProgress?.watched ?? false)
  const [submitted, setSubmitted] = useState(initialProgress?.submitted ?? false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [demoVideoUrl, setDemoVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [attachInput, setAttachInput] = useState('')
  const [briefExpanded, setBriefExpanded] = useState(true)
  const pool = calculatePrizePool(drop.submissions_count, drop.prize_per_entrant, drop.min_entrants_for_prize)
  const isUpcoming = drop.status === 'upcoming'
  const challengeUnlocked = watched

  const handleMarkWatched = async () => {
    setWatched(true)
    track('drop_watched', { drop_id: drop.id, title: drop.title, type: drop.drop_type })
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drop_id: drop.id }),
      })
    } catch {
      // Still mark locally even if API fails (demo mode)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drop_id: drop.id,
          github_url: githubUrl,
          live_url: liveUrl || null,
          demo_video_url: demoVideoUrl || null,
          description,
          attachments,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSubmissionId(data.submission?.id || null)
        setSubmitted(true)
        track('submission_created', { drop_id: drop.id, title: drop.title })
      }
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = drop.status === 'live' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-zinc-500 bg-white/[0.04] border-white/[0.06]'

  return (
    <AppLayout>
      <Link href={`${base}/drops`} className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Challenges
      </Link>

      <div className="max-w-3xl">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="rounded-2xl glass-strong relative overflow-hidden mb-8">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="p-6 md:p-8 relative">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${statusColor}`}>
                {drop.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />}
                {drop.status === 'live' ? 'Live Now' : 'Coming Soon'}
              </Badge>
              <span className="text-xs text-zinc-600">{drop.difficulty}</span>
              <Badge variant="outline" className={`text-xs px-2 py-0.5 rounded-lg ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
              {drop.sponsor_name && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold">
                  <Award className="w-3 h-3 mr-1" /> {drop.sponsor_name}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight leading-snug">{drop.title}</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl mb-5">{drop.description}</p>

            {/* Creator + stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {drop.creator_name && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
                    {drop.creator_name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <span className="text-sm text-white font-medium">{drop.creator_name}</span>
                    {drop.creator_url && (
                      <a href={drop.creator_url} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-zinc-600 hover:text-blue-400 transition-colors inline-flex"><ExternalLink className="w-3 h-3" /></a>
                    )}
                  </div>
                </div>
              )}
              <span className="flex items-center gap-1.5 text-xs text-zinc-500"><Clock className="w-3.5 h-3.5" /> {drop.duration_minutes} min</span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500"><Users className="w-3.5 h-3.5" /> {drop.submissions_count} builds</span>
              {drop.status === 'live' && (
                <span className="flex items-center gap-1.5 text-xs text-blue-400 font-medium"><Zap className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(drop.challenge_deadline))} left</span>
              )}
            </div>

            {/* Prize banner */}
            {(drop.prize_amount > 0 || (drop.prize_per_entrant > 0 && pool.isActive)) && (
              <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm text-amber-300 font-semibold">
                  {drop.prize_amount > 0 ? `$${drop.prize_amount} prize` : `$${pool.currentPool} prize pool`}
                  {drop.prize_description && <span className="text-zinc-500 font-normal"> — {drop.prize_description}</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Progress Steps ────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { step: 1, label: 'Watch', sublabel: 'The lesson', done: watched, icon: Play },
            { step: 2, label: 'Build', sublabel: 'Your version', done: submitted, active: challengeUnlocked, icon: Zap },
            { step: 3, label: 'Submit', sublabel: 'Win prizes', done: submitted, active: challengeUnlocked, icon: Send },
          ].map((s, i) => (
            <div key={s.step} className={`rounded-xl p-4 text-center transition-all duration-300 relative ${s.done ? 'glass-strong' : s.active || s.step === 1 ? 'glass' : 'glass opacity-30'}`}>
              {s.done && <div className="absolute inset-0 rounded-xl glow-blue pointer-events-none" />}
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center relative ${s.done ? 'bg-blue-500/15' : 'bg-white/[0.04]'}`}>
                {s.done ? <CheckCircle2 className="w-5 h-5 text-blue-400" /> : <s.icon className={`w-5 h-5 ${s.active || s.step === 1 ? 'text-zinc-300' : 'text-zinc-600'}`} />}
              </div>
              <span className={`text-sm font-semibold block ${s.done ? 'text-blue-400' : 'text-zinc-400'}`}>{s.label}</span>
              <span className="text-xs text-zinc-600">{s.sublabel}</span>
              {/* Connector line */}
              {i < 2 && <div className="hidden md:block absolute top-1/2 -right-1.5 w-3 h-px bg-white/[0.08]" />}
            </div>
          ))}
        </div>

        {/* ── Video Section ─────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden glass mb-6">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
                {drop.drop_type === 'video' ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <FileText className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              {drop.drop_type === 'video' ? 'Video Lesson' : drop.drop_type === 'github' ? 'Code Walkthrough' : 'Lesson'}
            </h2>
            {watched && <span className="text-xs text-blue-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>}
          </div>
          <div className="p-6">
            {/* ── Video Drop ──────────────────────────────── */}
            {drop.drop_type === 'video' && (
              isUpcoming && !drop.video_url ? (
                <div className="aspect-video rounded-xl bg-white/[0.02] border border-dashed border-white/[0.08] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
                      <Play className="w-7 h-7 text-zinc-600" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500">Coming Soon</p>
                    <p className="text-xs text-zinc-600 mt-1">This lesson hasn&apos;t dropped yet</p>
                  </div>
                </div>
              ) : drop.video_url ? (
                <>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.06]">
                    <iframe src={drop.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  {!watched && (
                    <button onClick={handleMarkWatched} className="mt-4 inline-flex items-center gap-2 btn-primary text-white h-10 px-5 text-sm font-semibold rounded-xl transition-all">
                      <CheckCircle2 className="w-4 h-4" /> I watched this — unlock the challenge
                    </button>
                  )}
                </>
              ) : null
            )}

            {/* ── Text / GitHub Drop ─────────────────────── */}
            {(drop.drop_type === 'text' || drop.drop_type === 'github') && (
              <div className="space-y-4">
                {drop.content_body && (
                  <div className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap">{drop.content_body}</div>
                )}
                {drop.resource_urls && drop.resource_urls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Resources</p>
                    {drop.resource_urls.map((r: { label: string; url: string }, i: number) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass hover:bg-white/[0.06] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          {r.url.includes('github.com') ? <Github className="w-4 h-4 text-blue-400" /> : <ExternalLink className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-zinc-200 truncate">{r.label}</p>
                          <p className="text-[11px] text-zinc-600 truncate">{r.url}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
                {!watched && (
                  <button onClick={handleMarkWatched} className="inline-flex items-center gap-2 btn-primary text-white h-10 px-5 text-sm font-semibold rounded-xl transition-all">
                    <CheckCircle2 className="w-4 h-4" /> I read this — unlock the challenge
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Challenge Section ─────────────────────────────── */}
        <div className={`transition-all duration-300 ${!challengeUnlocked ? 'opacity-30 pointer-events-none select-none' : ''}`}>
          <div className="rounded-2xl overflow-hidden glass mb-6">
            <button onClick={() => setBriefExpanded(!briefExpanded)} className="w-full px-6 py-4 border-b border-white/[0.06] flex items-center justify-between text-left">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center"><Trophy className="w-3.5 h-3.5 text-amber-400" /></div>
                The Challenge
                {!challengeUnlocked && <span className="text-xs text-zinc-600 font-normal ml-1">(watch the video first)</span>}
              </h2>
              <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${briefExpanded ? 'rotate-180' : ''}`} />
            </button>

            {briefExpanded && (
              <div className="p-6">
                {/* Challenge brief */}
                <div className="text-sm text-zinc-300 leading-relaxed space-y-2 mb-6">
                  {drop.challenge_brief.split('\n').map((line, i) => {
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-400 list-disc">{line.replace('- ', '')}</li>
                    if (line.trim() === '') return <br key={i} />
                    if (/^\d{2}:\d{2}/.test(line.trim())) return <p key={i} className="text-zinc-500 font-mono text-xs">{line}</p>
                    if (line === line.toUpperCase() && line.length > 3 && !line.startsWith('Your')) return <p key={i} className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-4">{line}</p>
                    return <p key={i}>{line}</p>
                  })}
                </div>

                {/* Deliverables + Rules */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-xl p-4 bg-blue-500/[0.03] border border-blue-500/10">
                    <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Deliverables
                    </h3>
                    <ul className="space-y-2">
                      {drop.challenge_deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400/50 shrink-0 mt-0.5" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" /> Rules
                    </h3>
                    <ul className="space-y-2">
                      {drop.challenge_rules.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                          <AlertCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {drop.status === 'live' && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5" /> Deadline: {formatDistanceToNow(new Date(drop.challenge_deadline))} left
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Submit Form ─────────────────────────────────── */}
          {challengeUnlocked && !submitted && drop.status === 'live' && (
            <div className="rounded-2xl overflow-hidden glass mb-6">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center"><Send className="w-3.5 h-3.5 text-blue-400" /></div>
                  Submit Your Build
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="github" className="text-sm text-zinc-400 flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub Repository *</Label>
                    <Input id="github" placeholder="https://github.com/you/project" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} required className="h-11 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-sm placeholder:text-zinc-600" style={{ fontSize: '16px' }} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="live" className="text-sm text-zinc-400 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Live URL</Label>
                      <Input id="live" placeholder="https://your-app.vercel.app" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="h-11 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-sm placeholder:text-zinc-600" style={{ fontSize: '16px' }} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="demo" className="text-sm text-zinc-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Demo Video</Label>
                      <Input id="demo" placeholder="YouTube or Loom link" value={demoVideoUrl} onChange={e => setDemoVideoUrl(e.target.value)} className="h-11 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-sm placeholder:text-zinc-600" style={{ fontSize: '16px' }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="desc" className="text-sm text-zinc-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> What you built *</Label>
                    <Textarea id="desc" placeholder="Describe your build: what it does, how it works, what stack you used..." value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-sm placeholder:text-zinc-600" style={{ fontSize: '16px' }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-zinc-400 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> Attachments</Label>
                    <p className="text-xs text-zinc-600 mb-2">Links to docs, Figma, slides, etc.</p>
                    <div className="flex gap-2">
                      <Input placeholder="https://docs.google.com/..." value={attachInput} onChange={e => setAttachInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (attachInput.trim()) { setAttachments([...attachments, attachInput.trim()]); setAttachInput('') } } }} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-sm placeholder:text-zinc-600" />
                      <button type="button" onClick={() => { if (attachInput.trim()) { setAttachments([...attachments, attachInput.trim()]); setAttachInput('') } }} className="h-10 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0">Add</button>
                    </div>
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {attachments.map((url, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 max-w-[280px]">
                            <Paperclip className="w-3 h-3 shrink-0" />
                            <span className="truncate">{url}</span>
                            <button type="button" onClick={() => setAttachments(attachments.filter((_, j) => j !== i))} className="shrink-0 text-zinc-600 hover:text-orange-500 transition-colors"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={!githubUrl || !description || submitting} className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed text-white h-12 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Build'}
                    </button>
                    <p className="text-xs text-zinc-600 text-center mt-2">You can edit your submission until the deadline</p>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Success State ──────────────────────────────── */}
          {submitted && (
            <div className="rounded-2xl p-8 text-center glass-strong relative overflow-hidden mb-6">
              <div className="absolute inset-0 glow-blue pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-1">Build Submitted!</h3>
                <p className="text-sm text-zinc-400 mb-5">Your submission is in. Good luck!</p>
                <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
                  {githubUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Github className="w-3 h-3" /> Repo linked</span>}
                  {liveUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Globe className="w-3 h-3" /> Live demo</span>}
                  {demoVideoUrl && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Video className="w-3 h-3" /> Video</span>}
                  {attachments.length > 0 && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"><Paperclip className="w-3 h-3" /> {attachments.length} file{attachments.length > 1 ? 's' : ''}</span>}
                </div>
                <ShareButtons title={drop.title} />
              </div>
            </div>
          )}

          {/* ── AI Feedback ────────────────────────────────── */}
          {submitted && submissionId && (
            <AIFeedbackCard submissionId={submissionId} />
          )}
        </div>

        {/* ── Prize Pool Tracker ────────────────────────────── */}
        {drop.prize_per_entrant > 0 && (
          <div className={`rounded-2xl overflow-hidden glass ${pool.isActive ? 'glow-amber' : ''}`}>
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${pool.isActive ? 'bg-amber-500/15' : 'bg-white/[0.04]'}`}>
                <Award className={`w-3.5 h-3.5 ${pool.isActive ? 'text-amber-400' : 'text-zinc-600'}`} />
              </div>
              <h2 className="text-sm font-semibold text-zinc-300">Prize Pool</h2>
              <span className="ml-auto text-xs text-zinc-500">{pool.entrants}/{pool.minEntrants} builders</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-lg ${pool.isActive ? 'text-amber-400' : 'text-white'}`}>
                  ${pool.currentPool}
                </span>
                <span className="text-xs text-zinc-600">+${drop.prize_per_entrant} per entrant</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-500 ${pool.isActive ? 'bg-amber-500' : 'bg-zinc-600'}`} style={{ width: `${pool.progress}%` }} />
              </div>
              <p className="text-xs text-zinc-500">
                {pool.isActive
                  ? 'Pool is active! Every new Pro entrant adds more.'
                  : `${pool.remainingToActivate} more Pro builder${pool.remainingToActivate === 1 ? '' : 's'} needed to activate`}
              </p>

              {pool.isActive && pool.split && (
                <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/[0.06]">
                  {pool.split.map(s => (
                    <div key={s.place} className="text-center rounded-xl p-3 bg-white/[0.02]">
                      <span className="text-base block mb-1">{s.emoji}</span>
                      <span className="text-sm font-bold text-white block">${s.amount}</span>
                      <span className="text-xs text-zinc-500">{s.label} · {s.pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* ── Community Builds ──────────────────────────── */}
        <CommunityBuilds dropId={drop.id} />
      </div>
    </AppLayout>
  )
}

// ── Community Builds Section ─────────────────────────────────

function CommunityBuilds({ dropId }: { dropId: string }) {
  const [submissions, setSubmissions] = useState<{ id: string; project_url: string; demo_url: string | null; notes: string | null; status: string; full_name: string; avatar_url: string | null; username: string | null; vote_count: number; created_at: string }[]>([])
  const [loaded, setLoaded] = useState(false)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  const loadSubmissions = async () => {
    if (loaded) return
    try {
      const res = await fetch(`${API_URL}/api/submissions/by-drop/${dropId}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions || [])
      }
    } catch { /* ignore */ }
    setLoaded(true)
  }

  const handleVote = async (subId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    const isVoted = votedIds.has(subId)
    try {
      await fetch(`${API_URL}/api/submissions/${subId}/vote`, {
        method: isVoted ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setVotedIds(prev => {
        const next = new Set(prev)
        if (isVoted) next.delete(subId); else next.add(subId)
        return next
      })
      setSubmissions(prev => prev.map(s =>
        s.id === subId ? { ...s, vote_count: s.vote_count + (isVoted ? -1 : 1) } : s
      ))
    } catch { /* ignore */ }
  }

  return (
    <div className="mt-8">
      <button
        onClick={loadSubmissions}
        className="w-full text-left rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
          <Users className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Community Builds</h3>
          <p className="text-[11px] text-zinc-600">See what others shipped — vote for the best</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${loaded ? 'rotate-180' : ''}`} />
      </button>

      {loaded && (
        <div className="mt-3 space-y-2">
          {submissions.length === 0 ? (
            <p className="text-center text-xs text-zinc-600 py-6">No submissions yet. Be the first!</p>
          ) : (
            submissions.map(sub => (
              <div key={sub.id} className="rounded-2xl p-4 glass">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-zinc-500">
                      {sub.full_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-medium text-white">{sub.full_name}</span>
                      {sub.username && (
                        <Link href={`/u/${sub.username}`} className="text-[11px] text-zinc-600 hover:text-blue-400 transition-colors">
                          @{sub.username}
                        </Link>
                      )}
                    </div>
                    {sub.notes && (
                      <p className="text-[12px] text-zinc-500 line-clamp-2 mb-2">{sub.notes}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px]">
                      {sub.project_url && (
                        <a href={sub.project_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                          <Github className="w-3 h-3" /> Repo
                        </a>
                      )}
                      {sub.demo_url && (
                        <a href={sub.demo_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                          <Globe className="w-3 h-3" /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleVote(sub.id)}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                      votedIds.has(sub.id)
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-white/[0.04] text-zinc-600 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${votedIds.has(sub.id) ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">{sub.vote_count}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
