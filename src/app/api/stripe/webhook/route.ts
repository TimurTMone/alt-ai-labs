import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-static'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const supabase = getSupabase()
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
    // ── Entry fee payment ──────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const meta = session.metadata

      if (meta?.type === 'entry_fee' && meta.challenge_id && meta.user_id) {
        // Record escrow payment
        await supabase.from('entry_payments').insert({
          challenge_id: meta.challenge_id,
          user_id: meta.user_id,
          stripe_payment_intent: session.payment_intent as string,
          amount: (session.amount_total || 0) / 100,
          status: 'held',
        })

        // Notify user
        await supabase.from('notifications').insert({
          user_id: meta.user_id,
          type: 'entry_confirmed',
          title: 'Entry Confirmed',
          body: 'Your entry fee has been received. Submit your project before the deadline!',
          data: { challenge_id: meta.challenge_id },
        })
      }
      break
    }

    // ── Subscription created / updated ─────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      const tier = sub.metadata?.tier as 'pro' | 'elite'
      if (!userId || !tier) break

      // Upsert subscription record
      const item = sub.items.data[0]
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        stripe_price_id: item?.price.id,
        tier,
        status: sub.status === 'active' ? 'active' : sub.status === 'trialing' ? 'trialing' : 'past_due',
        current_period_start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
        current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end,
      }, { onConflict: 'stripe_subscription_id' })

      // Update profile tier
      await supabase
        .from('profiles')
        .update({ membership_tier: tier })
        .eq('id', userId)

      break
    }

    // ── Subscription cancelled ─────────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      if (!userId) break

      await supabase.from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id)

      await supabase
        .from('profiles')
        .update({ membership_tier: 'free' })
        .eq('id', userId)

      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'subscription_cancelled',
        title: 'Subscription Cancelled',
        body: 'Your subscription has ended. You can resubscribe anytime.',
      })
      break
    }

    // ── Payout transfer completed ──────────────────────────
    case 'transfer.updated': {
      const transfer = event.data.object as Stripe.Transfer
      const distId = transfer.metadata?.distribution_id
      if (distId) {
        await supabase.from('prize_distributions')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', distId)
      }
      break
    }

    // ── Refund for cancelled challenge ─────────────────────
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const pi = charge.payment_intent as string
      if (pi) {
        await supabase.from('entry_payments')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent', pi)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
