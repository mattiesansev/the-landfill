// Real Bracket API Implementation (Template)
// Connect this to your actual backend (Firebase, Supabase, custom API, etc.)
//
// To use this:
// 1. Implement each function to call your backend
// 2. Update bracketApi.js to import from this file
// 3. Set USE_MOCK_API = false in bracketApi.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper for API calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Get or create a session ID for anonymous users
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('bracket_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('bracket_session_id', sessionId);
  }
  return sessionId;
}

// ============ User Bracket Operations ============

export async function submitBracket(picks) {
  const sessionId = getOrCreateSessionId();
  return apiCall('/brackets', {
    method: 'POST',
    body: JSON.stringify({ sessionId, picks }),
  });
}

export async function getUserBracket() {
  const sessionId = getOrCreateSessionId();
  try {
    return await apiCall(`/brackets/${sessionId}`);
  } catch {
    return null;
  }
}

export async function hasSubmittedBracket() {
  const bracket = await getUserBracket();
  return bracket !== null;
}

export async function clearUserBracket() {
  const sessionId = getOrCreateSessionId();
  return apiCall(`/brackets/${sessionId}`, { method: 'DELETE' });
}

// ============ Draft Operations (still local) ============
// Drafts stay in localStorage since they're user-specific and temporary

export function saveDraftPicks(picks) {
  localStorage.setItem('sf_parks_bracket_draft', JSON.stringify(picks));
}

export function getDraftPicks() {
  const stored = localStorage.getItem('sf_parks_bracket_draft');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearDraftPicks() {
  localStorage.removeItem('sf_parks_bracket_draft');
}

// ============ Vote Aggregation ============

export async function getAggregateVotes() {
  return apiCall('/votes/aggregate');
}

export async function getMatchupVotes(matchupId) {
  const aggregate = await getAggregateVotes();
  return aggregate[matchupId] || {};
}

export async function getVoteLeaderboard() {
  return apiCall('/votes/leaderboard');
}

export async function getTotalVoters() {
  const stats = await apiCall('/votes/stats');
  return stats.totalVoters;
}

// ============ Bracket Lock ============

export async function isBracketLocked() {
  const status = await apiCall('/admin/status');
  return status.locked;
}

export async function lockBracket() {
  return apiCall('/admin/lock', { method: 'POST' });
}

export async function unlockBracket() {
  return apiCall('/admin/unlock', { method: 'POST' });
}

export async function canEditBracket() {
  return !(await isBracketLocked());
}

// ============ Winners ============

export async function getWinnerForMatchup(matchupId) {
  const winners = await getAllWinners();
  return winners[matchupId] || null;
}

export async function getAllWinners() {
  return apiCall('/votes/winners');
}

// ============ Admin Overrides ============

export async function getAdminOverrides() {
  return apiCall('/admin/overrides');
}

export async function setAdminOverride(matchupId, winnerId) {
  return apiCall('/admin/overrides', {
    method: 'POST',
    body: JSON.stringify({ matchupId, winnerId }),
  });
}

export async function removeAdminOverride(matchupId) {
  return apiCall(`/admin/overrides/${matchupId}`, { method: 'DELETE' });
}

// ============ Utilities ============

export async function hasMatchupTie(matchupId) {
  const votes = await getMatchupVotes(matchupId);
  if (Object.keys(votes).length < 2) {
    return false;
  }
  const sortedVotes = Object.values(votes).sort((a, b) => b - a);
  return sortedVotes[0] === sortedVotes[1];
}

export function getAllMatchupIds() {
  return [
    "r16-1", "r16-2", "r16-3", "r16-4", "r16-5", "r16-6", "r16-7", "r16-8",
    "qf-1", "qf-2", "qf-3", "qf-4",
    "sf-1", "sf-2",
    "f-1",
  ];
}

export function validateBracketComplete(picks) {
  const allMatchups = getAllMatchupIds();
  const missingPicks = allMatchups.filter((id) => !picks[id]);
  return {
    isComplete: missingPicks.length === 0,
    missingPicks,
  };
}

// ============ Data Management (Admin) ============

export async function exportAllData() {
  return apiCall('/admin/export');
}

export async function importAllData(data) {
  return apiCall('/admin/import', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function clearAllVotingData() {
  return apiCall('/admin/reset', { method: 'POST' });
}

// ============ Simulation (Dev Only) ============

export async function addSimulatedVotes(count = 10, bias = null) {
  return apiCall('/dev/simulate', {
    method: 'POST',
    body: JSON.stringify({ count, bias }),
  });
}

export async function clearSimulatedVotes() {
  return apiCall('/dev/simulate', { method: 'DELETE' });
}

// Note: generateRandomBracket stays client-side
export function generateRandomBracket(bias = null) {
  // Same implementation as mockBracketApi
  // ... (copy from mockBracketApi if needed)
  throw new Error('Use mockBracketApi for simulation');
}
