-- ============================================================
-- SF Parks Bracket Madness — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. BRACKETS — one row per user's submitted bracket
CREATE TABLE brackets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  picks JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  first_submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brackets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own bracket" ON brackets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bracket" ON brackets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bracket" ON brackets
  FOR UPDATE USING (auth.uid() = user_id);


-- 2. ROUND_VOTES — one row per user per matchup
CREATE TABLE round_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  matchup_id TEXT NOT NULL,
  park_id TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matchup_id)
);

ALTER TABLE round_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read round votes" ON round_votes
  FOR SELECT USING (true);
CREATE POLICY "Users can insert own round votes" ON round_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own round votes" ON round_votes
  FOR UPDATE USING (auth.uid() = user_id);


-- 3. CONFIG — single-row global state
CREATE TABLE config (
  id INTEGER DEFAULT 1 PRIMARY KEY CHECK (id = 1),
  bracket_locked BOOLEAN DEFAULT FALSE,
  active_round TEXT DEFAULT NULL,
  admin_password_hash TEXT DEFAULT NULL
);

INSERT INTO config (bracket_locked, active_round) VALUES (FALSE, NULL);

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read config" ON config
  FOR SELECT USING (true);
-- No direct write policy — admin writes go through RPC functions


-- 4. ADMIN_OVERRIDES — tie-breaker winners
CREATE TABLE admin_overrides (
  matchup_id TEXT PRIMARY KEY,
  winner_park_id TEXT NOT NULL
);

ALTER TABLE admin_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read overrides" ON admin_overrides
  FOR SELECT USING (true);
-- No direct write policy — admin writes go through RPC functions


-- ============================================================
-- DATABASE FUNCTIONS
-- ============================================================

-- Aggregate bracket votes: extract JSONB picks into {matchupId: {parkId: count}}
-- SECURITY DEFINER bypasses RLS so all users' brackets are counted, not just the caller's.
CREATE OR REPLACE FUNCTION get_aggregate_votes()
RETURNS JSON
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    json_object_agg(matchup_id, votes),
    '{}'::json
  )
  FROM (
    SELECT matchup_id, json_object_agg(park_id, cnt) AS votes
    FROM (
      SELECT kv.key AS matchup_id, kv.value #>> '{}' AS park_id, COUNT(*) AS cnt
      FROM brackets, jsonb_each(picks) AS kv
      GROUP BY kv.key, kv.value
    ) sub
    GROUP BY matchup_id
  ) agg;
$$;

-- Aggregate per-round votes: {matchupId: {parkId: count}}
CREATE OR REPLACE FUNCTION get_per_round_votes()
RETURNS JSON
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    json_object_agg(matchup_id, votes),
    '{}'::json
  )
  FROM (
    SELECT matchup_id, json_object_agg(park_id, cnt) AS votes
    FROM (
      SELECT matchup_id, park_id, COUNT(*) AS cnt
      FROM round_votes
      GROUP BY matchup_id, park_id
    ) sub
    GROUP BY matchup_id
  ) agg;
$$;

-- Combined votes (bracket + round) for a single matchup
-- SECURITY DEFINER required for same reason as get_aggregate_votes.
CREATE OR REPLACE FUNCTION get_combined_matchup_votes(p_matchup_id TEXT)
RETURNS JSON
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(json_object_agg(park_id, total), '{}'::json)
  FROM (
    SELECT park_id, SUM(cnt) AS total
    FROM (
      -- Bracket votes for this matchup
      SELECT picks->>p_matchup_id AS park_id, COUNT(*) AS cnt
      FROM brackets
      WHERE picks ? p_matchup_id
      GROUP BY picks->>p_matchup_id
      UNION ALL
      -- Round votes for this matchup
      SELECT park_id, COUNT(*) AS cnt
      FROM round_votes
      WHERE matchup_id = p_matchup_id
      GROUP BY park_id
    ) combined
    WHERE park_id IS NOT NULL
    GROUP BY park_id
  ) agg;
$$;

-- Total bracket voters (count of submitted brackets)
-- SECURITY DEFINER required to count all users' brackets, not just the caller's.
CREATE OR REPLACE FUNCTION get_total_voters()
RETURNS INTEGER
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer FROM brackets;
$$;


-- ============================================================
-- ADMIN RPC FUNCTIONS (password-protected)
-- ============================================================

-- Verify admin password (compares against config.admin_password_hash)
-- Uses pgcrypto for bcrypt comparison
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Set admin password (run this manually once, then delete from history)
-- Example: SELECT set_admin_password('your-secret-password');
CREATE OR REPLACE FUNCTION set_admin_password(p_password TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE config SET admin_password_hash = crypt(p_password, gen_salt('bf')) WHERE id = 1;
END;
$$;

-- Internal helper: verify password
CREATE OR REPLACE FUNCTION verify_admin(p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT admin_password_hash INTO stored_hash FROM config WHERE id = 1;
  IF stored_hash IS NULL THEN RETURN FALSE; END IF;
  RETURN stored_hash = crypt(p_password, stored_hash);
END;
$$;

-- Admin: lock/unlock bracket
CREATE OR REPLACE FUNCTION admin_set_lock(p_password TEXT, p_locked BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT verify_admin(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  UPDATE config SET bracket_locked = p_locked WHERE id = 1;
  RETURN TRUE;
END;
$$;

-- Admin: set active round
CREATE OR REPLACE FUNCTION admin_set_active_round(p_password TEXT, p_round TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT verify_admin(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  UPDATE config SET active_round = p_round WHERE id = 1;
  RETURN TRUE;
END;
$$;

-- Admin: set override (tie-breaker)
CREATE OR REPLACE FUNCTION admin_set_override(p_password TEXT, p_matchup_id TEXT, p_winner_park_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT verify_admin(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  INSERT INTO admin_overrides (matchup_id, winner_park_id)
  VALUES (p_matchup_id, p_winner_park_id)
  ON CONFLICT (matchup_id) DO UPDATE SET winner_park_id = p_winner_park_id;
  RETURN TRUE;
END;
$$;

-- Admin: remove override
CREATE OR REPLACE FUNCTION admin_remove_override(p_password TEXT, p_matchup_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT verify_admin(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  DELETE FROM admin_overrides WHERE matchup_id = p_matchup_id;
  RETURN TRUE;
END;
$$;

-- Admin: clear all data
CREATE OR REPLACE FUNCTION admin_clear_all(p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT verify_admin(p_password) THEN
    RAISE EXCEPTION 'Invalid admin password';
  END IF;
  DELETE FROM round_votes;
  DELETE FROM brackets;
  DELETE FROM admin_overrides;
  UPDATE config SET bracket_locked = FALSE, active_round = NULL WHERE id = 1;
  RETURN TRUE;
END;
$$;
