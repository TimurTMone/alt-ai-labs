-- =============================================================================
-- Alt AI Labs - Supabase Schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  full_name       text DEFAULT '',
  avatar_url      text,
  bio             text,
  membership_tier text DEFAULT 'free' CHECK (membership_tier IN ('free', 'paid')),
  stripe_customer_id text,
  is_admin        boolean DEFAULT false,
  total_points    integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. tracks
-- ---------------------------------------------------------------------------
CREATE TABLE tracks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text UNIQUE NOT NULL,
  description   text,
  icon          text,
  color         text,
  order_index   integer DEFAULT 0,
  is_free       boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. lessons
-- ---------------------------------------------------------------------------
CREATE TABLE lessons (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id          uuid REFERENCES tracks(id),
  title             text NOT NULL,
  slug              text UNIQUE NOT NULL,
  short_description text,
  full_content      text,
  video_url         text,
  cover_image_url   text,
  difficulty        text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes  integer DEFAULT 30,
  status            text DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'coming_soon')),
  order_index       integer DEFAULT 0,
  is_free           boolean DEFAULT false,
  key_outcomes      jsonb DEFAULT '[]',
  resource_links    jsonb DEFAULT '[]',
  challenge_id      uuid,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 4. challenges
-- ---------------------------------------------------------------------------
CREATE TABLE challenges (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  slug              text UNIQUE NOT NULL,
  short_description text,
  build_brief       text,
  deliverables      jsonb DEFAULT '[]',
  rules             jsonb DEFAULT '[]',
  deadline          timestamptz,
  prize_description text,
  prize_amount      numeric DEFAULT 0,
  status            text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed')),
  visibility        text DEFAULT 'public' CHECK (visibility IN ('public', 'paid_only')),
  lesson_id         uuid,
  cover_image_url   text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 5. challenge_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE challenge_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id    uuid REFERENCES challenges(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_url     text NOT NULL,
  notes           text,
  screenshot_urls jsonb DEFAULT '[]',
  status          text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'winner')),
  score           integer,
  feedback        text,
  is_featured     boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 6. posts
-- ---------------------------------------------------------------------------
CREATE TABLE posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES profiles(id),
  title          text NOT NULL,
  body           text NOT NULL,
  category       text DEFAULT 'builds' CHECK (category IN ('wins', 'questions', 'builds', 'announcements')),
  likes_count    integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_pinned      boolean DEFAULT false,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. comments
-- ---------------------------------------------------------------------------
CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id),
  body       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 8. leaderboard_points
-- ---------------------------------------------------------------------------
CREATE TABLE leaderboard_points (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(id),
  points     integer NOT NULL,
  reason     text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 9. groups
-- ---------------------------------------------------------------------------
CREATE TABLE groups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  visibility      text DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  cover_image_url text,
  max_members     integer,
  created_at      timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 10. group_members
-- ---------------------------------------------------------------------------
CREATE TABLE group_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id   uuid REFERENCES profiles(id),
  role      text DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 11. prizes
-- ---------------------------------------------------------------------------
CREATE TABLE prizes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  place        integer NOT NULL,
  description  text,
  amount       numeric DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 12. lesson_progress
-- ---------------------------------------------------------------------------
CREATE TABLE lesson_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES profiles(id),
  lesson_id    uuid REFERENCES lessons(id),
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- =============================================================================
-- Indexes on foreign keys
-- =============================================================================
CREATE INDEX idx_lessons_track_id              ON lessons(track_id);
CREATE INDEX idx_lessons_challenge_id          ON lessons(challenge_id);
CREATE INDEX idx_challenges_lesson_id          ON challenges(lesson_id);
CREATE INDEX idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX idx_challenge_submissions_user    ON challenge_submissions(user_id);
CREATE INDEX idx_posts_user_id                 ON posts(user_id);
CREATE INDEX idx_comments_post_id              ON comments(post_id);
CREATE INDEX idx_comments_user_id              ON comments(user_id);
CREATE INDEX idx_leaderboard_points_user_id    ON leaderboard_points(user_id);
CREATE INDEX idx_group_members_group_id        ON group_members(group_id);
CREATE INDEX idx_group_members_user_id         ON group_members(user_id);
CREATE INDEX idx_prizes_challenge_id           ON prizes(challenge_id);
CREATE INDEX idx_lesson_progress_user_id       ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id     ON lesson_progress(lesson_id);

-- =============================================================================
-- Trigger: auto-create profile on auth.users insert
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- profiles ------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- tracks --------------------------------------------------------------------
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tracks are viewable by everyone"
  ON tracks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tracks"
  ON tracks FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- lessons -------------------------------------------------------------------
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- challenges ----------------------------------------------------------------
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage challenges"
  ON challenges FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- challenge_submissions -----------------------------------------------------
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Submissions are viewable by everyone"
  ON challenge_submissions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own submissions"
  ON challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON challenge_submissions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- posts ---------------------------------------------------------------------
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- comments ------------------------------------------------------------------
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- leaderboard_points --------------------------------------------------------
ALTER TABLE leaderboard_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard points are viewable by everyone"
  ON leaderboard_points FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage leaderboard points"
  ON leaderboard_points FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- groups --------------------------------------------------------------------
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups are viewable by everyone"
  ON groups FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage groups"
  ON groups FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- group_members -------------------------------------------------------------
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members are viewable by everyone"
  ON group_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  USING (auth.uid() = user_id);

-- prizes --------------------------------------------------------------------
ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prizes are viewable by everyone"
  ON prizes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prizes"
  ON prizes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- lesson_progress -----------------------------------------------------------
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON lesson_progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
