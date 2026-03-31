import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

export const dynamic = 'force-static'

// POST /api/submissions — create or update a submission
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { drop_id, github_url, live_url, demo_video_url, description, attachments } = await request.json()

    if (!drop_id || !github_url) {
      return NextResponse.json({ error: 'drop_id and github_url are required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Check drop exists and is live
    const { data: drop } = await supabase
      .from('weekly_drops')
      .select('id, status, challenge_deadline')
      .eq('id', drop_id)
      .single()

    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 })
    }

    if (drop.status !== 'live') {
      return NextResponse.json({ error: 'Drop is not accepting submissions' }, { status: 400 })
    }

    if (drop.challenge_deadline && new Date(drop.challenge_deadline) < new Date()) {
      return NextResponse.json({ error: 'Submission deadline has passed' }, { status: 400 })
    }

    // Upsert submission (allows editing until deadline)
    const { data, error } = await supabase
      .from('drop_submissions')
      .upsert({
        drop_id,
        user_id: session.user.id,
        github_url,
        live_url: live_url || null,
        demo_video_url: demo_video_url || null,
        description: description || null,
        attachments: attachments || [],
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,drop_id' })
      .select()
      .single()

    if (error) {
      console.error('Submission error:', error)
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
    }

    // Award points for submission (only on first submit)
    const { data: existingPoints } = await supabase
      .from('leaderboard_points')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('reason', `submission:${drop_id}`)
      .single()

    if (!existingPoints) {
      await supabase.from('leaderboard_points').insert({
        user_id: session.user.id,
        points: 25,
        reason: `submission:${drop_id}`,
      })

      // Update total points on profile
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', session.user.id)
        .single()

      if (currentProfile) {
        await supabase
          .from('profiles')
          .update({ total_points: (currentProfile.total_points || 0) + 25 })
          .eq('id', session.user.id)
      }
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/submissions?drop_id=xxx — get user's submission for a drop
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dropId = request.nextUrl.searchParams.get('drop_id')
    if (!dropId) {
      return NextResponse.json({ error: 'drop_id required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('drop_submissions')
      .select('*')
      .eq('drop_id', dropId)
      .eq('user_id', session.user.id)
      .single()

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('Get submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
