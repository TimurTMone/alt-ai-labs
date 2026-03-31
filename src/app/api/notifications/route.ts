import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

export const dynamic = 'force-static'

// GET /api/notifications — get user's notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Count unread
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('read', false)

    return NextResponse.json({ notifications: data, unreadCount: count || 0 })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids } = await request.json() // array of notification IDs, or 'all'
    const supabase = await createServerSupabaseClient()

    if (ids === 'all') {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false)
    } else if (Array.isArray(ids)) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', ids)
        .eq('user_id', session.user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
