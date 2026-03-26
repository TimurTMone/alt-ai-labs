import { getLeaderboardForCommunity, getCurrentProfile, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { LeaderboardClient } from './leaderboard-client'

export default async function LeaderboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [leaderboard, profile] = await Promise.all([
    getLeaderboardForCommunity(community.id),
    getCurrentProfile(),
  ])

  return <LeaderboardClient community={community} leaderboard={leaderboard} profile={profile} />
}
