'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LayoutDashboard, Play, MessageSquare, Medal, Users, User, Shield, LogOut, ChevronLeft, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCommunity } from '@/lib/community-context'
import { signOut } from '@/lib/auth/client'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
import { LanguageSwitcher } from './language-switcher'
import { NotificationBell } from '@/components/challenge/notification-bell'

export function MobileNav({ isAdmin }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const community = useCommunity()
  const { t } = useI18n()
  const base = community ? `/c/${community.slug}` : ''

  const navItems = [
    ...(community ? [
      { label: t('nav', 'dashboard'), href: `${base}/dashboard`, icon: LayoutDashboard },
      { label: t('nav', 'drops'), href: `${base}/drops`, icon: Play },
      { label: t('nav', 'classroom'), href: `${base}/classroom`, icon: BookOpen },
      { label: t('nav', 'community'), href: `${base}/community`, icon: MessageSquare },
      { label: t('nav', 'leaderboard'), href: `${base}/leaderboard`, icon: Medal },
      { label: t('nav', 'groups'), href: `${base}/groups`, icon: Users },
    ] : []),
    { label: t('nav', 'profile'), href: '/profile', icon: User },
  ]

  const handleSignOut = () => {
    signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#09090b] sticky top-0 z-50">
      <Link href={community ? `${base}/dashboard` : '/'} className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{community ? community.name[0] : 'A'}</span>
        </div>
        <span className="font-semibold text-white text-sm truncate">{community ? community.name : 'Alt AI Labs'}</span>
      </Link>

      <div className="flex items-center gap-1">
        <NotificationBell />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
        <SheetContent side="right" className="bg-[#09090b] border-white/[0.06] w-72 p-0">
          <nav className="p-4 space-y-1 mt-8">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-2">
              <ChevronLeft className="w-3 h-3" /> All Communities
            </Link>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]')}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              )
            })}
            {isAdmin && community && (
              <Link href={`${base}/admin`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04]">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] w-full">
              <LogOut className="w-4 h-4" /> {t('nav', 'signOut')}
            </button>
            <div className="mt-4 px-3 pt-3 border-t border-white/[0.06]">
              <LanguageSwitcher />
            </div>
          </nav>
        </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
