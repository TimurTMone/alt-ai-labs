import { getDropsForCommunity, getPostsForCommunity, getLeaderboardForCommunity, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { AdminClient } from './admin-client'

export default async function AdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [drops, posts, leaderboard] = await Promise.all([
    getDropsForCommunity(community.id),
    getPostsForCommunity(community.id),
    getLeaderboardForCommunity(community.id),
  ])

  return <AdminClient community={community} drops={drops} posts={posts} leaderboard={leaderboard} />
}
