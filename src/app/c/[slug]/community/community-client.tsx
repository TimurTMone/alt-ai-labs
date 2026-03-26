'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { PreviewBanner } from '@/components/ui/preview-banner'
import { PostCard } from '@/components/cards/post-card'
import { POST_CATEGORIES } from '@/lib/constants'
import type { Community, Post } from '@/types/database'

interface CommunityClientProps {
  community: Community
  posts: Post[]
}

export function CommunityClient({ posts }: CommunityClientProps) {
  const pinned = posts.filter(p => p.is_pinned)
  const regular = posts.filter(p => !p.is_pinned)

  return (
    <AppLayout>
      <PreviewBanner feature="Community feed" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Community</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Share your wins, ask questions, and connect with other builders.</p>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button className="text-[12px] px-3.5 py-1.5 rounded-full bg-blue-500 text-white font-medium shrink-0">All</button>
        {POST_CATEGORIES.map(cat => (
          <button key={cat.value} className="text-[12px] px-3.5 py-1.5 rounded-full border border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/[0.15] transition-colors shrink-0">{cat.label}</button>
        ))}
      </div>
      {pinned.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-3">Pinned</h2>
          <div className="space-y-2">{pinned.map(post => <PostCard key={post.id} post={post} />)}</div>
        </div>
      )}
      <div className="space-y-2">{regular.map(post => <PostCard key={post.id} post={post} />)}</div>
    </AppLayout>
  )
}
