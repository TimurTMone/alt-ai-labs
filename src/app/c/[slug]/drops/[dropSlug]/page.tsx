'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Trophy, CheckCircle2, AlertCircle, Play, Lock, Send, Github, Globe, Video, Paperclip, X, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/layout/app-layout'
import { useCommunityRequired } from "@/lib/community-context"
import { DIFFICULTY_COLORS, DROP_STATUS_COLORS } from '@/lib/constants'
import { getDropsForCommunity, mockProgress } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { useParams } from 'next/navigation'

export default function DropDetailPage() {
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
  const isUpcoming = drop.status === 'upcoming'
  const challengeUnlocked = watched

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  return (
    <AppLayout>
      <Link href={`${base}/drops`} className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All Drops
      </Link>
      <div className="max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-zinc-600 tracking-widest">WEEK {drop.week_number}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DROP_STATUS_COLORS[drop.status]}`}>{drop.status}</Badge>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-md ${DIFFICULTY_COLORS[drop.difficulty]}`}>{drop.difficulty}</Badge>
            {!drop.is_free && <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-amber-500/10 text-amber-400 border-amber-500/20"><Lock className="w-2.5 h-2.5 mr-0.5" /> Pro</Badge>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{drop.title}</h1>
          <p className="text-[14px] text-zinc-400 leading-relaxed">{drop.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[12px] text-zinc-500"><Clock className="w-3 h-3" /> {drop.duration_minutes} min</span>
            {drop.prize_amount > 0 && <span className="flex items-center gap-1.5 text-[12px] text-amber-400"><Trophy className="w-3 h-3" /> ${drop.prize_amount} prize</span>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10 p-4 rounded-2xl glass">
          <div className={`flex items-center gap-2 text-[13px] font-medium ${watched ? 'text-blue-400' : 'text-white'}`}>
            {watched ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">1</div>} Watch
          </div>
          <div className={`flex-1 h-px ${watched ? 'bg-blue-500/30' : 'bg-white/[0.06]'}`} />
          <div className={`flex items-center gap-2 text-[13px] font-medium ${challengeUnlocked ? (submitted ? 'text-blue-400' : 'text-white') : 'text-zinc-600'}`}>
            {submitted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">2</div>} Build
          </div>
          <div className={`flex-1 h-px ${submitted ? 'bg-blue-500/30' : 'bg-white/[0.06]'}`} />
          <div className={`flex items-center gap-2 text-[13px] font-medium ${submitted ? 'text-blue-400' : 'text-zinc-600'}`}>
            {submitted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">3</div>} Submit
          </div>
        </div>

        {/* Video */}
        <div className="mb-10">
          <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-zinc-400"><Play className="w-4 h-4 text-blue-400" /> The Lesson</h2>
          {isUpcoming && !drop.video_url ? (
            <div className="aspect-video rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <div className="text-center"><div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3"><Play className="w-6 h-6 text-zinc-600" /></div><p className="text-[13px] text-zinc-600">Video drops soon</p></div>
            </div>
          ) : drop.video_url ? (
            <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.06] mb-4">
                <iframe src={drop.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              {!watched ? (
                <button onClick={() => setWatched(true)} className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white h-9 px-5 text-[13px] font-semibold rounded-xl transition-colors"><CheckCircle2 className="w-4 h-4" /> Mark as Watched</button>
              ) : (
                <p className="text-[12px] text-blue-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Video completed</p>
              )}
            </>
          ) : null}
        </div>

        {/* Challenge */}
        <div className={`mb-10 transition-opacity duration-300 ${!challengeUnlocked ? 'opacity-30 pointer-events-none' : ''}`}>
          <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-zinc-400">
            <Trophy className="w-4 h-4 text-amber-400" /> The Challenge
            {!challengeUnlocked && <span className="text-[11px] text-zinc-600 normal-case tracking-normal ml-1">(watch the video first)</span>}
          </h2>
          <div className="rounded-2xl p-6 glass mb-4">
            <div className="text-[13px] text-zinc-300 leading-relaxed space-y-2">
              {drop.challenge_brief.split('\n').map((line, i) => {
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-zinc-400">{line.replace('- ', '')}</li>
                if (line.trim() === '') return <br key={i} />
                return <p key={i}>{line}</p>
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="rounded-2xl p-5 glass">
              <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">What to Submit</h3>
              <ul className="space-y-2">{drop.challenge_deliverables.map((d, i) => <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400/60 shrink-0 mt-0.5" /> {d}</li>)}</ul>
            </div>
            <div className="rounded-2xl p-5 glass">
              <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Rules</h3>
              <ul className="space-y-2">{drop.challenge_rules.map((r, i) => <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400"><AlertCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" /> {r}</li>)}</ul>
            </div>
          </div>
          {drop.status === 'live' && <p className="text-[12px] text-zinc-500">Deadline: {formatDistanceToNow(new Date(drop.challenge_deadline))} left</p>}
        </div>

        {/* Submit */}
        {challengeUnlocked && !submitted && drop.status === 'live' && (
          <div className="mb-10">
            <h2 className="text-[13px] font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-zinc-400"><Send className="w-4 h-4 text-blue-400" /> Submit Your Build</h2>
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] space-y-5">

              {/* GitHub repo */}
              <div className="space-y-1.5">
                <Label htmlFor="github" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> GitHub Repository *
                </Label>
                <Input id="github" placeholder="https://github.com/you/project" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600 focus:border-blue-500/30 focus:ring-blue-500/10" />
                <p className="text-[11px] text-zinc-600">Public repo with your source code</p>
              </div>

              {/* Live URL */}
              <div className="space-y-1.5">
                <Label htmlFor="live" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Live URL
                </Label>
                <Input id="live" placeholder="https://your-app.vercel.app" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600 focus:border-blue-500/30 focus:ring-blue-500/10" />
                <p className="text-[11px] text-zinc-600">Deployed app on Vercel, Netlify, or any host</p>
              </div>

              {/* Demo video */}
              <div className="space-y-1.5">
                <Label htmlFor="demo" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Demo Video
                </Label>
                <Input id="demo" placeholder="https://youtube.com/watch?v=... or https://loom.com/..." value={demoVideoUrl} onChange={e => setDemoVideoUrl(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600 focus:border-blue-500/30 focus:ring-blue-500/10" />
                <p className="text-[11px] text-zinc-600">YouTube, Loom, or any video link showing your build in action</p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="desc" className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> What you built *
                </Label>
                <Textarea id="desc" placeholder="Describe your build: what it does, how it works, what stack you used, any challenges you faced..." value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600 focus:border-blue-500/30 focus:ring-blue-500/10" />
              </div>

              {/* Attachments */}
              <div className="space-y-1.5">
                <Label className="text-[13px] text-zinc-400 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" /> Attachments
                </Label>
                <p className="text-[11px] text-zinc-600 mb-2">Add links to PRDs, Figma files, docs, slides, or anything else</p>
                <div className="flex gap-2">
                  <Input placeholder="https://docs.google.com/..." value={attachInput} onChange={e => setAttachInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (attachInput.trim()) { setAttachments([...attachments, attachInput.trim()]); setAttachInput('') } } }} className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600 focus:border-blue-500/30 focus:ring-blue-500/10" />
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

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Submit */}
              <div>
                <button type="submit" disabled={!githubUrl || !description} className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white h-11 text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_28px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Submit Build
                </button>
                <p className="text-[11px] text-zinc-600 text-center mt-2">You can edit your submission until the deadline</p>
              </div>
            </form>
          </div>
        )}

        {submitted && (
          <div className="rounded-2xl p-8 text-center bg-white/[0.02] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.08)]">
            <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">Build Submitted!</h3>
            <p className="text-[13px] text-zinc-400 mb-4">Your submission is in. Good luck!</p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-[12px] text-zinc-500">
              {githubUrl && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> Repo linked</span>}
              {liveUrl && <><span className="hidden sm:block">·</span><span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Live demo linked</span></>}
              {demoVideoUrl && <><span className="hidden sm:block">·</span><span className="flex items-center gap-1"><Video className="w-3 h-3" /> Video linked</span></>}
              {attachments.length > 0 && <><span className="hidden sm:block">·</span><span className="flex items-center gap-1"><Paperclip className="w-3 h-3" /> {attachments.length} attachment{attachments.length > 1 ? 's' : ''}</span></>}
            </div>
          </div>
        )}

        {drop.prize_amount > 0 && drop.prize_description && (
          <div className="rounded-2xl p-5 mt-6 glass glow-amber">
            <div className="flex items-center gap-2 mb-1.5"><Trophy className="w-4 h-4 text-amber-400" /><span className="font-semibold text-[13px] text-amber-400">Prize</span></div>
            <p className="text-[13px] text-zinc-300">{drop.prize_description}</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
