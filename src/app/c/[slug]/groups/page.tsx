'use client'

import { Users, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { useCommunityRequired } from "@/lib/community-context"
import { getGroupsForCommunity } from '@/lib/mock-data'

export default function GroupsPage() {
  const community = useCommunityRequired()
  const groups = getGroupsForCommunity(community.id)

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Join focused builder groups. Learn and build together.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {groups.map(group => (
          <div key={group.id} className="rounded-2xl p-5 glass hover:bg-white/[0.04] transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center"><Users className="w-5 h-5 text-neutral-500" /></div>
                <div>
                  <h3 className="font-semibold text-[14px]">{group.name}</h3>
                  <span className="text-[11px] text-neutral-600">{group._count?.group_members || 0} members{group.max_members && ` / ${group.max_members} max`}</span>
                </div>
              </div>
              {group.visibility === 'private' && <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-amber-500/10 text-amber-400 border-amber-500/20"><Lock className="w-2.5 h-2.5 mr-0.5" /> Pro</Badge>}
            </div>
            <p className="text-[12px] text-neutral-500 mb-4">{group.description}</p>
            <button className={`text-[12px] h-8 px-4 rounded-xl font-medium transition-colors ${group.visibility === 'private' ? 'border border-amber-500/20 text-amber-400 hover:bg-amber-500/10' : 'bg-emerald-500 hover:bg-emerald-400 text-white'}`}>
              {group.visibility === 'private' ? 'Upgrade to Join' : 'Join Group'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
