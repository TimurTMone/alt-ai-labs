import { mockCommunities, weeklyDrops } from '@/lib/mock-data'
import { DropDetailPage } from './drop-detail'

export function generateStaticParams() {
  const params: { slug: string; dropSlug: string }[] = []
  for (const community of mockCommunities) {
    for (const drop of weeklyDrops.filter(d => d.community_id === community.id)) {
      params.push({ slug: community.slug, dropSlug: drop.slug })
    }
  }
  return params
}

export default function Page() {
  return <DropDetailPage />
}
