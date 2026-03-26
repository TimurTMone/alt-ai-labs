import { getDropsForCommunity, getUserProgress, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { DropsClient } from './drops-client'

export default async function DropsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [drops, progress] = await Promise.all([
    getDropsForCommunity(community.id),
    getUserProgress(community.id),
  ])

  return <DropsClient community={community} drops={drops} progress={progress} />
}
