import { NextRequest, NextResponse } from 'next/server'
import { getSession, getAuthToken } from '@/lib/auth/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// POST /api/submissions — proxy to Render backend
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/submissions`, {
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
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/submissions?drop_id=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const dropId = request.nextUrl.searchParams.get('drop_id')

    const res = await fetch(`${API_URL}/api/submissions?drop_id=${dropId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Get submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
