import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession, getAuthToken, getProfile } from '@/lib/auth/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// POST /api/stripe/connect — onboard winner for Stripe Connect payouts
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let connectId = profile.stripe_connect_id

    if (!connectId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile.email || session.user.email,
        metadata: { user_id: session.user.id },
        capabilities: {
          transfers: { requested: true },
        },
      })
      connectId = account.id

      const token = await getAuthToken()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stripe_connect_id: connectId }),
      })
    }

    const accountLink = await stripe.accountLinks.create({
      account: connectId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?connect=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?connect=complete`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error('Connect error:', error)
    return NextResponse.json({ error: 'Failed to create Connect account' }, { status: 500 })
  }
}
