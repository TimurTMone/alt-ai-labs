import { getPostsForCommunity, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { CommunityClient } from './community-client'

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const posts = await getPostsForCommunity(community.id)
  return <CommunityClient community={community} posts={posts} />
}
