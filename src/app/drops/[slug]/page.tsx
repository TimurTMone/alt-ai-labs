import { weeklyDrops } from '@/lib/mock-data'
import DropDetail from './drop-detail'

export function generateStaticParams() {
  return weeklyDrops.map(d => ({ slug: d.slug }))
}

export default async function DropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <DropDetail slug={slug} />
}
