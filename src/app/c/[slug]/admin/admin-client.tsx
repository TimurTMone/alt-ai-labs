'use client'

import { useState } from 'react'
import { Users, Play, Trophy, MessageSquare, Plus, X, Loader2, Pencil, Trash2 } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/lib/i18n/context'
import type { Community, Drop, Post, LeaderboardEntry, Profile } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface AdminClientProps {
  community: Community
  drops: Drop[]
  posts: Post[]
  leaderboard: (LeaderboardEntry & { profile: Profile; rank: number })[]
}

export function AdminClient({ community, drops: initialDrops, posts, leaderboard }: AdminClientProps) {
  const [drops, setDrops] = useState(initialDrops)
  const [showForm, setShowForm] = useState(false)
  const [editDrop, setEditDrop] = useState<Drop | null>(null)
  const { t } = useI18n()

  const stats = [
    { label: 'Members', value: String(community.member_count), icon: Users, color: 'text-blue-400' },
    { label: t('nav', 'drops'), value: String(drops.length), icon: Play, color: 'text-blue-400' },
    { label: 'Submissions', value: String(drops.reduce((a, d) => a + d.submissions_count, 0)), icon: Trophy, color: 'text-amber-400' },
    { label: 'Posts', value: String(posts.length), icon: MessageSquare, color: 'text-violet-400' },
  ]

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this drop? This cannot be undone.')) return
    const token = localStorage.getItem('auth_token')
    await fetch(`${API_URL}/api/challenges/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDrops(drops.filter(d => d.id !== id))
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-[13px] text-zinc-500 mt-1">Manage {community.name}.</p>
          </div>
          <button
            onClick={() => { setEditDrop(null); setShowForm(true) }}
            className="flex items-center gap-2 btn-primary text-white h-9 px-4 text-[13px] font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4" /> New Drop
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-4 glass">
              <div className="flex items-center gap-2 mb-2"><s.icon className={`w-4 h-4 ${s.color}`} /><span className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">{s.label}</span></div>
              <span className="text-2xl font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 glass">
            <h2 className="font-semibold text-[14px] mb-4">{t('nav', 'drops')}</h2>
            <div className="space-y-1">
              {drops.map(drop => (
                <div key={drop.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] truncate">{drop.title}</p>
                    <p className="text-[11px] text-zinc-600">
                      {drop.drop_type || 'video'} · {drop.submissions_count} submissions · ${drop.prize_amount} prize
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      drop.status === 'live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>{drop.status}</span>
                    <button onClick={() => { setEditDrop(drop); setShowForm(true) }}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-600 hover:text-white transition-colors">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDelete(drop.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 glass">
            <h2 className="font-semibold text-[14px] mb-4">Top Builders</h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center gap-3 py-1.5">
                  <span className={`w-5 text-[12px] font-bold text-center ${entry.rank <= 3 ? 'text-amber-400' : 'text-zinc-600'}`}>{entry.rank}</span>
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center"><span className="text-[10px] text-zinc-400">{entry.profile.full_name[0]}</span></div>
                  <span className="text-[13px] flex-1 truncate">{entry.profile.full_name}</span>
                  <span className="text-[11px] font-medium text-zinc-500">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <DropForm
          community={community}
          drop={editDrop}
          onClose={() => setShowForm(false)}
          onSaved={(d) => {
            if (editDrop) {
              setDrops(drops.map(x => x.id === d.id ? d : x))
            } else {
              setDrops([d, ...drops])
            }
            setShowForm(false)
          }}
        />
      )}
    </AppLayout>
  )
}

// ── Drop Create/Edit Form ────────────────────────────────────

function DropForm({ community, drop, onClose, onSaved }: {
  community: Community; drop: Drop | null; onClose: () => void; onSaved: (d: Drop) => void
}) {
  const isEdit = drop !== null
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [dropType, setDropType] = useState<string>(drop?.drop_type || 'video')
  const [title, setTitle] = useState(drop?.title || '')
  const [description, setDescription] = useState(drop?.description || '')
  const [videoUrl, setVideoUrl] = useState(drop?.video_url || '')
  const [contentBody, setContentBody] = useState(drop?.content_body || '')
  const [resourceUrlsStr, setResourceUrlsStr] = useState(
    drop?.resource_urls?.map((r: { label: string; url: string }) => `${r.label}|${r.url}`).join('\n') || ''
  )
  const [duration, setDuration] = useState(String(drop?.duration_minutes || 15))
  const [difficulty, setDifficulty] = useState<string>(drop?.difficulty || 'beginner')
  const [isFree, setIsFree] = useState(drop?.is_free !== false)
  const [brief, setBrief] = useState(drop?.challenge_brief || '')
  const [deliverablesStr, setDeliverablesStr] = useState(
    (drop?.challenge_deliverables || []).join('\n')
  )
  const [rulesStr, setRulesStr] = useState(
    (drop?.challenge_rules || []).join('\n')
  )
  const [prizeAmount, setPrizeAmount] = useState(String(drop?.prize_amount || 0))
  const [creatorName, setCreatorName] = useState(drop?.creator_name || '')
  const [sponsorName, setSponsorName] = useState(drop?.sponsor_name || '')
  const [status, setStatus] = useState<string>(drop?.status || 'upcoming')

  const handleSave = async () => {
    if (!title.trim()) { setError('Title required'); return }
    setSaving(true)
    setError('')

    const resourceUrls = resourceUrlsStr.split('\n').filter(Boolean).map(line => {
      const [label, ...urlParts] = line.split('|')
      return { label: label.trim(), url: urlParts.join('|').trim() }
    })

    const body = {
      community_id: community.id,
      drop_type: dropType,
      title, description,
      video_url: dropType === 'video' ? videoUrl || null : null,
      content_body: dropType !== 'video' ? contentBody || null : null,
      resource_urls: resourceUrls.length > 0 ? resourceUrls : [],
      duration_minutes: parseInt(duration) || 0,
      difficulty, is_free: isFree,
      challenge_brief: brief,
      challenge_deliverables: deliverablesStr.split('\n').filter(Boolean),
      challenge_rules: rulesStr.split('\n').filter(Boolean),
      prize_amount: parseFloat(prizeAmount) || 0,
      creator_name: creatorName || null,
      sponsor_name: sponsorName || null,
      status,
    }

    const token = localStorage.getItem('auth_token')
    const url = isEdit ? `${API_URL}/api/challenges/${drop.id}` : `${API_URL}/api/challenges`
    const method = isEdit ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed')
        setSaving(false)
        return
      }
      const data = await res.json()
      onSaved(data.challenge)
    } catch {
      setError('Connection error')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#111113] rounded-2xl border border-white/[0.08] p-6"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{isEdit ? 'Edit Drop' : 'New Drop'}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          {/* Type selector */}
          <div>
            <Label className="text-[12px] text-zinc-500 mb-1.5">Type</Label>
            <div className="flex gap-2">
              {['video', 'text', 'github'].map(t => (
                <button key={t} onClick={() => setDropType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    dropType === t ? 'bg-blue-500 text-white' : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                  }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[12px] text-zinc-500">Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
          </div>

          <div>
            <Label className="text-[12px] text-zinc-500">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
          </div>

          {dropType === 'video' && (
            <div>
              <Label className="text-[12px] text-zinc-500">YouTube Embed URL</Label>
              <Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
            </div>
          )}

          {dropType !== 'video' && (
            <>
              <div>
                <Label className="text-[12px] text-zinc-500">Content Body</Label>
                <Textarea value={contentBody} onChange={e => setContentBody(e.target.value)} rows={5} placeholder="Full text content..." className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
              </div>
              <div>
                <Label className="text-[12px] text-zinc-500">Resource URLs (one per line: Label|URL)</Label>
                <Textarea value={resourceUrlsStr} onChange={e => setResourceUrlsStr(e.target.value)} rows={3}
                  placeholder={"Starter repo|https://github.com/...\nDocs|https://docs.example.com"} className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl font-mono" />
              </div>
            </>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-[12px] text-zinc-500">Duration (min)</Label>
              <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
            </div>
            <div>
              <Label className="text-[12px] text-zinc-500">Difficulty</Label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] px-3 text-white">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <Label className="text-[12px] text-zinc-500">Status</Label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] px-3 text-white">
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-[12px] text-zinc-500">Challenge Brief</Label>
            <Textarea value={brief} onChange={e => setBrief(e.target.value)} rows={4} className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
          </div>

          <div>
            <Label className="text-[12px] text-zinc-500">Deliverables (one per line)</Label>
            <Textarea value={deliverablesStr} onChange={e => setDeliverablesStr(e.target.value)} rows={3} placeholder={"Working prototype\nDemo video\nGitHub repo"} className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
          </div>

          <div>
            <Label className="text-[12px] text-zinc-500">Rules (one per line)</Label>
            <Textarea value={rulesStr} onChange={e => setRulesStr(e.target.value)} rows={3} className="bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px] text-zinc-500">Prize ($)</Label>
              <Input type="number" value={prizeAmount} onChange={e => setPrizeAmount(e.target.value)} className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-[13px] text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="rounded" />
                Free access
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px] text-zinc-500">Creator Name</Label>
              <Input value={creatorName} onChange={e => setCreatorName(e.target.value)} className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
            </div>
            <div>
              <Label className="text-[12px] text-zinc-500">Sponsor Name</Label>
              <Input value={sponsorName} onChange={e => setSponsorName(e.target.value)} className="h-9 bg-white/[0.04] border-white/[0.08] text-[13px] rounded-xl" />
            </div>
          </div>

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-white/[0.08] text-zinc-400 text-[13px] font-medium hover:bg-white/[0.04] transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 h-10 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Update' : 'Create Drop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
