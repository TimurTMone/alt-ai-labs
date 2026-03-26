import { getAllCommunities, getDropsForCommunity, getDropBySlug, getUserProgress, getCommunityBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import { DropDetailClient } from './drop-detail'

export async function generateStaticParams() {
  const communities = await getAllCommunities()
  const params: { slug: string; dropSlug: string }[] = []
  for (const community of communities) {
    const drops = await getDropsForCommunity(community.id)
    for (const drop of drops) {
      params.push({ slug: community.slug, dropSlug: drop.slug })
    }
  }
  return params
}

export default async function Page({ params }: { params: Promise<{ slug: string; dropSlug: string }> }) {
  const { slug, dropSlug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const [drop, progress] = await Promise.all([
    getDropBySlug(community.id, dropSlug),
    getUserProgress(community.id),
  ])

  if (!drop) notFound()

  const dropProgress = progress.find(p => p.drop_id === drop.id) ?? null

  return (
    <DropDetailClient
      community={community}
      drop={drop}
      initialProgress={dropProgress}
    />
  )
}
