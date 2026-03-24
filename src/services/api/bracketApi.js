// Bracket API Interface
// This module exports the appropriate API implementation based on configuration.
// Set USE_MOCK_API to false and provide Supabase env vars to use the real backend.

import * as mockApi from './mockBracketApi';
import * as realApi from './realBracketApi';

// Auto-detect: use real API when Supabase env vars are present
const USE_MOCK_API = !import.meta.env.VITE_SUPABASE_URL;

if (USE_MOCK_API) {
  console.log('[BracketApi] Using mock (localStorage) backend');
} else {
  console.log('[BracketApi] Using Supabase backend');
}

const api = USE_MOCK_API ? mockApi : realApi;

// Re-export all API methods
export const {
  // User bracket operations
  submitBracket,
  getUserBracket,
  hasSubmittedBracket,
  clearUserBracket,

  // Draft operations
  saveDraftPicks,
  getDraftPicks,
  clearDraftPicks,

  // Vote aggregation
  getAggregateVotes,
  getMatchupVotes,
  getVoteLeaderboard,
  getTotalVoters,

  // Bracket lock (admin)
  isBracketLocked,
  lockBracket,
  unlockBracket,

  // Winners
  getWinnerForMatchup,
  getAllWinners,

  // Admin overrides
  getAdminOverrides,
  setAdminOverride,
  removeAdminOverride,

  // Utilities
  hasMatchupTie,
  canEditBracket,
  validateBracketComplete,
  getAllMatchupIds,
  getRoundKeyFromMatchupId,

  // Data management (admin)
  exportAllData,
  importAllData,
  clearAllVotingData,
  exportVotesToCSV,
  importVotesFromCSV,

  // Round closed check
  isRoundClosed,

  // Per-round voting
  getActiveRound,
  setActiveRound,
  getPerRoundVotes,
  getPerRoundMatchupVotes,
  getUserRoundVotes,
  submitPerRoundVote,
  getMatchupIdsForRound,
  getCombinedMatchupVotes,

  // Draft round votes
  saveDraftRoundVotes,
  getDraftRoundVotes,
  clearDraftRoundVotes,

  // Simulation (dev only)
  addSimulatedVotes,
  clearSimulatedVotes,
  simulateVoters,
} = api;

// Admin auth (only meaningful for real API; mock returns no-ops)
export const setAdminPassword = api.setAdminPassword || (() => {});
export const verifyAdminPassword = api.verifyAdminPassword || (async () => true);
