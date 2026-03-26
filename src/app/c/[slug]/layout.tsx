import { notFound } from 'next/navigation'
import { getCommunityBySlug, getAllCommunities } from '@/lib/data'
import { CommunityProvider } from '@/lib/community-context'

export async function generateStaticParams() {
  const communities = await getAllCommunities()
  return communities.map(c => ({ slug: c.slug }))
}

export default async function CommunityLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()
  return <CommunityProvider community={community}>{children}</CommunityProvider>
}
