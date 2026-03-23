'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Sparkles, Calendar, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'
import { mockProfile } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
  const [name, setName] = useState(mockProfile.full_name)
  const [bio, setBio] = useState(mockProfile.bio || '')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
        <p className="text-[13px] text-zinc-500 mb-8">Manage your account settings.</p>

        {/* Profile header */}
        <div className="rounded-2xl p-6 glass mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/[0.06] flex items-center justify-center">
              <User className="w-8 h-8 text-zinc-500" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{mockProfile.full_name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-[12px] text-zinc-500">
                  <Mail className="w-3 h-3" /> {mockProfile.email}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 rounded-md bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Early Access
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-2xl p-4 glass">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Total Points</span>
            </div>
            <span className="text-2xl font-bold">{mockProfile.total_points}</span>
          </div>
          <div className="rounded-2xl p-4 glass">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] text-zinc-600 font-medium uppercase tracking-wider">Member Since</span>
            </div>
            <span className="text-[14px] font-medium">{formatDistanceToNow(new Date(mockProfile.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] text-zinc-400">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="h-10 bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[13px] text-zinc-400">Bio</Label>
            <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl text-[13px] placeholder:text-zinc-600" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white h-9 px-5 text-[13px] font-semibold rounded-xl transition-colors">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>

        {/* Waitlist status */}
        <div className="mt-8 rounded-2xl p-5 glass glow-blue">
          <h3 className="font-semibold text-[13px] text-blue-400 mb-1">You&apos;re on the waitlist</h3>
          <p className="text-[12px] text-zinc-500 mb-3">You&apos;re exploring in preview mode. When we launch, you&apos;ll get full access to all drops, prizes, and community features.</p>
          <Link href="/signup" className="inline-flex items-center text-[12px] text-blue-400 hover:text-blue-300 font-medium transition-colors gap-1">
            Secure your spot <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
