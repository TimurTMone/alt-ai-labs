export const APP_NAME = 'Alt AI Labs'
export const APP_DESCRIPTION = 'Watch the lesson. Build the challenge. Ship every week.'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Drops', href: '/drops', icon: 'Play' },
  { label: 'Community', href: '/community', icon: 'MessageSquare' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'Medal' },
  { label: 'Groups', href: '/groups', icon: 'Users' },
] as const

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export const DROP_STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  live: 'bg-green-500/10 text-green-400 border-green-500/20',
  completed: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
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

export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Access to free weekly drops',
      'Join public community',
      'Submit to free challenges',
      'Leaderboard access',
    ],
  },
  paid: {
    name: 'Pro Builder',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '',
    features: [
      'All weekly drops unlocked',
      'Access to paid challenges',
      'Eligible for cash prizes',
      'Private groups access',
      'Templates & starter repos',
      'Past drop archives',
      'Priority support',
    ],
  },
} as const
