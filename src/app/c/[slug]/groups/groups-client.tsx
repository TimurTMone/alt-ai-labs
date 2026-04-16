'use client'

import { useState } from 'react'
import { Users, Check, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { PreviewBanner } from '@/components/ui/preview-banner'
import type { Community, Group } from '@/types/database'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface GroupsClientProps {
  community: Community
  groups: Group[]
}

export function GroupsClient({ groups }: GroupsClientProps) {
  return (
    <AppLayout>
      <PreviewBanner feature="Groups" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Join focused builder groups. Learn and build together.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </AppLayout>
  )
}

function GroupCard({ group }: { group: Group }) {
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/groups/${group.id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setJoined(true)
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleLeave() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/groups/${group.id}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setJoined(false)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
            <Users className="w-5 h-5 text-zinc-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px]">{group.name}</h3>
            <span className="text-[11px] text-zinc-600">
              {(group._count?.group_members || 0) + (joined ? 1 : 0)} members{group.max_members && ` / ${group.max_members} max`}
            </span>
          </div>
        </div>
        {group.visibility === 'private' && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-violet-500/10 text-violet-400 border-violet-500/20">
            Invite Only
          </Badge>
        )}
      </div>
      <p className="text-[12px] text-zinc-500 mb-4">{group.description}</p>

      {joined ? (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="text-[12px] h-8 px-4 rounded-xl font-medium transition-colors bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 text-green-400" />}
          Joined
        </button>
      ) : (
        <button
          onClick={handleJoin}
          disabled={loading}
          className="text-[12px] h-8 px-4 rounded-xl font-medium transition-colors bg-blue-500 hover:bg-blue-400 text-white flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {group.visibility === 'private' ? 'Request to Join' : 'Join Group'}
        </button>
      )}
    </div>
  )
}
