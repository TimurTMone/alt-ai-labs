import { getSession, getAuthToken, getProfile } from '@/lib/auth/server'
import type { Community, Profile, Drop, DropProgress, Post, LeaderboardEntry, Group, Streak, HeatmapDay } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ── Helpers ──────────────────────────────────────────────────────

async function apiFetch<T>(path: string, authToken?: string | null): Promise<T | null> {
  try {
    const headers: Record<string, string> = {}
    if (authToken) headers.Authorization = `Bearer ${authToken}`

    const res = await fetch(`${API_URL}${path}`, { headers, cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ── Community ────────────────────────────────────────────────────

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  const data = await apiFetch<{ community: Community }>(`/api/communities/${slug}`)
  return data?.community ?? null
}

export async function getAllCommunities(): Promise<Community[]> {
  const data = await apiFetch<{ communities: Community[] }>('/api/communities')
  return data?.communities ?? []
}

// ── Profile ──────────────────────────────────────────────────────

const GUEST_PROFILE: Profile = {
  id: 'guest', email: '', full_name: 'Explorer', avatar_url: null,
  bio: null, membership_tier: 'free', stripe_customer_id: null,
  is_admin: false, total_points: 0,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

export async function getCurrentProfile(): Promise<Profile> {
  const profile = await getProfile()
  return profile ?? GUEST_PROFILE
}

// ── Drops ────────────────────────────────────────────────────────

export async function getDropsForCommunity(communityId: string): Promise<Drop[]> {
  const data = await apiFetch<{ challenges: Drop[] }>(`/api/challenges?community_id=${communityId}`)
  return data?.challenges ?? []
}

export async function getDropBySlug(communityId: string, dropSlug: string): Promise<Drop | null> {
  const data = await apiFetch<{ challenge: Drop }>(`/api/challenges/${dropSlug}`)
  return data?.challenge ?? null
}

// ── User Progress ────────────────────────────────────────────────

export async function getUserProgress(communityId: string): Promise<DropProgress[]> {
  const token = await getAuthToken()
  if (!token) return []

  const data = await apiFetch<{ progress: DropProgress[] }>(`/api/progress?community_id=${communityId}`, token)
  return data?.progress ?? []
}

// ── Posts ─────────────────────────────────────────────────────────

export async function getPostsForCommunity(communityId: string): Promise<Post[]> {
  const data = await apiFetch<{ posts: Post[] }>(`/api/posts?community_id=${communityId}`)
  return data?.posts ?? []
}

// ── Leaderboard ──────────────────────────────────────────────────

export async function getLeaderboardForCommunity(communityId: string): Promise<(LeaderboardEntry & { profile: Profile; rank: number })[]> {
  const data = await apiFetch<{ leaderboard: (LeaderboardEntry & { profile: Profile; rank: number })[] }>('/api/leaderboard?limit=50')
  return data?.leaderboard ?? []
}

// ── Streaks ──────────────────────────────────────────────────────

export async function getStreakData(): Promise<{ streak: Streak; heatmap: HeatmapDay[] }> {
  const token = await getAuthToken()
  if (!token) return { streak: { current: 0, longest: 0, lastActivity: null, freezesLeft: 0 }, heatmap: [] }

  const data = await apiFetch<{ streak: Streak; heatmap: HeatmapDay[] }>('/api/streaks', token)
  return data ?? { streak: { current: 0, longest: 0, lastActivity: null, freezesLeft: 0 }, heatmap: [] }
}

// ── Groups ───────────────────────────────────────────────────────

export async function getGroupsForCommunity(communityId: string): Promise<Group[]> {
  const data = await apiFetch<{ groups: Group[] }>(`/api/groups?community_id=${communityId}`)
  return data?.groups ?? []
}
