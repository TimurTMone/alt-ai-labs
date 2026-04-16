-- ═══════════════════════════════════════════════════════════════
-- Alt AI Labs — Complete Database Schema (Render PostgreSQL)
-- Run once to bootstrap. Idempotent (IF NOT EXISTS everywhere).
-- ═══════════════════════════════════════════════════════════════

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  membership_tier VARCHAR(20) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_connect_id VARCHAR(255),
  is_admin BOOLEAN DEFAULT false,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities
CREATE TABLE IF NOT EXISTS communities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  accent_color VARCHAR(50),
  owner_id VARCHAR(50),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drops (challenges)
CREATE TABLE IF NOT EXISTS drops (
  id VARCHAR(50) PRIMARY KEY,
  community_id VARCHAR(50) REFERENCES communities(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  is_free BOOLEAN DEFAULT true,
  challenge_brief TEXT,
  challenge_deliverables JSONB DEFAULT '[]',
  challenge_rules JSONB DEFAULT '[]',
  challenge_deadline TIMESTAMPTZ,
  prize_description TEXT,
  prize_amount NUMERIC DEFAULT 0,
  prize_per_entrant NUMERIC DEFAULT 0,
  min_entrants_for_prize INTEGER DEFAULT 0,
  creator_name VARCHAR(255),
  creator_avatar_url TEXT,
  creator_url TEXT,
  sponsor_name VARCHAR(255),
  sponsor_logo_url TEXT,
  sponsor_url TEXT,
  status VARCHAR(20) DEFAULT 'upcoming',
  submissions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  drop_id VARCHAR(50) REFERENCES drops(id),
  project_url TEXT NOT NULL,
  demo_url TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'submitted',
  score NUMERIC,
  feedback TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drop_id)
);

-- Leaderboard points
CREATE TABLE IF NOT EXISTS leaderboard_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id VARCHAR(50) REFERENCES communities(id),
  user_id UUID REFERENCES profiles(id),
  points INTEGER NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop progress
CREATE TABLE IF NOT EXISTS drop_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  drop_id VARCHAR(50) REFERENCES drops(id),
  watched BOOLEAN DEFAULT false,
  watched_at TIMESTAMPTZ,
  submitted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  UNIQUE(user_id, drop_id)
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id VARCHAR(50) REFERENCES communities(id),
  user_id UUID REFERENCES profiles(id),
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(20) DEFAULT 'builds',
  drop_id VARCHAR(50) REFERENCES drops(id),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id VARCHAR(50) REFERENCES communities(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(20) DEFAULT 'public',
  cover_image_url TEXT,
  max_members INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, slug)
);

-- Group members
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freeze_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily activity log (for heatmap + streak tracking)
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type VARCHAR(50) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date, activity_type)
);

-- ═══════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_drops_community ON drops(community_id);
CREATE INDEX IF NOT EXISTS idx_drops_status ON drops(status);
CREATE INDEX IF NOT EXISTS idx_drops_slug ON drops(slug);
CREATE INDEX IF NOT EXISTS idx_submissions_drop ON submissions(drop_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_community ON leaderboard_points(community_id);
CREATE INDEX IF NOT EXISTS idx_drop_progress_user ON drop_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_community ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_groups_community ON groups(community_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_streaks_user ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
