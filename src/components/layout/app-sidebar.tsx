'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Play, MessageSquare, Medal, Users, User, Shield, LogOut, ChevronLeft, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCommunity } from '@/lib/community-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AppSidebarProps {
  isAdmin?: boolean
  className?: string
}

export function AppSidebar({ isAdmin, className }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const community = useCommunity()
  const base = community ? `/c/${community.slug}` : ''

  const navItems = community ? [
    { label: 'Dashboard', href: `${base}/dashboard`, icon: LayoutDashboard },
    { label: 'Weekly Drops', href: `${base}/drops`, icon: Play },
    { label: 'Classroom', href: `${base}/classroom`, icon: BookOpen },
    { label: 'Community', href: `${base}/community`, icon: MessageSquare },
    { label: 'Leaderboard', href: `${base}/leaderboard`, icon: Medal },
    { label: 'Groups', href: `${base}/groups`, icon: Users },
  ] : []

  const handleSignOut = async () => {
    document.cookie = 'demo_mode=; path=/; max-age=0'
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className={cn('flex flex-col w-[260px] border-r border-white/[0.06] bg-[#09090b] h-screen sticky top-0', className)}>
      <div className="px-5 h-16 flex items-center border-b border-white/[0.06]">
        <Link href={community ? `${base}/dashboard` : '/'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{community ? community.name[0] : 'A'}</span>
          </div>
          <span className="font-semibold text-[15px] text-white tracking-tight truncate">{community ? community.name : 'Alt AI Labs'}</span>
        </Link>
      </div>

      <div className="px-3 pt-3 pb-1">
        <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
          <ChevronLeft className="w-3 h-3" /> All Communities
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 space-y-0.5 border-t border-white/[0.06]">
        {isAdmin && community && (
          <Link href={`${base}/admin`} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150', pathname.startsWith(`${base}/admin`) ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]')}>
            <Shield className="w-[18px] h-[18px]" /> Admin
          </Link>
        )}
        <Link href="/profile" className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150', pathname === '/profile' ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]')}>
          <User className="w-[18px] h-[18px]" /> Profile
        </Link>
        <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all duration-150 w-full">
          <LogOut className="w-[18px] h-[18px]" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
