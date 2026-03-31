import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// Helper to call Render backend with service-level operations
async function backendPost(path: string, body: Record<string, unknown>) {
  try {
    await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error(`Backend call failed: ${path}`, err)
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const meta = session.metadata

      if (meta?.type === 'entry_fee' && meta.challenge_id && meta.user_id) {
        await backendPost('/api/webhooks/entry-payment', {
          challenge_id: meta.challenge_id,
          user_id: meta.user_id,
          stripe_payment_intent: session.payment_intent as string,
          amount: (session.amount_total || 0) / 100,
        })
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id || sub.metadata?.supabase_user_id
      const tier = sub.metadata?.tier as 'pro' | 'elite'
      if (!userId || !tier) break

      await backendPost('/api/webhooks/subscription', {
        user_id: userId,
        tier,
        stripe_subscription_id: sub.id,
        status: sub.status,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.user_id || sub.metadata?.supabase_user_id
      if (!userId) break

      await backendPost('/api/webhooks/subscription-cancelled', {
        user_id: userId,
        stripe_subscription_id: sub.id,
      })
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const pi = charge.payment_intent as string
      if (pi) {
        await backendPost('/api/webhooks/refund', {
          stripe_payment_intent: pi,
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
