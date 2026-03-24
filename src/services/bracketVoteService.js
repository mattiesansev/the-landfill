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

  // Admin auth
  setAdminPassword,
  verifyAdminPassword,
} from './api/bracketApi';
