import { notFound } from 'next/navigation'
import { ExternalLink, Github, Globe, Flame, Trophy, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getBuilderLevel } from '@/lib/constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface PublicProfileData {
  profile: {
    id: string; username: string; full_name: string; avatar_url: string | null
    bio: string | null; membership_tier: string; total_points: number
    github_url: string | null; twitter_url: string | null; linkedin_url: string | null; website_url: string | null
    created_at: string
  }
  submissions: { id: string; drop_id: string; project_url: string; demo_url: string | null; status: string; created_at: string; drop_title: string; drop_slug: string }[]
  streak: { current_streak: number; longest_streak: number }
  heatmap: { activity_date: string; count: number }[]
}

async function getPublicProfile(username: string): Promise<PublicProfileData | null> {
  try {
    const res = await fetch(`${API_URL}/api/profiles/${username}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getPublicProfile(username)
  if (!data) notFound()

  const { profile, submissions, streak, heatmap } = data
  const level = getBuilderLevel(profile.total_points)
  const initial = profile.full_name?.[0]?.toUpperCase() || '?'

  // Build 52-week heatmap
  const heatmapLookup = new Map<string, number>()
  for (const day of heatmap) {
    heatmapLookup.set(day.activity_date.split('T')[0], day.count)
  }
  const weeks: { date: string; level: number }[][] = []
  const today = new Date()
  const days: { date: string; level: number }[] = []
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    const count = heatmapLookup.get(ds) || 0
    days.push({ date: ds, level: count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3 })
  }
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const heatColors = ['bg-zinc-800/60', 'bg-emerald-500/30', 'bg-emerald-500/55', 'bg-emerald-400']

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Alt AI Labs
        </Link>

        {/* Avatar + Info */}
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-bold">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{profile.full_name}</h1>
            <p className="text-sm text-zinc-500">@{profile.username}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${level.bg} ${level.color}`}>
                {level.emoji} {level.name}
              </span>
              {streak.current_streak > 0 && (
                <span className="text-xs text-orange-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {streak.current_streak} day streak
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">{profile.bio}</p>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Github className="w-3 h-3" /> GitHub
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <ExternalLink className="w-3 h-3" /> X / Twitter
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <ExternalLink className="w-3 h-3" /> LinkedIn
            </a>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Globe className="w-3 h-3" /> Website
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-2xl p-4 glass text-center">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-2" />
            <span className="text-xl font-bold block">{profile.total_points}</span>
            <span className="text-[10px] text-zinc-600">Points</span>
          </div>
          <div className="rounded-2xl p-4 glass text-center">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-2" />
            <span className="text-xl font-bold block">{streak.longest_streak}</span>
            <span className="text-[10px] text-zinc-600">Best Streak</span>
          </div>
          <div className="rounded-2xl p-4 glass text-center">
            <Calendar className="w-4 h-4 text-blue-400 mx-auto mb-2" />
            <span className="text-xl font-bold block">{submissions.length}</span>
            <span className="text-[10px] text-zinc-600">Builds</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">Activity</h2>
          <div className="rounded-2xl p-4 glass overflow-x-auto">
            <div className="flex gap-[2px] min-w-fit">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div key={di} className={`w-[8px] h-[8px] rounded-[1.5px] ${heatColors[day.level]}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Builds */}
        {submissions.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-3">Builds</h2>
            <div className="space-y-2">
              {submissions.map(sub => (
                <div key={sub.id} className="rounded-2xl p-4 glass hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{sub.drop_title}</p>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        {sub.status === 'winner' ? '🏆 Winner' : 'Submitted'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {sub.project_url && (
                        <a href={sub.project_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
                          <Github className="w-3.5 h-3.5 text-zinc-500" />
                        </a>
                      )}
                      {sub.demo_url && (
                        <a href={sub.demo_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
                          <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
