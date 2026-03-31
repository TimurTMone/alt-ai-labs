import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSession, getAuthToken, getProfile } from '@/lib/auth/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// POST /api/stripe/checkout — create entry fee checkout session
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

    const { challengeId, entryFee } = await request.json()
    if (!challengeId || !entryFee) {
      return NextResponse.json({ error: 'Missing challengeId or entryFee' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || session.user.email,
        name: profile.full_name || undefined,
        metadata: { user_id: session.user.id },
      })
      customerId = customer.id

      // Update profile with Stripe customer ID via Render backend
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

    // Apply tier discount
    let discountPct = 0
    if (profile.membership_tier === 'pro') discountPct = 10
    if (profile.membership_tier === 'elite') discountPct = 20
    const finalFee = Math.round(entryFee * (1 - discountPct / 100) * 100)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual',
        metadata: {
          challenge_id: challengeId,
          user_id: session.user.id,
          type: 'entry_fee',
        },
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Entry Fee` },
          unit_amount: finalFee,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/alt-ai-labs/drops?entry=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/alt-ai-labs/drops?entry=cancelled`,
      metadata: {
        challenge_id: challengeId,
        user_id: session.user.id,
        type: 'entry_fee',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
