export interface Community {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  accent_color: string
  owner_id: string
  member_count: number
  created_at: string
}

export type MembershipTier = 'free' | 'paid'
export type DropStatus = 'live' | 'upcoming' | 'completed'
export type SubmissionStatus = 'submitted' | 'reviewed' | 'winner'
export type PostCategory = 'wins' | 'questions' | 'builds' | 'announcements'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type GroupVisibility = 'public' | 'private'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  membership_tier: MembershipTier
  stripe_customer_id: string | null
  is_admin: boolean
  total_points: number
  created_at: string
  updated_at: string
}

// The core unit: you drop a video + challenge together each week
export interface WeeklyDrop {
  id: string
  community_id: string
  week_number: number
  title: string
  slug: string
  description: string
  // The lesson/video
  video_url: string | null
  thumbnail_url: string | null
  duration_minutes: number
  difficulty: Difficulty
  is_free: boolean
  // The challenge (tied to this drop)
  challenge_brief: string
  challenge_deliverables: string[]
  challenge_rules: string[]
  challenge_deadline: string
  prize_description: string | null
  prize_amount: number
  // Prize pool mechanics — funded by Pro subscriptions, never out of pocket
  prize_per_entrant: number        // $ added to pool per Pro participant
  min_entrants_for_prize: number   // minimum Pro participants to activate pool
  // Creator
  creator_name: string | null
  creator_avatar_url: string | null
  creator_url: string | null
  // Sponsor
  sponsor_name: string | null
  sponsor_logo_url: string | null
  sponsor_url: string | null
  // State
  status: DropStatus
  submissions_count: number
  created_at: string
  updated_at: string
}

// User's progress on a drop
export interface DropProgress {
  id: string
  user_id: string
  drop_id: string
  watched: boolean
  watched_at: string | null
  submitted: boolean
  submitted_at: string | null
}

export interface ChallengeSubmission {
  id: string
  drop_id: string
  user_id: string
  project_url: string
  demo_url: string | null
  notes: string | null
  status: SubmissionStatus
  score: number | null
  feedback: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Post {
  id: string
  community_id: string
  user_id: string
  title: string
  body: string
  category: PostCategory
  drop_id: string | null  // optionally tied to a drop
  likes_count: number
  comments_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  profile?: Profile
}

export interface LeaderboardEntry {
  id: string
  community_id: string
  user_id: string
  points: number
  reason: string
  created_at: string
  profile?: Profile
}

export interface Group {
  id: string
  community_id: string
  name: string
  slug: string
  description: string
  visibility: GroupVisibility
  cover_image_url: string | null
  max_members: number | null
  created_at: string
  _count?: { group_members: number }
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: 'member' | 'admin'
  joined_at: string
  profile?: Profile
}
