'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Sparkles, Calendar, ArrowRight, ExternalLink, Github, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { getBuilderLevel } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import type { Profile } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ProfileClientProps {
  profile: Profile
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const [name, setName] = useState(profile.full_name)
  const [bio, setBio] = useState(profile.bio || '')
  const [username, setUsername] = useState(profile.username || '')
  const [githubUrl, setGithubUrl] = useState(profile.github_url || '')
  const [twitterUrl, setTwitterUrl] = useState(profile.twitter_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || '')
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const level = getBuilderLevel(profile.total_points)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          full_name: name, bio, username,
          github_url: githubUrl, twitter_url: twitterUrl,
          linkedin_url: linkedinUrl, website_url: websiteUrl,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
    } catch {
      // Demo mode — still show saved
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-[13px] text-zinc-500 mb-8">Manage your account and public profile.</p>

        {/* Profile card */}
        <div className="rounded-2xl p-6 glass mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/15">
              <span className="text-xl font-bold">{profile.full_name?.[0]?.toUpperCase() || '?'}</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{profile.full_name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[12px] text-zinc-500">
                  <Mail className="w-3 h-3" /> {profile.email}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0 rounded-md ${level.bg} ${level.color}`}>
                  {level.emoji} {level.name}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {profile.membership_tier === 'free' ? 'Free' : profile.membership_tier === 'paid' ? 'Pro' : profile.membership_tier}
                </Badge>
              </div>
            </div>
          </div>
          {profile.username && (
            <Link href={`/u/${profile.username}`} className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-3">
              <ExternalLink className="w-3 h-3" /> View public profile →
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-2xl p-4 glass">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Total Points</span>
            </div>
            <span className="text-2xl font-bold">{profile.total_points}</span>
          </div>
          <div className="rounded-2xl p-4 glass">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Member Since</span>
            </div>
            <span className="text-[14px] font-medium">{formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-[13px] text-zinc-400">Username</Label>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-zinc-600">altaihub.com/u/</span>
              <Input id="username" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="your-username" className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] flex-1" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] text-zinc-400">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[13px] text-zinc-400">Bio</Label>
            <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
          </div>

          {/* Social links */}
          <div className="pt-2">
            <h3 className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider mb-3">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/you"
                  className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[12px]" />
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <Input value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)} placeholder="https://x.com/you"
                  className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[12px]" />
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/you"
                  className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[12px]" />
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://your-site.com"
                  className="h-9 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[12px]" />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-orange-400">{error}</p>
          )}

          <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white h-9 px-5 text-[13px] font-semibold rounded-xl transition-colors">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
