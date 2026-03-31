import { NextRequest, NextResponse } from 'next/server'
import { getSession, getAuthToken } from '@/lib/auth/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// POST /api/progress — proxy to Render backend
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
