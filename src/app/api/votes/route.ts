import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

export const dynamic = 'force-static'

// POST /api/votes — cast a community vote (1 per user per challenge)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeId, entryId } = await request.json()
    if (!challengeId || !entryId) {
      return NextResponse.json({ error: 'Missing challengeId or entryId' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Verify challenge is in voting phase
    const { data: challenge } = await supabase
      .from('challenges')
      .select('status')
      .eq('id', challengeId)
      .single()

    if (!challenge || challenge.status !== 'voting') {
      return NextResponse.json({ error: 'Challenge is not in voting phase' }, { status: 400 })
    }

    // Prevent self-voting
    const { data: entry } = await supabase
      .from('challenge_submissions')
      .select('user_id')
      .eq('id', entryId)
      .single()

    if (entry?.user_id === session.user.id) {
      return NextResponse.json({ error: 'Cannot vote for your own entry' }, { status: 403 })
    }

    // Insert vote (unique constraint handles duplicates)
    const { error } = await supabase.from('votes').insert({
      challenge_id: challengeId,
      entry_id: entryId,
      user_id: session.user.id,
    })

    if (error) {
      if (error.code === '23505') { // unique violation
        return NextResponse.json({ error: 'Already voted in this challenge' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}

// DELETE /api/votes — remove vote
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeId } = await request.json()
    const supabase = await createServerSupabaseClient()

    await supabase.from('votes')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unvote error:', error)
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
  }
}
