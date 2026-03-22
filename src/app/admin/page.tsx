import { Users, Play, Trophy, MessageSquare } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { weeklyDrops, mockPosts, mockLeaderboard } from '@/lib/mock-data'

const stats = [
  { label: 'Total Members', value: '127', icon: Users, color: 'text-blue-400' },
  { label: 'Weekly Drops', value: String(weeklyDrops.length), icon: Play, color: 'text-green-400' },
  { label: 'Submissions', value: String(weeklyDrops.reduce((a, d) => a + d.submissions_count, 0)), icon: Trophy, color: 'text-amber-400' },
  { label: 'Posts', value: String(mockPosts.length), icon: MessageSquare, color: 'text-violet-400' },
]

export default function AdminPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Manage drops, community, and members.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-4 glass">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-neutral-600 font-medium uppercase tracking-wider">{s.label}</span>
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Drops */}
          <div className="rounded-2xl p-5 glass">
            <h2 className="font-semibold text-[14px] mb-4">Weekly Drops</h2>
            <div className="space-y-1">
              {weeklyDrops.map(drop => (
                <div key={drop.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <div className="min-w-0">
                    <p className="text-[13px] truncate">Week {drop.week_number}: {drop.title}</p>
                    <p className="text-[11px] text-neutral-600">{drop.submissions_count} submissions · ${drop.prize_amount} prize</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${drop.status === 'live' ? 'bg-green-500/10 text-green-400' : drop.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/[0.04] text-neutral-600'}`}>
                    {drop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top builders */}
          <div className="rounded-2xl p-5 glass">
            <h2 className="font-semibold text-[14px] mb-4">Top Builders</h2>
            <div className="space-y-2">
              {mockLeaderboard.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center gap-3 py-1.5">
                  <span className={`w-5 text-[12px] font-bold text-center ${entry.rank <= 3 ? 'text-amber-400' : 'text-neutral-600'}`}>{entry.rank}</span>
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <span className="text-[10px] text-neutral-400">{entry.profile.full_name[0]}</span>
                  </div>
                  <span className="text-[13px] flex-1 truncate">{entry.profile.full_name}</span>
                  <span className="text-[11px] font-medium text-neutral-500">{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
