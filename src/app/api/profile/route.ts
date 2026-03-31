import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getSession } from '@/lib/supabase/server'

export const dynamic = 'force-static'

// PATCH /api/profile — update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { full_name, bio } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: full_name || undefined,
        bio: bio !== undefined ? bio : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
