import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alt-ai-labs-api.onrender.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const res = await fetch(`${API_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/waitlist`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
