import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession, getAuthToken, getProfile } from '@/lib/auth/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// POST /api/stripe/subscription — create subscription checkout for Pro/Elite
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tier } = await request.json()
    if (!tier || !['pro', 'elite'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const priceId = tier === 'pro'
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_ELITE_PRICE_ID

    if (!priceId) {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
    }

    const profile = await getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let customerId = profile.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || session.user.email,
        name: profile.full_name || undefined,
        metadata: { user_id: session.user.id },
      })
      customerId = customer.id

      const token = await getAuthToken()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/alt-ai-labs/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?upgrade=cancelled`,
      subscription_data: {
        metadata: {
          user_id: session.user.id,
          tier,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
