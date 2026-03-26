import { cookies } from 'next/headers'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'
import * as mock from '@/lib/mock-data'
import type { Community, Profile, WeeklyDrop, DropProgress, Post, LeaderboardEntry, Group } from '@/types/database'

// ── Helpers ──────────────────────────────────────────────────────

async function isDemo(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('demo_mode')?.value === 'true'
  } catch {
    // Called from generateStaticParams or build context — no cookies available
    return true
  }
}

async function safeSupabase() {
  try {
    return await createServerSupabaseClient()
  } catch {
    return null
  }
}

// ── Community ────────────────────────────────────────────────────

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  if (await isDemo()) return mock.getCommunityBySlug(slug) ?? null

  const supabase = await safeSupabase()
  if (!supabase) return mock.getCommunityBySlug(slug) ?? null

  const { data } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single()

  return data ?? mock.getCommunityBySlug(slug) ?? null
}

export async function getAllCommunities(): Promise<Community[]> {
  if (await isDemo()) return mock.mockCommunities

  const supabase = await safeSupabase()
  if (!supabase) return mock.mockCommunities

  const { data } = await supabase.from('communities').select('*').order('created_at')
  return data?.length ? data : mock.mockCommunities
}

// ── Profile ──────────────────────────────────────────────────────

export async function getCurrentProfile(): Promise<Profile> {
  if (await isDemo()) return mock.mockProfile

  const session = await getSession()
  if (!session) return mock.mockProfile

  const supabase = await safeSupabase()
  if (!supabase) return mock.mockProfile

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data ?? mock.mockProfile
}

// ── Drops ────────────────────────────────────────────────────────

export async function getDropsForCommunity(communityId: string): Promise<WeeklyDrop[]> {
  if (await isDemo()) return mock.getDropsForCommunity(communityId)

  const supabase = await safeSupabase()
  if (!supabase) return mock.getDropsForCommunity(communityId)

  const { data } = await supabase
    .from('weekly_drops')
    .select('*')
    .eq('community_id', communityId)
    .order('week_number', { ascending: true })

  return data?.length ? data : mock.getDropsForCommunity(communityId)
}

export async function getDropBySlug(communityId: string, dropSlug: string): Promise<WeeklyDrop | null> {
  if (await isDemo()) {
    return mock.getDropsForCommunity(communityId).find(d => d.slug === dropSlug) ?? null
  }

  const supabase = await safeSupabase()
  if (!supabase) {
    return mock.getDropsForCommunity(communityId).find(d => d.slug === dropSlug) ?? null
  }

  const { data } = await supabase
    .from('weekly_drops')
    .select('*')
    .eq('community_id', communityId)
    .eq('slug', dropSlug)
    .single()

  return data ?? mock.getDropsForCommunity(communityId).find(d => d.slug === dropSlug) ?? null
}

// ── User Progress ────────────────────────────────────────────────

export async function getUserProgress(communityId: string): Promise<DropProgress[]> {
  if (await isDemo()) return mock.mockProgress

  const session = await getSession()
  if (!session) return mock.mockProgress

  const supabase = await safeSupabase()
  if (!supabase) return mock.mockProgress

  // Get all drop IDs for this community first
  const { data: drops } = await supabase
    .from('weekly_drops')
    .select('id')
    .eq('community_id', communityId)

  if (!drops?.length) return mock.mockProgress

  const dropIds = drops.map(d => d.id)

  const { data } = await supabase
    .from('drop_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .in('drop_id', dropIds)

  return data?.length ? data : mock.mockProgress
}

// ── Posts ─────────────────────────────────────────────────────────

export async function getPostsForCommunity(communityId: string): Promise<Post[]> {
  if (await isDemo()) return mock.getPostsForCommunity(communityId)

  const supabase = await safeSupabase()
  if (!supabase) return mock.getPostsForCommunity(communityId)

  const { data } = await supabase
    .from('posts')
    .select('*, profile:profiles(id, email, full_name, avatar_url, bio, membership_tier, stripe_customer_id, is_admin, total_points, created_at, updated_at)')
    .eq('community_id', communityId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  if (!data?.length) return mock.getPostsForCommunity(communityId)

  return data.map(p => ({
    ...p,
    profile: Array.isArray(p.profile) ? p.profile[0] : p.profile,
  }))
}

// ── Leaderboard ──────────────────────────────────────────────────

export async function getLeaderboardForCommunity(communityId: string): Promise<(LeaderboardEntry & { profile: Profile; rank: number })[]> {
  if (await isDemo()) return mock.getLeaderboardForCommunity(communityId)

  const supabase = await safeSupabase()
  if (!supabase) return mock.getLeaderboardForCommunity(communityId)

  // Aggregate points per user in this community
  const { data } = await supabase
    .from('leaderboard_entries')
    .select('*, profile:profiles(id, email, full_name, avatar_url, bio, membership_tier, stripe_customer_id, is_admin, total_points, created_at, updated_at)')
    .eq('community_id', communityId)
    .order('points', { ascending: false })
    .limit(50)

  if (!data?.length) return mock.getLeaderboardForCommunity(communityId)

  return data.map((entry, i) => ({
    ...entry,
    rank: i + 1,
    profile: Array.isArray(entry.profile) ? entry.profile[0] : entry.profile,
  }))
}

// ── Groups ───────────────────────────────────────────────────────

export async function getGroupsForCommunity(communityId: string): Promise<Group[]> {
  if (await isDemo()) return mock.getGroupsForCommunity(communityId)

  const supabase = await safeSupabase()
  if (!supabase) return mock.getGroupsForCommunity(communityId)

  const { data } = await supabase
    .from('groups')
    .select('*, group_members(count)')
    .eq('community_id', communityId)
    .order('created_at', { ascending: true })

  if (!data?.length) return mock.getGroupsForCommunity(communityId)

  return data.map(g => ({
    ...g,
    _count: { group_members: g.group_members?.[0]?.count ?? 0 },
  }))
}
