-- =============================================================================
-- Migration 002: Communities, Weekly Drops, Drop Progress, Submissions
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Communities table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS communities (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  slug         text UNIQUE NOT NULL,
  description  text,
  logo_url     text,
  accent_color text DEFAULT 'blue',
  owner_id     uuid REFERENCES profiles(id),
  member_count integer DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are viewable by everyone" ON communities FOR SELECT USING (true);
CREATE POLICY "Admins can manage communities" ON communities FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ---------------------------------------------------------------------------
-- Weekly Drops table (the core unit: video lesson + challenge per week)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_drops (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id           text REFERENCES communities(id) ON DELETE CASCADE,
  week_number            integer NOT NULL,
  title                  text NOT NULL,
  slug                   text NOT NULL,
  description            text,
  video_url              text,
  thumbnail_url          text,
  duration_minutes       integer DEFAULT 30,
  difficulty             text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_free                boolean DEFAULT true,
  challenge_brief        text,
  challenge_deliverables jsonb DEFAULT '[]',
  challenge_rules        jsonb DEFAULT '[]',
  challenge_deadline     timestamptz,
  prize_description      text,
  prize_amount           numeric DEFAULT 0,
  prize_per_entrant      numeric DEFAULT 0,
  min_entrants_for_prize integer DEFAULT 5,
  status                 text DEFAULT 'upcoming' CHECK (status IN ('live', 'upcoming', 'completed')),
  submissions_count      integer DEFAULT 0,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now(),
  UNIQUE (community_id, slug)
);

CREATE INDEX idx_weekly_drops_community ON weekly_drops(community_id);
CREATE INDEX idx_weekly_drops_slug ON weekly_drops(slug);
CREATE INDEX idx_weekly_drops_status ON weekly_drops(status);

ALTER TABLE weekly_drops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drops are viewable by everyone" ON weekly_drops FOR SELECT USING (true);
CREATE POLICY "Admins can manage drops" ON weekly_drops FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ---------------------------------------------------------------------------
-- Drop Progress (tracks watched + submitted per user per drop)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drop_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  drop_id      uuid REFERENCES weekly_drops(id) ON DELETE CASCADE,
  watched      boolean DEFAULT false,
  watched_at   timestamptz,
  submitted    boolean DEFAULT false,
  submitted_at timestamptz,
  UNIQUE (user_id, drop_id)
);

CREATE INDEX idx_drop_progress_user ON drop_progress(user_id);
CREATE INDEX idx_drop_progress_drop ON drop_progress(drop_id);

ALTER TABLE drop_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON drop_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON drop_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON drop_progress FOR UPDATE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Drop Submissions (user submissions for weekly drops)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drop_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id         uuid REFERENCES weekly_drops(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  github_url      text NOT NULL,
  live_url        text,
  demo_video_url  text,
  description     text,
  attachments     jsonb DEFAULT '[]',
  status          text DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'winner')),
  score           integer,
  feedback        text,
  is_featured     boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, drop_id)
);

CREATE INDEX idx_drop_submissions_drop ON drop_submissions(drop_id);
CREATE INDEX idx_drop_submissions_user ON drop_submissions(user_id);

ALTER TABLE drop_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions are viewable by everyone" ON drop_submissions FOR SELECT USING (true);
CREATE POLICY "Users can insert own submissions" ON drop_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON drop_submissions FOR UPDATE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Add community_id to posts and groups
-- ---------------------------------------------------------------------------
ALTER TABLE posts ADD COLUMN IF NOT EXISTS community_id text REFERENCES communities(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS drop_id uuid REFERENCES weekly_drops(id);
CREATE INDEX IF NOT EXISTS idx_posts_community ON posts(community_id);

ALTER TABLE groups ADD COLUMN IF NOT EXISTS community_id text REFERENCES communities(id);
CREATE INDEX IF NOT EXISTS idx_groups_community ON groups(community_id);

-- ---------------------------------------------------------------------------
-- Leaderboard entries view (aggregate points per user per community)
-- ---------------------------------------------------------------------------
ALTER TABLE leaderboard_points ADD COLUMN IF NOT EXISTS community_id text REFERENCES communities(id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_community ON leaderboard_points(community_id);

-- ---------------------------------------------------------------------------
-- Trigger: increment submissions_count on weekly_drops when new submission
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE weekly_drops
  SET submissions_count = submissions_count + 1,
      updated_at = now()
  WHERE id = NEW.drop_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_submission_created
  AFTER INSERT ON drop_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_submission();

-- ---------------------------------------------------------------------------
-- Trigger: auto-mark drop_progress as submitted when submission is created
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_submission_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO drop_progress (user_id, drop_id, submitted, submitted_at)
  VALUES (NEW.user_id, NEW.drop_id, true, now())
  ON CONFLICT (user_id, drop_id)
  DO UPDATE SET submitted = true, submitted_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_submission_update_progress
  AFTER INSERT ON drop_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_submission_progress();
