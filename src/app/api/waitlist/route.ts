import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if already on waitlist
    const exists = await kv.sismember('waitlist', normalizedEmail)
    if (exists) {
      return NextResponse.json({ message: "You're already on the list!" })
    }

    // Add to waitlist set + store timestamp
    await kv.sadd('waitlist', normalizedEmail)
    await kv.hset('waitlist:details', {
      [normalizedEmail]: JSON.stringify({
        email: normalizedEmail,
        joined_at: new Date().toISOString(),
      }),
    })

    // Get total count
    const count = await kv.scard('waitlist')

    return NextResponse.json({ message: "You're in!", count })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const count = await kv.scard('waitlist')
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
