// Bracket API Interface
// This module exports the appropriate API implementation based on configuration.
// In development, it uses the mock (localStorage-based) implementation.
// In production, swap to a real API implementation.

import * as mockApi from './mockBracketApi';
// Future: import * as realApi from './realBracketApi';

// Configuration - change this to switch implementations
const USE_MOCK_API = true;

const api = USE_MOCK_API ? mockApi : mockApi; // Future: realApi

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

  // Simulation (dev only)
  addSimulatedVotes,
  clearSimulatedVotes,
} = api;
