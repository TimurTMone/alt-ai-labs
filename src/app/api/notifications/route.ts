import { NextRequest, NextResponse } from 'next/server'
import { getSession, getAuthToken } from '@/lib/auth/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const limit = request.nextUrl.searchParams.get('limit') || '20'

    const res = await fetch(`${API_URL}/api/notifications?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ notifications: [], unreadCount: 0 })
  }
}

// PATCH /api/notifications — mark as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 })
  }
}
