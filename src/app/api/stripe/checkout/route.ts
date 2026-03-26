import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

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

    const { challengeId, entryFee } = await request.json()
    if (!challengeId || !entryFee) {
      return NextResponse.json({ error: 'Missing challengeId or entryFee' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', session.user.id)
      .single()

    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || session.user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: session.user.id },
      })
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id)
    }

    // Check for existing entry
    const { data: existing } = await supabase
      .from('entry_payments')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', session.user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already entered this challenge' }, { status: 409 })
    }

    // Get challenge details
    const { data: challenge } = await supabase
      .from('challenges')
      .select('title, status')
      .eq('id', challengeId)
      .single()

    if (!challenge || challenge.status !== 'active') {
      return NextResponse.json({ error: 'Challenge not active' }, { status: 400 })
    }

    // Apply tier discount
    const { data: sub } = await supabase
      .from('profiles')
      .select('membership_tier')
      .eq('id', session.user.id)
      .single()

    let discountPct = 0
    if (sub?.membership_tier === 'pro') discountPct = 10
    if (sub?.membership_tier === 'elite') discountPct = 20
    const finalFee = Math.round(entryFee * (1 - discountPct / 100) * 100) // cents

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_intent_data: {
        // Hold funds in escrow — capture manually after challenge closes
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
          product_data: { name: `Entry Fee: ${challenge.title}` },
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
