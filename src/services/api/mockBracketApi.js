// Mock Bracket API Implementation
// Uses localStorage for all data persistence.
// This simulates a backend for local development and testing.

const STORAGE_KEYS = {
  USER_BRACKET: "sf_parks_bracket_user",
  DRAFT_PICKS: "sf_parks_bracket_draft",
  AGGREGATE_VOTES: "sf_parks_bracket_votes",
  BRACKET_LOCKED: "sf_parks_bracket_locked",
  ADMIN_OVERRIDES: "sf_parks_bracket_admin_overrides",
  ACTIVE_ROUND: "sf_parks_bracket_active_round",
  PER_ROUND_VOTES: "sf_parks_bracket_per_round_votes",
  USER_ROUND_VOTES: "sf_parks_bracket_user_round_votes",
  DRAFT_ROUND_VOTES: "sf_parks_bracket_draft_round_votes",
};

// ============ Session Management ============

function generateSessionId() {
  return "sess_" + Math.random().toString(36).substring(2, 15);
}

export function getSessionId() {
  const userBracket = getUserBracket();
  if (userBracket?.sessionId) {
    return userBracket.sessionId;
  }
  return generateSessionId();
}

// ============ User Bracket Operations ============

export function submitBracket(picks) {
  const existingBracket = getUserBracket();
  const locked = isBracketLocked();

  if (locked && existingBracket) {
    return { error: "Voting is closed - bracket is locked", bracket: existingBracket };
  }

  // If re-submitting, remove old votes first
  if (existingBracket && existingBracket.picks) {
    removeVotesFromAggregate(existingBracket.picks);
  }

  const bracket = {
    sessionId: existingBracket?.sessionId || getSessionId(),
    submittedAt: new Date().toISOString(),
    firstSubmittedAt: existingBracket?.firstSubmittedAt || new Date().toISOString(),
    picks: picks,
  };
  localStorage.setItem(STORAGE_KEYS.USER_BRACKET, JSON.stringify(bracket));

  // Add votes to aggregate
  addVotesToAggregate(picks);

  return { bracket };
}

export function getUserBracket() {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_BRACKET);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function hasSubmittedBracket() {
  return getUserBracket() !== null;
}

export function clearUserBracket() {
  localStorage.removeItem(STORAGE_KEYS.USER_BRACKET);
}

// ============ Draft Operations ============

export function saveDraftPicks(picks) {
  localStorage.setItem(STORAGE_KEYS.DRAFT_PICKS, JSON.stringify(picks));
}

export function getDraftPicks() {
  const stored = localStorage.getItem(STORAGE_KEYS.DRAFT_PICKS);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearDraftPicks() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT_PICKS);
}

// ============ Vote Aggregation ============

function addVotesToAggregate(picks) {
  const aggregate = getAggregateVotes();

  Object.entries(picks).forEach(([matchupId, parkId]) => {
    if (!parkId) return;

    if (!aggregate[matchupId]) {
      aggregate[matchupId] = {};
    }
    if (!aggregate[matchupId][parkId]) {
      aggregate[matchupId][parkId] = 0;
    }
    aggregate[matchupId][parkId]++;
  });

  localStorage.setItem(STORAGE_KEYS.AGGREGATE_VOTES, JSON.stringify(aggregate));
}

function removeVotesFromAggregate(picks) {
  const aggregate = getAggregateVotes();

  Object.entries(picks).forEach(([matchupId, parkId]) => {
    if (!parkId) return;

    if (aggregate[matchupId] && aggregate[matchupId][parkId]) {
      aggregate[matchupId][parkId]--;
      if (aggregate[matchupId][parkId] <= 0) {
        delete aggregate[matchupId][parkId];
      }
      if (Object.keys(aggregate[matchupId]).length === 0) {
        delete aggregate[matchupId];
      }
    }
  });

  localStorage.setItem(STORAGE_KEYS.AGGREGATE_VOTES, JSON.stringify(aggregate));
}

export function getAggregateVotes() {
  const stored = localStorage.getItem(STORAGE_KEYS.AGGREGATE_VOTES);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function getMatchupVotes(matchupId) {
  const aggregate = getAggregateVotes();
  return aggregate[matchupId] || {};
}

export function getVoteLeaderboard() {
  const aggregate = getAggregateVotes();
  const parkVotes = {};

  Object.values(aggregate).forEach((matchupVotes) => {
    Object.entries(matchupVotes).forEach(([parkId, count]) => {
      if (!parkVotes[parkId]) {
        parkVotes[parkId] = 0;
      }
      parkVotes[parkId] += count;
    });
  });

  return Object.entries(parkVotes)
    .sort((a, b) => b[1] - a[1])
    .map(([parkId, votes]) => ({ parkId, votes }));
}

export function getTotalVoters() {
  const aggregate = getAggregateVotes();
  const firstMatchupVotes = aggregate["r16-1"] || {};
  return Object.values(firstMatchupVotes).reduce((sum, count) => sum + count, 0);
}

// ============ Bracket Lock ============

export function isBracketLocked() {
  return localStorage.getItem(STORAGE_KEYS.BRACKET_LOCKED) === "true";
}

export function lockBracket() {
  localStorage.setItem(STORAGE_KEYS.BRACKET_LOCKED, "true");
}

export function unlockBracket() {
  localStorage.removeItem(STORAGE_KEYS.BRACKET_LOCKED);
}

export function canEditBracket() {
  return !isBracketLocked();
}

// ============ Round Closed Check ============

const ROUND_ORDER = ["round16", "quarterfinals", "semifinals", "finals"];

export function isRoundClosed(roundKey) {
  if (isBracketLocked()) return true;
  const activeRound = getActiveRound();
  if (!activeRound) return false;
  const activeIdx = ROUND_ORDER.indexOf(activeRound);
  const roundIdx = ROUND_ORDER.indexOf(roundKey);
  if (activeIdx === -1 || roundIdx === -1) return false;
  return roundIdx < activeIdx;
}

// ============ Winners ============

export function getWinnerForMatchup(matchupId) {
  const round = getRoundKeyFromMatchupId(matchupId);
  if (!isRoundClosed(round)) {
    return null;
  }

  const overrides = getAdminOverrides();
  if (overrides[matchupId]) {
    return overrides[matchupId];
  }

  // For R16: combine bracket predictions + per-round votes (parks are fixed seedings)
  // For QF+: use ONLY per-round votes — bracket predictions may include parks that
  //           never actually advanced to this round, polluting the winner calculation.
  const votes = matchupId.startsWith('r16')
    ? getCombinedMatchupVotes(matchupId)
    : getPerRoundMatchupVotes(matchupId);
  if (Object.keys(votes).length === 0) {
    return null;
  }

  const sortedParks = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  if (sortedParks.length > 1 && sortedParks[0][1] === sortedParks[1][1]) {
    return null; // Tie - admin must resolve
  }

  return sortedParks[0][0];
}

export function getAllWinners() {
  const allMatchups = getAllMatchupIds();
  const winners = {};

  allMatchups.forEach((matchupId) => {
    const winner = getWinnerForMatchup(matchupId);
    if (winner) {
      winners[matchupId] = winner;
    }
  });

  return winners;
}

// ============ Admin Overrides ============

export function getAdminOverrides() {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_OVERRIDES);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function setAdminOverride(matchupId, winnerId) {
  const overrides = getAdminOverrides();
  overrides[matchupId] = winnerId;
  localStorage.setItem(STORAGE_KEYS.ADMIN_OVERRIDES, JSON.stringify(overrides));
}

export function removeAdminOverride(matchupId) {
  const overrides = getAdminOverrides();
  delete overrides[matchupId];
  localStorage.setItem(STORAGE_KEYS.ADMIN_OVERRIDES, JSON.stringify(overrides));
}

// ============ Per-Round Voting ============

export function getActiveRound() {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUND) || null;
}

export function setActiveRound(round) {
  if (round) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUND, round);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROUND);
  }
}

export function getPerRoundVotes() {
  const stored = localStorage.getItem(STORAGE_KEYS.PER_ROUND_VOTES);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function getPerRoundMatchupVotes(matchupId) {
  const votes = getPerRoundVotes();
  return votes[matchupId] || {};
}

export function getUserRoundVotes() {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_ROUND_VOTES);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function getMatchupIdsForRound(roundKey) {
  switch (roundKey) {
    case "round16":
      return ["r16-1", "r16-2", "r16-3", "r16-4", "r16-5", "r16-6", "r16-7", "r16-8"];
    case "quarterfinals":
      return ["qf-1", "qf-2", "qf-3", "qf-4"];
    case "semifinals":
      return ["sf-1", "sf-2"];
    case "finals":
      return ["f-1"];
    default:
      return [];
  }
}

export function submitPerRoundVote(matchupId, parkId) {
  const activeRound = getActiveRound();
  if (!activeRound) {
    return { error: "No active round for voting" };
  }

  const matchupRound = getRoundKeyFromMatchupId(matchupId);
  if (matchupRound !== activeRound) {
    return { error: "This matchup is not in the active round" };
  }

  const perRoundVotes = getPerRoundVotes();
  const userVotes = getUserRoundVotes();

  // If user already voted on this matchup, remove old vote
  const oldPick = userVotes[matchupId];
  if (oldPick) {
    if (perRoundVotes[matchupId] && perRoundVotes[matchupId][oldPick]) {
      perRoundVotes[matchupId][oldPick]--;
      if (perRoundVotes[matchupId][oldPick] <= 0) {
        delete perRoundVotes[matchupId][oldPick];
      }
    }
  }

  // Add new vote
  if (!perRoundVotes[matchupId]) {
    perRoundVotes[matchupId] = {};
  }
  if (!perRoundVotes[matchupId][parkId]) {
    perRoundVotes[matchupId][parkId] = 0;
  }
  perRoundVotes[matchupId][parkId]++;

  // Record user's vote
  userVotes[matchupId] = parkId;

  localStorage.setItem(STORAGE_KEYS.PER_ROUND_VOTES, JSON.stringify(perRoundVotes));
  localStorage.setItem(STORAGE_KEYS.USER_ROUND_VOTES, JSON.stringify(userVotes));

  return { success: true };
}

// ============ Draft Round Votes ============

export function saveDraftRoundVotes(votes) {
  localStorage.setItem(STORAGE_KEYS.DRAFT_ROUND_VOTES, JSON.stringify(votes));
}

export function getDraftRoundVotes() {
  const stored = localStorage.getItem(STORAGE_KEYS.DRAFT_ROUND_VOTES);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function clearDraftRoundVotes() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT_ROUND_VOTES);
}

export function getCombinedMatchupVotes(matchupId) {
  const bracketVotes = getMatchupVotes(matchupId);
  const perRoundVotes = getPerRoundMatchupVotes(matchupId);

  const combined = { ...bracketVotes };
  Object.entries(perRoundVotes).forEach(([parkId, count]) => {
    if (!combined[parkId]) {
      combined[parkId] = 0;
    }
    combined[parkId] += count;
  });

  return combined;
}

// ============ Utilities ============

export function hasMatchupTie(matchupId) {
  const votes = getCombinedMatchupVotes(matchupId);
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

export function getRoundKeyFromMatchupId(matchupId) {
  if (matchupId.startsWith("r16")) return "round16";
  if (matchupId.startsWith("qf")) return "quarterfinals";
  if (matchupId.startsWith("sf")) return "semifinals";
  if (matchupId === "f-1") return "finals";
  return null;
}

// ============ Data Management (Admin) ============

export function exportAllData() {
  return {
    aggregateVotes: getAggregateVotes(),
    bracketLocked: isBracketLocked(),
    adminOverrides: getAdminOverrides(),
    activeRound: getActiveRound(),
    perRoundVotes: getPerRoundVotes(),
  };
}

export function importAllData(data) {
  if (data.aggregateVotes) {
    localStorage.setItem(STORAGE_KEYS.AGGREGATE_VOTES, JSON.stringify(data.aggregateVotes));
  }
  if (data.bracketLocked) {
    lockBracket();
  } else {
    unlockBracket();
  }
  if (data.adminOverrides) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_OVERRIDES, JSON.stringify(data.adminOverrides));
  }
  if (data.activeRound !== undefined) {
    setActiveRound(data.activeRound);
  }
  if (data.perRoundVotes) {
    localStorage.setItem(STORAGE_KEYS.PER_ROUND_VOTES, JSON.stringify(data.perRoundVotes));
  }
}

export function clearAllVotingData() {
  localStorage.removeItem(STORAGE_KEYS.USER_BRACKET);
  localStorage.removeItem(STORAGE_KEYS.AGGREGATE_VOTES);
  localStorage.removeItem(STORAGE_KEYS.BRACKET_LOCKED);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_OVERRIDES);
  localStorage.removeItem(STORAGE_KEYS.DRAFT_PICKS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROUND);
  localStorage.removeItem(STORAGE_KEYS.PER_ROUND_VOTES);
  localStorage.removeItem(STORAGE_KEYS.USER_ROUND_VOTES);
  localStorage.removeItem(STORAGE_KEYS.DRAFT_ROUND_VOTES);
}

// ============ Simulation (Dev Only) ============

const ROUND16_MATCHUPS = [
  { id: "r16-1", parkA: "golden-gate", parkB: "sunset-dunes" },
  { id: "r16-2", parkA: "corona-heights", parkB: "the-panhandle" },
  { id: "r16-3", parkA: "alamo-square", parkB: "alta-plaza" },
  { id: "r16-4", parkA: "buena-vista-park", parkB: "stern-grove" },
  { id: "r16-5", parkA: "presidio-tunnel-tops", parkB: "balboa-park" },
  { id: "r16-6", parkA: "twin-peaks", parkB: "marina-green" },
  { id: "r16-7", parkA: "dolores-park", parkB: "duboce-park" },
  { id: "r16-8", parkA: "lake-merced", parkB: "ocean-beach" },
];

const PROGRESSION = {
  "r16-1": { next: "qf-1", slot: "A" },
  "r16-2": { next: "qf-1", slot: "B" },
  "r16-3": { next: "qf-2", slot: "A" },
  "r16-4": { next: "qf-2", slot: "B" },
  "r16-5": { next: "qf-3", slot: "A" },
  "r16-6": { next: "qf-3", slot: "B" },
  "r16-7": { next: "qf-4", slot: "A" },
  "r16-8": { next: "qf-4", slot: "B" },
  "qf-1": { next: "sf-1", slot: "A" },
  "qf-2": { next: "sf-1", slot: "B" },
  "qf-3": { next: "sf-2", slot: "A" },
  "qf-4": { next: "sf-2", slot: "B" },
  "sf-1": { next: "f-1", slot: "A" },
  "sf-2": { next: "f-1", slot: "B" },
};

export function generateRandomBracket(bias = null) {
  const picks = {};
  const matchupParks = {};

  ROUND16_MATCHUPS.forEach((matchup) => {
    const options = [matchup.parkA, matchup.parkB];
    let pick;
    if (bias === "favorites") {
      pick = Math.random() < 0.7 ? matchup.parkA : matchup.parkB;
    } else if (bias === "underdogs") {
      pick = Math.random() < 0.7 ? matchup.parkB : matchup.parkA;
    } else {
      pick = options[Math.floor(Math.random() * 2)];
    }
    picks[matchup.id] = pick;

    const prog = PROGRESSION[matchup.id];
    if (!matchupParks[prog.next]) matchupParks[prog.next] = {};
    matchupParks[prog.next][prog.slot] = pick;
  });

  ["qf-1", "qf-2", "qf-3", "qf-4"].forEach((id) => {
    const parks = matchupParks[id];
    const options = [parks.A, parks.B];
    const pick = options[Math.floor(Math.random() * 2)];
    picks[id] = pick;

    const prog = PROGRESSION[id];
    if (!matchupParks[prog.next]) matchupParks[prog.next] = {};
    matchupParks[prog.next][prog.slot] = pick;
  });

  ["sf-1", "sf-2"].forEach((id) => {
    const parks = matchupParks[id];
    const options = [parks.A, parks.B];
    const pick = options[Math.floor(Math.random() * 2)];
    picks[id] = pick;

    const prog = PROGRESSION[id];
    if (!matchupParks[prog.next]) matchupParks[prog.next] = {};
    matchupParks[prog.next][prog.slot] = pick;
  });

  const finalParks = matchupParks["f-1"];
  picks["f-1"] = [finalParks.A, finalParks.B][Math.floor(Math.random() * 2)];

  return picks;
}

export function addSimulatedVotes(count = 10, bias = null) {
  const aggregate = getAggregateVotes();

  for (let i = 0; i < count; i++) {
    const picks = generateRandomBracket(bias);

    Object.entries(picks).forEach(([matchupId, parkId]) => {
      if (!parkId) return;

      if (!aggregate[matchupId]) {
        aggregate[matchupId] = {};
      }
      if (!aggregate[matchupId][parkId]) {
        aggregate[matchupId][parkId] = 0;
      }
      aggregate[matchupId][parkId]++;
    });
  }

  localStorage.setItem(STORAGE_KEYS.AGGREGATE_VOTES, JSON.stringify(aggregate));

  return {
    added: count,
    totalVoters: getTotalVoters(),
  };
}

export function clearSimulatedVotes() {
  localStorage.removeItem(STORAGE_KEYS.AGGREGATE_VOTES);

  const userBracket = getUserBracket();
  if (userBracket && userBracket.picks) {
    addVotesToAggregate(userBracket.picks);
  }
}

// Alias for compatibility with real API
export const simulateVoters = addSimulatedVotes;

// Expose for console debugging
if (typeof window !== "undefined") {
  window.bracketApi = {
    addVotes: addSimulatedVotes,
    clearVotes: clearSimulatedVotes,
    generateBracket: generateRandomBracket,
    getVotes: getAggregateVotes,
    getTotalVoters,
    exportAll: exportAllData,
    importAll: importAllData,
    getActiveRound,
    setActiveRound,
    getPerRoundVotes,
    getUserRoundVotes,
    submitPerRoundVote,
    getCombinedMatchupVotes,
  };
}
