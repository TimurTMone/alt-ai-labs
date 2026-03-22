import { notFound } from 'next/navigation'
import { getCommunityBySlug, mockCommunities } from '@/lib/mock-data'
import { CommunityProvider } from '@/lib/community-context'

export function generateStaticParams() {
  return mockCommunities.map(c => ({ slug: c.slug }))
}

export default async function CommunityLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = getCommunityBySlug(slug)
  if (!community) notFound()
  return <CommunityProvider community={community}>{children}</CommunityProvider>
}
