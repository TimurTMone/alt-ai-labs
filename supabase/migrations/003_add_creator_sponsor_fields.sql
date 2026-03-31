-- =============================================================================
-- Migration 003: Add creator + sponsor fields to weekly_drops
-- =============================================================================

ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS creator_name       text;
ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS creator_avatar_url text;
ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS creator_url        text;
ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS sponsor_name       text;
ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS sponsor_logo_url   text;
ALTER TABLE weekly_drops ADD COLUMN IF NOT EXISTS sponsor_url        text;
