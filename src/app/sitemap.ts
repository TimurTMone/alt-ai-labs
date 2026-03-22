import type { MetadataRoute } from 'next'
import { mockCommunities, weeklyDrops } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://alt-ai-labs.vercel.app'

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const communityPages = mockCommunities.flatMap(c => [
    { url: `${base}/c/${c.slug}/dashboard`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${base}/c/${c.slug}/drops`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/c/${c.slug}/community`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.6 },
    { url: `${base}/c/${c.slug}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.5 },
  ])

  const dropPages = weeklyDrops
    .filter(d => d.community_id === 'community-001')
    .map(d => ({
      url: `${base}/c/alt-ai-labs/drops/${d.slug}`,
      lastModified: new Date(d.updated_at),
      changeFrequency: 'weekly' as const,
      priority: d.status === 'live' ? 0.9 : 0.6,
    }))

  return [...staticPages, ...communityPages, ...dropPages]
}
