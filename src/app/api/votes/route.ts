import { NextRequest, NextResponse } from 'next/server'
import { getSession, getAuthToken } from '@/lib/auth/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// POST /api/votes — proxy to Render backend
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/votes`, {
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
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}

// DELETE /api/votes
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = await getAuthToken()
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/votes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Unvote error:', error)
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
  }
}
