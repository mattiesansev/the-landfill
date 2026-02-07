// Bracket Vote Service
// Re-exports from the API layer for backward compatibility.
// All data operations now go through the API abstraction.

export {
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
} from './api/bracketApi';
