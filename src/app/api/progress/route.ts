import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

// POST /api/progress — mark a drop as watched
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { drop_id } = await request.json()
    if (!drop_id) {
      return NextResponse.json({ error: 'drop_id required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('drop_progress')
      .upsert({
        user_id: session.user.id,
        drop_id,
        watched: true,
        watched_at: new Date().toISOString(),
      }, { onConflict: 'user_id,drop_id' })
      .select()
      .single()

    if (error) {
      console.error('Progress error:', error)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Award 5 points for watching (only once)
    const { data: existingPoints } = await supabase
      .from('leaderboard_points')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('reason', `watched:${drop_id}`)
      .single()

    if (!existingPoints) {
      await supabase.from('leaderboard_points').insert({
        user_id: session.user.id,
        points: 5,
        reason: `watched:${drop_id}`,
      })
    }

    return NextResponse.json({ progress: data })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
