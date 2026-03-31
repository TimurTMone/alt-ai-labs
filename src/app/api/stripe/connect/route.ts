import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

export const dynamic = 'force-static'

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

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id, email')
      .eq('id', session.user.id)
      .single()

    let connectId = profile?.stripe_connect_id

    if (!connectId) {
      // Create Express connected account
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile?.email || session.user.email,
        metadata: { supabase_user_id: session.user.id },
        capabilities: {
          transfers: { requested: true },
        },
      })
      connectId = account.id

      await supabase
        .from('profiles')
        .update({ stripe_connect_id: connectId })
        .eq('id', session.user.id)
    }

    // Create onboarding link
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
