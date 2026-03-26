-- =============================================================================
-- Migration 001: Votes, Subscriptions, Sponsors, Roles, Status Enum
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extend profiles with roles and age confirmation
-- ---------------------------------------------------------------------------
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'participant'
    CHECK (role IN ('admin', 'participant', 'sponsor', 'judge')),
  ADD COLUMN IF NOT EXISTS age_confirmed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_connect_id text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Migrate is_admin to role (preserve existing admins)
UPDATE profiles SET role = 'admin' WHERE is_admin = true;

-- Update membership_tier to support 3 tiers
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_membership_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_membership_tier_check
  CHECK (membership_tier IN ('free', 'pro', 'elite'));
UPDATE profiles SET membership_tier = 'pro' WHERE membership_tier = 'paid';

-- ---------------------------------------------------------------------------
-- Extend challenges with richer status + entry fees
-- ---------------------------------------------------------------------------
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_status_check;
ALTER TABLE challenges ADD CONSTRAINT challenges_status_check
  CHECK (status IN ('draft', 'active', 'voting', 'completed', 'cancelled'));

ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS entry_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prize_per_entrant numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_entrants integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS max_entrants integer,
  ADD COLUMN IF NOT EXISTS early_access_at timestamptz,
  ADD COLUMN IF NOT EXISTS voting_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS mux_playback_id text,
  ADD COLUMN IF NOT EXISTS mux_asset_id text;

-- Migrate 'upcoming' → 'draft', 'judging' → 'voting'
UPDATE challenges SET status = 'draft' WHERE status = 'upcoming';
UPDATE challenges SET status = 'voting' WHERE status = 'judging';

-- ---------------------------------------------------------------------------
-- Extend submissions with approval + TOS
-- ---------------------------------------------------------------------------
ALTER TABLE challenge_submissions DROP CONSTRAINT IF EXISTS challenge_submissions_status_check;
ALTER TABLE challenge_submissions ADD CONSTRAINT challenge_submissions_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'winner'));

ALTER TABLE challenge_submissions
  ADD COLUMN IF NOT EXISTS tos_accepted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS entry_payment_id text,
  ADD COLUMN IF NOT EXISTS submission_type text DEFAULT 'url'
    CHECK (submission_type IN ('url', 'video', 'text', 'file'));

-- Migrate 'submitted' → 'pending', 'reviewed' → 'approved'
UPDATE challenge_submissions SET status = 'pending' WHERE status = 'submitted';
UPDATE challenge_submissions SET status = 'approved' WHERE status = 'reviewed';

-- ---------------------------------------------------------------------------
-- 13. votes (community voting)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  entry_id     uuid NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (challenge_id, user_id)  -- 1 vote per user per challenge
);

CREATE INDEX IF NOT EXISTS idx_votes_challenge ON votes(challenge_id);
CREATE INDEX IF NOT EXISTS idx_votes_entry ON votes(entry_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);

-- ---------------------------------------------------------------------------
-- 14. judge_scores
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS judge_scores (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  entry_id     uuid NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
  judge_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score        integer NOT NULL CHECK (score >= 1 AND score <= 10),
  feedback     text,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (entry_id, judge_id)  -- 1 score per judge per entry
);

CREATE INDEX IF NOT EXISTS idx_judge_scores_entry ON judge_scores(entry_id);
CREATE INDEX IF NOT EXISTS idx_judge_scores_judge ON judge_scores(judge_id);

-- ---------------------------------------------------------------------------
-- 15. subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  stripe_price_id       text,
  tier                  text NOT NULL CHECK (tier IN ('pro', 'elite')),
  status                text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean DEFAULT false,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- ---------------------------------------------------------------------------
-- 16. sponsors
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sponsors (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name            text NOT NULL,
  logo_url        text,
  website_url     text,
  description     text,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 17. challenge_sponsors (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenge_sponsors (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id  uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  sponsor_id    uuid NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  amount        numeric DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (challenge_id, sponsor_id)
);

-- ---------------------------------------------------------------------------
-- 18. prize_distributions (payout tracking)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prize_distributions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id        uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id             uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id       uuid REFERENCES challenge_submissions(id),
  place               integer NOT NULL,
  gross_amount        numeric NOT NULL,
  platform_fee        numeric NOT NULL DEFAULT 0,
  net_amount          numeric NOT NULL,
  stripe_transfer_id  text,
  status              text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  paid_at             timestamptz,
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prize_dist_challenge ON prize_distributions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_prize_dist_user ON prize_distributions(user_id);

-- ---------------------------------------------------------------------------
-- 19. notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  data        jsonb DEFAULT '{}',
  read        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- ---------------------------------------------------------------------------
-- 20. entry_payments (escrow tracking)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entry_payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id          uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id               uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id         uuid REFERENCES challenge_submissions(id),
  stripe_payment_intent text,
  amount                numeric NOT NULL,
  status                text NOT NULL DEFAULT 'held'
    CHECK (status IN ('held', 'released', 'refunded')),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entry_payments_challenge ON entry_payments(challenge_id);

-- =============================================================================
-- RLS for new tables
-- =============================================================================

-- votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON votes FOR DELETE USING (auth.uid() = user_id);

-- judge_scores
ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judge scores viewable by everyone" ON judge_scores FOR SELECT USING (true);
CREATE POLICY "Judges can insert scores" ON judge_scores FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'judge'));
CREATE POLICY "Judges can update own scores" ON judge_scores FOR UPDATE
  USING (auth.uid() = judge_id) WITH CHECK (auth.uid() = judge_id);

-- subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- sponsors
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sponsors viewable by everyone" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Admins manage sponsors" ON sponsors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- challenge_sponsors
ALTER TABLE challenge_sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenge sponsors viewable by everyone" ON challenge_sponsors FOR SELECT USING (true);
CREATE POLICY "Admins manage challenge sponsors" ON challenge_sponsors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- prize_distributions
ALTER TABLE prize_distributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payouts" ON prize_distributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payouts" ON prize_distributions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage payouts" ON prize_distributions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- entry_payments
ALTER TABLE entry_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON entry_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON entry_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
