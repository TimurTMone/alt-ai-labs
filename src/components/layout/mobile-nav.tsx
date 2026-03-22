'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LayoutDashboard, Play, MessageSquare, Medal, Users, User, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Weekly Drops', href: '/drops', icon: Play },
  { label: 'Community', href: '/community', icon: MessageSquare },
  { label: 'Leaderboard', href: '/leaderboard', icon: Medal },
  { label: 'Groups', href: '/groups', icon: Users },
  { label: 'Profile', href: '/profile', icon: User },
]

export function MobileNav({ isAdmin }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    document.cookie = 'demo_mode=; path=/; max-age=0'
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <span className="text-xs font-bold text-black">A</span>
        </div>
        <span className="font-semibold text-white text-sm">Alt AI Labs</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-neutral-400">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-neutral-950 border-neutral-800 w-72 p-0">
          <nav className="p-4 space-y-1 mt-8">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5')}>
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              )
            })}
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 w-full">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
