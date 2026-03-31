import { NextRequest, NextResponse } from 'next/server'
import { getSession, getAuthToken } from '@/lib/auth/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// POST /api/judge — proxy to Render backend
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/judge`, {
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
    console.error('Judge score error:', error)
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 })
  }
}

// GET /api/judge?challengeId=xxx
export async function GET(request: NextRequest) {
  try {
    const challengeId = request.nextUrl.searchParams.get('challengeId')
    if (!challengeId) {
      return NextResponse.json({ error: 'Missing challengeId' }, { status: 400 })
    }

    const token = await getAuthToken()

    const res = await fetch(`${API_URL}/api/judge?challengeId=${challengeId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 })
  }
}
