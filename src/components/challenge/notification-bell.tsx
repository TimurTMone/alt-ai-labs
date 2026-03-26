'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=10')
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch {
      // Silently fail — non-critical
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: 'all' }),
      })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {
      // Ignore
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead() }}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500 text-center">No notifications yet</p>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 ${n.read ? '' : 'bg-blue-500/5'}`}
                  >
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    {n.body && <p className="text-xs text-zinc-500 mt-0.5">{n.body}</p>}
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
