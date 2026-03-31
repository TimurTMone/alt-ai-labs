export const APP_NAME = 'Alt AI Labs'
export const APP_DESCRIPTION = 'Watch the lesson. Build the challenge. Ship it.'

// ── Default community (used across pages that reference the primary community) ──
export const DEFAULT_COMMUNITY_ID = 'community-001'
export const DEFAULT_COMMUNITY_SLUG = 'alt-ai-labs'

// ── Demo / Preview mode ─────────────────────────────────────────
// Max age in seconds (24 hours). Cookie expires automatically.
export const DEMO_MODE_MAX_AGE = 86400
export const DEMO_MODE_COOKIE = 'demo_mode'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Drops', href: '/drops', icon: 'Play' },
  { label: 'Community', href: '/community', icon: 'MessageSquare' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'Medal' },
  { label: 'Groups', href: '/groups', icon: 'Users' },
] as const

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export const DROP_STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  live: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export const POST_CATEGORIES = [
  { value: 'wins', label: 'Wins' },
  { value: 'questions', label: 'Questions' },
  { value: 'builds', label: 'Builds' },
  { value: 'announcements', label: 'Announcements' },
] as const

export const POINTS_CONFIG = {
  video_watched: 5,
  challenge_submitted: 25,
  challenge_winner_1st: 100,
  challenge_winner_2nd: 50,
  challenge_winner_3rd: 25,
  post_created: 5,
  comment_created: 2,
} as const

export const BUILDER_LEVELS = [
  { level: 1, name: 'Freshman', minPoints: 0, color: 'text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/20', emoji: '🌱' },
  { level: 2, name: 'Junior', minPoints: 50, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', emoji: '⚡' },
  { level: 3, name: 'Senior', minPoints: 120, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', emoji: '🔷' },
  { level: 4, name: 'Pro', minPoints: 200, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', emoji: '✅' },
  { level: 5, name: 'Expert', minPoints: 300, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', emoji: '🎯' },
  { level: 6, name: 'Master', minPoints: 450, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', emoji: '🏆' },
  { level: 7, name: 'Grandmaster', minPoints: 650, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', emoji: '👑' },
  { level: 8, name: 'Legend', minPoints: 900, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', emoji: '🔥' },
  { level: 9, name: 'Boss', minPoints: 1200, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', emoji: '💎' },
] as const

export function getBuilderLevel(points: number) {
  let currentIdx = 0
  for (let i = 0; i < BUILDER_LEVELS.length; i++) {
    if (points >= BUILDER_LEVELS[i].minPoints) currentIdx = i
    else break
  }
  const current = BUILDER_LEVELS[currentIdx]
  const nextLevel = currentIdx + 1 < BUILDER_LEVELS.length ? BUILDER_LEVELS[currentIdx + 1] : null
  const progressToNext = nextLevel
    ? ((points - current.minPoints) / (nextLevel.minPoints - current.minPoints)) * 100
    : 100
  return { ...current, points, nextLevel, progressToNext: Math.min(progressToNext, 100) }
}

export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    tier: 'free' as const,
    earlyAccessHours: 0,
    entryDiscount: 0,
    features: [
      'Access to free drops',
      'Join public community',
      'Submit to free challenges',
      'Leaderboard access',
    ],
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    tier: 'pro' as const,
    earlyAccessHours: 24,
    entryDiscount: 10,
    features: [
      'All drops unlocked',
      'Access to paid challenges',
      'Eligible for cash prizes',
      '24hr early access to new drops',
      '10% entry fee discount',
      'Private groups access',
    ],
  },
  elite: {
    name: 'Elite',
    price: 24.99,
    tier: 'elite' as const,
    earlyAccessHours: 48,
    entryDiscount: 20,
    features: [
      'Everything in Pro',
      '48hr early access to new drops',
      '20% entry fee discount',
      'Templates & starter repos',
      'Past drop archives',
      'Priority support',
      'Judge nomination eligibility',
    ],
  },
} as const

export const PLATFORM_FEE_PCT = 15

// ── Prize Pool ──────────────────────────────────────────────────
// Pool is funded by Pro subscription revenue — creator never pays out of pocket.
// Each Pro participant entering a challenge adds to the pool.
// Pool only activates once minimum entrants threshold is met.
// Split: 1st = 60%, 2nd = 25%, 3rd = 15%

export const PRIZE_SPLIT = [
  { place: 1, label: '1st', pct: 60, emoji: '🥇' },
  { place: 2, label: '2nd', pct: 25, emoji: '🥈' },
  { place: 3, label: '3rd', pct: 15, emoji: '🥉' },
] as const

export function calculatePrizePool(entrants: number, perEntrant: number, minEntrants: number) {
  const currentPool = entrants * perEntrant
  const isActive = entrants >= minEntrants
  const targetPool = minEntrants * perEntrant
  const progress = Math.min((entrants / minEntrants) * 100, 100)
  const remainingToActivate = Math.max(minEntrants - entrants, 0)

  return {
    currentPool,
    targetPool,
    isActive,
    progress,
    entrants,
    minEntrants,
    remainingToActivate,
    split: isActive ? PRIZE_SPLIT.map(s => ({
      ...s,
      amount: Math.round(currentPool * s.pct / 100),
    })) : null,
  }
}
