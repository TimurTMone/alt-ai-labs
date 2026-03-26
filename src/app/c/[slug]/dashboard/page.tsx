import { getDropsForCommunity, getCurrentProfile, getUserProgress, getPostsForCommunity, getLeaderboardForCommunity } from '@/lib/data'
import { getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [drops, profile, progress, posts, leaderboard] = await Promise.all([
    getDropsForCommunity(community.id),
    getCurrentProfile(),
    getUserProgress(community.id),
    getPostsForCommunity(community.id),
    getLeaderboardForCommunity(community.id),
  ])

  return (
    <DashboardClient
      community={community}
      drops={drops}
      profile={profile}
      progress={progress}
      posts={posts}
      leaderboard={leaderboard}
    />
  )
}
