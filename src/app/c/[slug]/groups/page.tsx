import { getGroupsForCommunity, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { GroupsClient } from './groups-client'

export default async function GroupsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const groups = await getGroupsForCommunity(community.id)
  return <GroupsClient community={community} groups={groups} />
}
