import { Heart, MessageCircle, Pin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { POST_CATEGORIES } from '@/lib/constants'
import type { Post } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const category = POST_CATEGORIES.find(c => c.value === post.category)
  const initial = post.profile?.full_name?.[0] || '?'

  return (
    <div className="rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-medium text-neutral-400">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-white">{post.profile?.full_name}</span>
            <span className="text-[11px] text-neutral-600">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            {post.is_pinned && <Pin className="w-3 h-3 text-amber-400" />}
          </div>
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md border-white/[0.08] text-neutral-500">
                {category.label}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-[14px] text-white mb-1">{post.title}</h3>
          <p className="text-[12px] text-neutral-500 line-clamp-3 mb-3">{post.body}</p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-600">
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <Heart className="w-3 h-3" />
              {post.likes_count}
            </button>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <MessageCircle className="w-3 h-3" />
              {post.comments_count}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
