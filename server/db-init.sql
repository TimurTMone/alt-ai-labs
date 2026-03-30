-- Alt AI Labs — Database Schema (Render PostgreSQL)

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

-- Weekly Drops (Challenges)
CREATE TABLE IF NOT EXISTS weekly_drops (
  id VARCHAR(50) PRIMARY KEY,
  community_id VARCHAR(50) REFERENCES communities(id),
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  is_free BOOLEAN DEFAULT true,
  challenge_brief TEXT,
  challenge_deliverables TEXT[] DEFAULT '{}',
  challenge_rules TEXT[] DEFAULT '{}',
  challenge_deadline TIMESTAMPTZ,
  prize_description TEXT,
  prize_amount NUMERIC DEFAULT 0,
  prize_per_entrant NUMERIC DEFAULT 0,
  min_entrants_for_prize INTEGER DEFAULT 0,
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
  drop_id VARCHAR(50) REFERENCES weekly_drops(id),
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
  drop_id VARCHAR(50) REFERENCES weekly_drops(id),
  watched BOOLEAN DEFAULT false,
  watched_at TIMESTAMPTZ,
  submitted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  UNIQUE(user_id, drop_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_weekly_drops_community ON weekly_drops(community_id);
CREATE INDEX IF NOT EXISTS idx_weekly_drops_status ON weekly_drops(status);
CREATE INDEX IF NOT EXISTS idx_submissions_drop ON submissions(drop_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_community ON leaderboard_points(community_id);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(total_points DESC);

-- Seed: Default community
INSERT INTO communities (id, name, slug, description, accent_color, owner_id, member_count)
VALUES ('community-001', 'Alt AI Labs', 'alt-ai-labs', 'Learn AI by building real products. Weekly drops, challenges, and cash prizes.', 'green', 'admin', 127)
ON CONFLICT (id) DO NOTHING;

-- Seed: Sponsored challenges
INSERT INTO weekly_drops (id, community_id, week_number, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, sponsor_name, sponsor_url, status, submissions_count)
VALUES
  ('drop-001', 'community-001', 1, '5 AI Workflows That Actually Sell in 2026', '5-ai-workflows-that-sell',
   'I built 500 AI workflows, and these are the 5 that actually sell in 2026.',
   'https://www.youtube.com/embed/Y3PcRp5RFzk', 14, 'beginner', true,
   'Watch the video and build an AI Sales Agent using VSCode + Claude.',
   ARRAY['Working AI workflow prototype', 'Demo video or live URL', 'GitHub repo', 'Writeup'],
   ARRAY['Must use Claude API or Claude Code', 'Build one of the 5 workflows', 'Submit before deadline'],
   NOW() + INTERVAL '6 days', 'Sponsored by AITIM HOLDING', 500,
   'AITIM HOLDING', 'https://aitim.holding', 'live', 7),

  ('drop-002', 'community-001', 2, 'AI for Content Creation', 'ai-for-content-creation',
   'Learn how to use AI to create, repurpose, and scale content across platforms.',
   'https://www.youtube.com/embed/tW40b122Rbs', 20, 'intermediate', true,
   'Build an AI-powered content creation system that repurposes content into multiple formats.',
   ARRAY['Working content tool', 'Demo showing input to multiple outputs', 'GitHub repo', 'Writeup'],
   ARRAY['Must produce 3+ content formats', 'Any AI API allowed', 'Submit before deadline'],
   NOW() + INTERVAL '13 days', 'Sponsored by AITIM HOLDING', 500,
   'AITIM HOLDING', 'https://aitim.holding', 'live', 3),

  ('drop-003', 'community-001', 3, 'Build a Website with AI', 'build-a-website-with-ai',
   'Use AI tools to design and build a complete, production-ready website from scratch.',
   'https://www.youtube.com/embed/86HM0RUWhCk', 25, 'beginner', true,
   'Build a professional website using AI. Deploy it live.',
   ARRAY['Live deployed URL', 'Screen recording', 'GitHub repo', 'Writeup'],
   ARRAY['Must use AI in build process', 'Must be deployed', 'Submit before deadline'],
   NOW() + INTERVAL '20 days', 'Sponsored by AITIM HOLDING', 500,
   'AITIM HOLDING', 'https://aitim.holding', 'upcoming', 0),

  ('drop-009', 'community-001', 9, 'Zero-Code $10M AI Business Blueprint', 'zero-code-10m-ai-business',
   'Watch Dan Martell break down how to build a $10M solo AI business with zero code — then prove it by launching your own AI micro-business in 7 days.',
   'https://www.youtube.com/embed/w-XPlC3a2oI', 18, 'intermediate', true,
   'Launch a real AI micro-business in 7 days using only no-code tools + AI. Get at least 1 paying customer or 10 waitlist signups.',
   ARRAY['Live landing page', 'Proof of customer traction', 'Full stack breakdown', '60-second video pitch', 'Build process doc'],
   ARRAY['Must use AI as core product', 'No custom code — no-code only', 'Must have live URL', 'Must show customer interaction proof', 'Submit before deadline'],
   NOW() + INTERVAL '62 days', 'Sponsored by AITIM HOLDING', 500,
   'AITIM HOLDING', 'https://aitim.holding', 'upcoming', 0),

  ('drop-010', 'community-001', 10, 'The AI Skills Gauntlet — Master All 9', 'ai-skills-gauntlet-master-all-9',
   'Dan Martell says 9 AI skills put you ahead of 99% of people. Prove you have them — build a project that showcases at least 5 in one shot.',
   'https://www.youtube.com/embed/BuwPnrMmhzQ', 15, 'advanced', true,
   'Build ONE project that demonstrates at least 5 of the 9 AI skills Dan Martell identified. The most creative combo wins.',
   ARRAY['Working project', 'Skill scorecard', 'Architecture diagram', 'Source code or stack breakdown', 'Teach-it guide'],
   ARRAY['Must demonstrate 5+ of 9 skills', 'Must include self-assessment scorecard', 'Any tech stack allowed', 'Must include teach component', 'Submit before deadline'],
   NOW() + INTERVAL '69 days', 'Sponsored by AITIM HOLDING', 500,
   'AITIM HOLDING', 'https://aitim.holding', 'upcoming', 0)
ON CONFLICT (id) DO NOTHING;
