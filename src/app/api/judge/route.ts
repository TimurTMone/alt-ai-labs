import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

const PLATFORM_FEE_PCT = 15

// POST /api/judge — submit judge score (1-10)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // Verify user is a judge
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'judge' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only judges can score' }, { status: 403 })
    }

    const { entryId, challengeId, score, feedback } = await request.json()
    if (!entryId || !challengeId || !score || score < 1 || score > 10) {
      return NextResponse.json({ error: 'Invalid score (must be 1-10)' }, { status: 400 })
    }

    const { error } = await supabase.from('judge_scores').upsert({
      challenge_id: challengeId,
      entry_id: entryId,
      judge_id: session.user.id,
      score,
      feedback: feedback || null,
    }, { onConflict: 'entry_id,judge_id' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Judge score error:', error)
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 })
  }
}

// GET /api/judge?challengeId=xxx — get hybrid leaderboard for a challenge
export async function GET(request: NextRequest) {
  try {
    const challengeId = request.nextUrl.searchParams.get('challengeId')
    if (!challengeId) {
      return NextResponse.json({ error: 'Missing challengeId' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Get all approved entries for this challenge
    const { data: entries } = await supabase
      .from('challenge_submissions')
      .select('id, user_id, project_url, notes, created_at')
      .eq('challenge_id', challengeId)
      .eq('status', 'approved')

    if (!entries?.length) {
      return NextResponse.json({ entries: [] })
    }

    // Get vote counts per entry
    const { data: votes } = await supabase
      .from('votes')
      .select('entry_id')
      .eq('challenge_id', challengeId)

    const voteCounts: Record<string, number> = {}
    votes?.forEach(v => {
      voteCounts[v.entry_id] = (voteCounts[v.entry_id] || 0) + 1
    })

    // Get judge scores per entry
    const { data: scores } = await supabase
      .from('judge_scores')
      .select('entry_id, score')
      .eq('challenge_id', challengeId)

    const judgeAvgs: Record<string, number> = {}
    const judgeCounts: Record<string, number> = {}
    scores?.forEach(s => {
      judgeAvgs[s.entry_id] = (judgeAvgs[s.entry_id] || 0) + s.score
      judgeCounts[s.entry_id] = (judgeCounts[s.entry_id] || 0) + 1
    })
    Object.keys(judgeAvgs).forEach(id => {
      judgeAvgs[id] = judgeAvgs[id] / judgeCounts[id]
    })

    // Calculate hybrid score: 50% community + 50% judge (normalized to 0-100)
    const totalVotes = Math.max(Object.values(voteCounts).reduce((a, b) => a + b, 0), 1)
    const ranked = entries.map(entry => {
      const communityScore = ((voteCounts[entry.id] || 0) / totalVotes) * 100
      const judgeScore = (judgeAvgs[entry.id] || 0) * 10 // 1-10 → 0-100
      const hybridScore = communityScore * 0.5 + judgeScore * 0.5

      return {
        ...entry,
        votes: voteCounts[entry.id] || 0,
        judgeAvg: judgeAvgs[entry.id] || 0,
        communityScore: Math.round(communityScore * 10) / 10,
        judgeScoreNorm: Math.round(judgeScore * 10) / 10,
        hybridScore: Math.round(hybridScore * 10) / 10,
      }
    }).sort((a, b) => b.hybridScore - a.hybridScore)

    return NextResponse.json({ entries: ranked, platformFeePct: PLATFORM_FEE_PCT })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 })
  }
}
