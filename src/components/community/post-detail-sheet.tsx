'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Heart, MessageCircle, Pin, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { POST_CATEGORIES } from '@/lib/constants'
import { formatDistanceToNow } from 'date-fns'
import type { Post, Profile } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface Comment {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  profile?: Profile
}

interface PostDetailSheetProps {
  post: Post
  onClose: () => void
}

export function PostDetailSheet({ post, onClose }: PostDetailSheetProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const category = POST_CATEGORIES.find(c => c.value === post.category)

  useEffect(() => {
    fetchComments()
  }, [post.id])

  async function fetchComments() {
    try {
      const res = await fetch(`${API_URL}/api/comments?post_id=${post.id}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    if (!token) {
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: post.id, body: newComment.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments(prev => [...prev, data.comment])
        setNewComment('')
        // Scroll to bottom
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 100)
      }
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg bg-[#111113] rounded-t-3xl border-t border-x border-white/[0.08] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + close */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Post content */}
        <div className="px-5 pt-2 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
              <span className="text-[11px] font-medium text-zinc-400">{post.profile?.full_name?.[0] || '?'}</span>
            </div>
            <div>
              <span className="text-[13px] font-medium text-white">{post.profile?.full_name}</span>
              <span className="text-[11px] text-zinc-600 ml-2">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            {post.is_pinned && <Pin className="w-3 h-3 text-amber-400 ml-auto" />}
          </div>
          {category && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md border-white/[0.08] text-zinc-500 mb-2">
              {category.label}
            </Badge>
          )}
          <h3 className="font-semibold text-[15px] text-white mb-1">{post.title}</h3>
          <p className="text-[13px] text-zinc-400 leading-relaxed">{post.body}</p>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-600">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes_count}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {comments.length || post.comments_count}</span>
          </div>
        </div>

        {/* Comments list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-3 space-y-3 min-h-[120px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-[12px] text-zinc-600 py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-medium text-zinc-500">
                    {comment.profile?.full_name?.[0] || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12px] font-medium text-zinc-300">{comment.profile?.full_name || 'Builder'}</span>
                    <span className="text-[10px] text-zinc-700">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mt-0.5">{comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-white/[0.06] flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
            style={{ fontSize: '16px' }}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="w-10 h-10 rounded-xl bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
