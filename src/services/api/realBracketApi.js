// Real Bracket API Implementation — Supabase
//
// To use this:
// 1. Create a Supabase project and run supabase/migration.sql
// 2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
// 3. Set USE_MOCK_API = false in bracketApi.js

import { supabase, getUserId, ensureAnonymousUser } from './supabaseClient';

// ============ Admin Password (module-level) ============
// AdminPanel calls setAdminPassword() once per session.
// All admin RPC functions use it internally.

let _adminPassword = null;

export function setAdminPassword(password) {
  _adminPassword = password;
}

export async function verifyAdminPassword(password) {
  const { data, error } = await supabase.rpc('verify_admin', { p_password: password });
  if (error) return false;
  return data === true;
}

function getAdminPassword() {
  if (!_adminPassword) throw new Error('Admin password not set. Enter it in the Admin Panel.');
  return _adminPassword;
}

// ============ Session Management ============

export function getSessionId() {
  // With Supabase, the user ID serves as the session identifier.
  // This is synchronous for compatibility — returns cached value or placeholder.
  const session = supabase.auth.session?.();
  return session?.user?.id || 'pending';
}

// ============ User Bracket Operations ============

export async function submitBracket(picks) {
  const userId = await getUserId();

  // Check lock
  const config = await getConfigData();
  if (config.bracket_locked) {
    return { error: 'Voting is closed - bracket is locked.' };
  }

  // Check for existing bracket (to preserve first_submitted_at)
  const { data: existing } = await supabase
    .from('brackets')
    .select('first_submitted_at')
    .eq('user_id', userId)
    .single();

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('brackets')
    .upsert({
      user_id: userId,
      picks,
      submitted_at: now,
      first_submitted_at: existing?.first_submitted_at || now,
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return { error: error.message };

  return {
    bracket: {
      sessionId: userId,
      submittedAt: data.submitted_at,
      firstSubmittedAt: data.first_submitted_at,
      picks: data.picks,
    },
  };
}

export async function getUserBracket() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('brackets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    sessionId: data.user_id,
    submittedAt: data.submitted_at,
    firstSubmittedAt: data.first_submitted_at,
    picks: data.picks,
  };
}

export async function hasSubmittedBracket() {
  const bracket = await getUserBracket();
  return bracket !== null;
}

export async function clearUserBracket() {
  const userId = await getUserId();
  await supabase.from('brackets').delete().eq('user_id', userId);
}

// ============ Draft Operations (localStorage — per-device, temporary) ============

const DRAFT_KEYS = {
  PICKS: 'sf_parks_bracket_draft',
  ROUND_VOTES: 'sf_parks_bracket_draft_round_votes',
};

export function saveDraftPicks(picks) {
  localStorage.setItem(DRAFT_KEYS.PICKS, JSON.stringify(picks));
}

export function getDraftPicks() {
  const stored = localStorage.getItem(DRAFT_KEYS.PICKS);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function clearDraftPicks() {
  localStorage.removeItem(DRAFT_KEYS.PICKS);
}

export function saveDraftRoundVotes(votes) {
  localStorage.setItem(DRAFT_KEYS.ROUND_VOTES, JSON.stringify(votes));
}

export function getDraftRoundVotes() {
  const stored = localStorage.getItem(DRAFT_KEYS.ROUND_VOTES);
  if (!stored) return {};
  try { return JSON.parse(stored); } catch { return {}; }
}

export function clearDraftRoundVotes() {
  localStorage.removeItem(DRAFT_KEYS.ROUND_VOTES);
}

// ============ Vote Aggregation ============

export async function getAggregateVotes() {
  const { data, error } = await supabase.rpc('get_aggregate_votes');
  if (error) { console.error('getAggregateVotes error:', error); return {}; }
  return data || {};
}

export async function getMatchupVotes(matchupId) {
  const aggregate = await getAggregateVotes();
  return aggregate[matchupId] || {};
}

export async function getPerRoundVotes() {
  const { data, error } = await supabase.rpc('get_per_round_votes');
  if (error) { console.error('getPerRoundVotes error:', error); return {}; }
  return data || {};
}

export async function getPerRoundMatchupVotes(matchupId) {
  const votes = await getPerRoundVotes();
  return votes[matchupId] || {};
}

export async function getCombinedMatchupVotes(matchupId) {
  const { data, error } = await supabase.rpc('get_combined_matchup_votes', { p_matchup_id: matchupId });
  if (error) { console.error('getCombinedMatchupVotes error:', error); return {}; }
  return data || {};
}

export async function getVoteLeaderboard() {
  const aggregate = await getAggregateVotes();
  const parkVotes = {};

  Object.values(aggregate).forEach((matchupVotes) => {
    Object.entries(matchupVotes).forEach(([parkId, count]) => {
      parkVotes[parkId] = (parkVotes[parkId] || 0) + count;
    });
  });

  return Object.entries(parkVotes)
    .sort((a, b) => b[1] - a[1])
    .map(([parkId, votes]) => ({ parkId, votes }));
}

export async function getTotalVoters() {
  const { data, error } = await supabase.rpc('get_total_voters');
  if (error) return 0;
  return data || 0;
}

// ============ Config / Lock State ============

async function getConfigData() {
  const { data, error } = await supabase
    .from('config')
    .select('bracket_locked, active_round')
    .single();
  if (error) return { bracket_locked: false, active_round: null };
  return data;
}

export async function isBracketLocked() {
  const config = await getConfigData();
  return config.bracket_locked;
}

export async function lockBracket() {
  return supabase.rpc('admin_set_lock', { p_password: getAdminPassword(), p_locked: true });
}

export async function unlockBracket() {
  return supabase.rpc('admin_set_lock', { p_password: getAdminPassword(), p_locked: false });
}

export async function canEditBracket() {
  return !(await isBracketLocked());
}

// ============ Active Round ============

export async function getActiveRound() {
  const config = await getConfigData();
  return config.active_round || null;
}

export async function setActiveRound(round) {
  return supabase.rpc('admin_set_active_round', {
    p_password: getAdminPassword(),
    p_round: round || null,
  });
}

// ============ Round Closed Check ============

const ROUND_ORDER = ['round16', 'quarterfinals', 'semifinals', 'finals'];

export async function isRoundClosed(roundKey) {
  const config = await getConfigData();
  if (config.bracket_locked || config.active_round === 'completed') return true;
  if (!config.active_round) return false;
  const activeIdx = ROUND_ORDER.indexOf(config.active_round);
  const roundIdx = ROUND_ORDER.indexOf(roundKey);
  if (activeIdx === -1 || roundIdx === -1) return false;
  return roundIdx < activeIdx;
}

// ============ Winners ============

// Fetches all data in parallel and computes winners client-side.
// This avoids N+1 queries — 4 parallel fetches instead of 30+.
export async function getAllWinners() {
  const [config, overrides, aggregateVotes, perRoundVotes] = await Promise.all([
    getConfigData(),
    getAdminOverrides(),
    getAggregateVotes(),
    getPerRoundVotes(),
  ]);

  const allMatchups = getAllMatchupIds();
  const winners = {};

  for (const matchupId of allMatchups) {
    const roundKey = getRoundKeyFromMatchupId(matchupId);

    // Check if round is closed
    let roundClosed = false;
    if (config.bracket_locked || config.active_round === 'completed') {
      roundClosed = true;
    } else if (config.active_round) {
      const activeIdx = ROUND_ORDER.indexOf(config.active_round);
      const roundIdx = ROUND_ORDER.indexOf(roundKey);
      roundClosed = activeIdx !== -1 && roundIdx !== -1 && roundIdx < activeIdx;
    }

    if (!roundClosed) continue;

    // Check admin override
    if (overrides[matchupId]) {
      winners[matchupId] = overrides[matchupId];
      continue;
    }

    // For R16: combine bracket predictions + per-round votes (parks are fixed seedings)
    // For QF+: use ONLY per-round votes — bracket predictions may include parks that
    //           never actually advanced to this round, polluting the winner calculation.
    const bracketVotes = aggregateVotes[matchupId] || {};
    const roundVotesForMatchup = perRoundVotes[matchupId] || {};
    let combined;
    if (matchupId.startsWith('r16')) {
      combined = { ...bracketVotes };
      Object.entries(roundVotesForMatchup).forEach(([parkId, count]) => {
        combined[parkId] = (combined[parkId] || 0) + count;
      });
    } else {
      combined = { ...roundVotesForMatchup };
    }

    if (Object.keys(combined).length === 0) continue;

    const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    // Tie — no winner without admin override
    if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) continue;

    winners[matchupId] = sorted[0][0];
  }

  return winners;
}

export async function getWinnerForMatchup(matchupId) {
  const winners = await getAllWinners();
  return winners[matchupId] || null;
}

// ============ Admin Overrides ============

export async function getAdminOverrides() {
  const { data, error } = await supabase
    .from('admin_overrides')
    .select('matchup_id, winner_park_id');

  if (error) return {};

  const overrides = {};
  (data || []).forEach((row) => {
    overrides[row.matchup_id] = row.winner_park_id;
  });
  return overrides;
}

export async function setAdminOverride(matchupId, winnerId) {
  return supabase.rpc('admin_set_override', {
    p_password: getAdminPassword(),
    p_matchup_id: matchupId,
    p_winner_park_id: winnerId,
  });
}

export async function removeAdminOverride(matchupId) {
  return supabase.rpc('admin_remove_override', {
    p_password: getAdminPassword(),
    p_matchup_id: matchupId,
  });
}

// ============ Per-Round Voting ============

export function getMatchupIdsForRound(roundKey) {
  switch (roundKey) {
    case 'round16':
      return ['r16-1', 'r16-2', 'r16-3', 'r16-4', 'r16-5', 'r16-6', 'r16-7', 'r16-8'];
    case 'quarterfinals':
      return ['qf-1', 'qf-2', 'qf-3', 'qf-4'];
    case 'semifinals':
      return ['sf-1', 'sf-2'];
    case 'finals':
      return ['f-1'];
    default:
      return [];
  }
}

export async function getUserRoundVotes() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('round_votes')
    .select('matchup_id, park_id')
    .eq('user_id', userId);

  if (error) return {};

  const votes = {};
  (data || []).forEach((row) => {
    votes[row.matchup_id] = row.park_id;
  });
  return votes;
}

export async function submitPerRoundVote(matchupId, parkId) {
  const userId = await getUserId();

  const config = await getConfigData();
  if (!config.active_round) {
    return { error: 'No active round for voting' };
  }

  const matchupRound = getRoundKeyFromMatchupId(matchupId);
  if (matchupRound !== config.active_round) {
    return { error: 'This matchup is not in the active round' };
  }

  const { error } = await supabase
    .from('round_votes')
    .upsert({
      user_id: userId,
      matchup_id: matchupId,
      park_id: parkId,
      submitted_at: new Date().toISOString(),
    }, { onConflict: 'user_id,matchup_id' });

  if (error) return { error: error.message };
  return { success: true };
}

// ============ Utilities (pure functions — no backend needed) ============

export function hasMatchupTie(matchupId) {
  // NOTE: This is now a thin wrapper. Callers that need tie detection
  // should use the async version getCombinedMatchupVotes + check client-side.
  // This synchronous version exists for API compatibility; it won't work
  // correctly with Supabase. The hook/components should use the async pattern.
  console.warn('hasMatchupTie: use getCombinedMatchupVotes for async tie detection');
  return false;
}

export function getAllMatchupIds() {
  return [
    'r16-1', 'r16-2', 'r16-3', 'r16-4', 'r16-5', 'r16-6', 'r16-7', 'r16-8',
    'qf-1', 'qf-2', 'qf-3', 'qf-4',
    'sf-1', 'sf-2',
    'f-1',
  ];
}

export function validateBracketComplete(picks) {
  const allMatchups = getAllMatchupIds();
  const missingPicks = allMatchups.filter((id) => !picks[id]);
  return { isComplete: missingPicks.length === 0, missingPicks };
}

export function getRoundKeyFromMatchupId(matchupId) {
  if (matchupId.startsWith('r16')) return 'round16';
  if (matchupId.startsWith('qf')) return 'quarterfinals';
  if (matchupId.startsWith('sf')) return 'semifinals';
  if (matchupId === 'f-1') return 'finals';
  return null;
}

// ============ Data Management (Admin) ============

export async function exportAllData() {
  const [aggregateVotes, bracketLocked, adminOverrides, activeRound, perRoundVotes] =
    await Promise.all([
      getAggregateVotes(),
      isBracketLocked(),
      getAdminOverrides(),
      getActiveRound(),
      getPerRoundVotes(),
    ]);
  return { aggregateVotes, bracketLocked, adminOverrides, activeRound, perRoundVotes };
}

export async function importAllData(_data) {
  // Import would require admin RPC functions for each table.
  // For now, this is not implemented for the Supabase backend.
  console.warn('importAllData: not yet implemented for Supabase');
}

export async function clearAllVotingData() {
  return supabase.rpc('admin_clear_all', { p_password: getAdminPassword() });
}

export async function exportVotesToCSV() {
  console.warn('exportVotesToCSV: not yet implemented for Supabase');
  return '';
}

export async function importVotesFromCSV(_csv) {
  console.warn('importVotesFromCSV: not yet implemented for Supabase');
}

// ============ Simulation (Dev Only) ============
// Simulation stays client-side in mockBracketApi.
// These are no-ops in the real API.

export async function addSimulatedVotes(_count = 10, _bias = null) {
  console.warn('addSimulatedVotes: not available with real backend');
  return { added: 0, totalVoters: 0 };
}

export async function clearSimulatedVotes() {
  console.warn('clearSimulatedVotes: not available with real backend');
}

export function generateRandomBracket(_bias = null) {
  // Keep for compatibility — import from mockBracketApi if needed
  throw new Error('generateRandomBracket: use mockBracketApi for simulation');
}
