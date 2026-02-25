import { useState, useCallback, useMemo, useEffect } from "react";
import {
  getUserBracket,
  submitBracket as submitBracketService,
  getAggregateVotes,
  getAllWinners,
  validateBracketComplete,
  clearUserBracket,
  isBracketLocked,
  saveDraftPicks,
  getDraftPicks,
  clearDraftPicks,
  getActiveRound,
  getPerRoundVotes,
  getUserRoundVotes,
  submitPerRoundVote as submitPerRoundVoteService,
  getMatchupIdsForRound,
  getRoundKeyFromMatchupId,
  saveDraftRoundVotes,
  getDraftRoundVotes as getDraftRoundVotesService,
  clearDraftRoundVotes,
} from "../../../services/bracketVoteService";
import { INITIAL_BRACKET, BRACKET_PROGRESSION } from "./bracketData";

const ROUND_ORDER = ["round16", "quarterfinals", "semifinals", "finals"];

export function useBracketVoting() {
  // Loading state for async data fetching
  const [isLoading, setIsLoading] = useState(true);

  // User's picks (either from localStorage or current editing session)
  const [userPicks, setUserPicks] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Voting data
  const [aggregateVotes, setAggregateVotes] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [actualWinners, setActualWinners] = useState({});

  // Per-round voting
  const [activeRound, setActiveRoundState] = useState(null);
  const [perRoundVotes, setPerRoundVotes] = useState({});
  const [userRoundVotes, setUserRoundVotes] = useState({});
  const [draftRoundVotes, setDraftRoundVotes] = useState({});
  const [isRoundVotesSubmitted, setIsRoundVotesSubmitted] = useState(false);

  // View mode: "user" shows user's picks, "results" shows community results
  const [viewMode, setViewMode] = useState("user");

  // Editing is allowed when bracket is not locked
  const editingAllowed = !isLocked;

  // ---- Local helpers (use React state, avoid async service calls in render) ----

  const isRoundClosedLocal = useCallback(
    (roundKey) => {
      if (activeRound === "completed") return true;
      if (!activeRound) return false;
      const activeIdx = ROUND_ORDER.indexOf(activeRound);
      const roundIdx = ROUND_ORDER.indexOf(roundKey);
      if (activeIdx === -1 || roundIdx === -1) return false;
      return roundIdx < activeIdx;
    },
    [activeRound]
  );

  const getCombinedVotesLocal = useCallback(
    (matchupId) => {
      const bracket = aggregateVotes[matchupId] || {};
      const round = perRoundVotes[matchupId] || {};
      const combined = { ...bracket };
      Object.entries(round).forEach(([parkId, count]) => {
        combined[parkId] = (combined[parkId] || 0) + count;
      });
      return combined;
    },
    [aggregateVotes, perRoundVotes]
  );

  // ---- Viewing phase (progressive reveal, auto-derived from admin-controlled state) ----

  const viewingPhase = useMemo(() => {
    if (activeRound === "completed") return "complete";
    if (!activeRound) return "preRound";
    const activeIdx = ROUND_ORDER.indexOf(activeRound);
    if (activeIdx <= 0) return "preRound"; // round16 is active, nothing closed yet
    return ROUND_ORDER[activeIdx - 1]; // last closed round
  }, [activeRound]);

  const isRoundRevealedByPhase = useCallback(
    (roundKey) => {
      if (viewingPhase === "preRound") return false;
      if (viewingPhase === "complete") return true;
      const phaseIdx = ROUND_ORDER.indexOf(viewingPhase);
      const roundIdx = ROUND_ORDER.indexOf(roundKey);
      if (phaseIdx === -1 || roundIdx === -1) return false;
      return roundIdx <= phaseIdx;
    },
    [viewingPhase]
  );

  // ---- Load initial state ----

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      // DEV: Add ?clearBracket=true to URL to reset your submission
      const params = new URLSearchParams(window.location.search);
      if (params.get("clearBracket") === "true") {
        await clearUserBracket();
        clearDraftPicks();
        params.delete("clearBracket");
        const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, "", newUrl);
        console.log("[DEV] User bracket cleared via URL param");
      }

      const [userBracket, locked, winners, aggVotes, roundVotes, existingUserRoundVotes, activeRd] =
        await Promise.all([
          getUserBracket(),
          isBracketLocked(),
          getAllWinners(),
          getAggregateVotes(),
          getPerRoundVotes(),
          getUserRoundVotes(),
          getActiveRound(),
        ]);

      if (cancelled) return;

      if (userBracket) {
        setUserPicks(userBracket.picks || {});
        setIsSubmitted(true);
        setSubmittedAt(userBracket.submittedAt);
      } else {
        const draftPicks = getDraftPicks();
        if (draftPicks) {
          setUserPicks(draftPicks);
        }
      }

      setAggregateVotes(aggVotes);
      setIsLocked(locked);
      setActualWinners(winners);
      setPerRoundVotes(roundVotes);
      setUserRoundVotes(existingUserRoundVotes);
      setActiveRoundState(activeRd);

      // Initialize draft round votes
      if (activeRd) {
        const savedDrafts = getDraftRoundVotesService();
        const matchupIds = getMatchupIdsForRound(activeRd);

        const filteredDrafts = {};
        matchupIds.forEach((id) => {
          if (savedDrafts[id]) {
            filteredDrafts[id] = savedDrafts[id];
          }
        });

        if (Object.keys(filteredDrafts).length > 0) {
          setDraftRoundVotes(filteredDrafts);
        } else {
          const existingForRound = {};
          matchupIds.forEach((id) => {
            if (existingUserRoundVotes[id]) {
              existingForRound[id] = existingUserRoundVotes[id];
            }
          });
          setDraftRoundVotes(existingForRound);
        }

        const hasAllVotes = matchupIds.every((id) => existingUserRoundVotes[id]);
        setIsRoundVotesSubmitted(hasAllVotes);
      }

      setIsLoading(false);
    }

    loadInitialData();
    return () => { cancelled = true; };
  }, []);

  // Auto-save draft picks whenever userPicks changes (only if not submitted)
  useEffect(() => {
    if (!isSubmitted && Object.keys(userPicks).length > 0) {
      saveDraftPicks(userPicks);
    }
  }, [userPicks, isSubmitted]);

  // Auto-save draft round votes only when there are unsaved changes
  useEffect(() => {
    if (!activeRound) return;
    const matchupIds = getMatchupIdsForRound(activeRound);
    const hasDraftChanges = matchupIds.some((id) => draftRoundVotes[id] && draftRoundVotes[id] !== userRoundVotes[id]);
    if (hasDraftChanges) {
      saveDraftRoundVotes(draftRoundVotes);
    }
  }, [draftRoundVotes, userRoundVotes, activeRound]);

  // Refresh voting data (call this after admin changes)
  const refreshVotingData = useCallback(async () => {
    const [locked, aggVotes, winners, roundVotes, existingUserRoundVotes, newActiveRound] =
      await Promise.all([
        isBracketLocked(),
        getAggregateVotes(),
        getAllWinners(),
        getPerRoundVotes(),
        getUserRoundVotes(),
        getActiveRound(),
      ]);

    setAggregateVotes(aggVotes);
    setIsLocked(locked);
    setActualWinners(winners);
    setPerRoundVotes(roundVotes);
    setUserRoundVotes(existingUserRoundVotes);

    setActiveRoundState((prevActiveRound) => {
      if (newActiveRound !== prevActiveRound) {
        clearDraftRoundVotes();
        setIsRoundVotesSubmitted(false);
        if (newActiveRound) {
          const matchupIds = getMatchupIdsForRound(newActiveRound);
          const existingForRound = {};
          matchupIds.forEach((id) => {
            if (existingUserRoundVotes[id]) {
              existingForRound[id] = existingUserRoundVotes[id];
            }
          });
          setDraftRoundVotes(existingForRound);
          setIsRoundVotesSubmitted(matchupIds.every((id) => existingUserRoundVotes[id]));
        } else {
          setDraftRoundVotes({});
        }
      }
      return newActiveRound;
    });

    if (locked) {
      setIsEditing(false);
    }
  }, []);

  // Get all downstream matchups that a pick could cascade into
  const getDownstreamMatchups = useCallback((matchupId) => {
    const downstream = [];
    let currentId = matchupId;

    while (BRACKET_PROGRESSION[currentId]) {
      const nextMatchupId = BRACKET_PROGRESSION[currentId].nextRound;
      downstream.push(nextMatchupId);
      currentId = nextMatchupId;
    }

    return downstream;
  }, []);

  // Update a user's pick (allowed until bracket is locked)
  const updatePick = useCallback(
    (matchupId, parkId) => {
      if (isLocked) return;

      setUserPicks((prev) => {
        const oldPick = prev[matchupId];
        if (oldPick === parkId) return prev;

        const newPicks = { ...prev, [matchupId]: parkId };

        if (oldPick) {
          const downstreamMatchups = getDownstreamMatchups(matchupId);
          for (const downstreamId of downstreamMatchups) {
            if (newPicks[downstreamId] === oldPick) {
              delete newPicks[downstreamId];
            }
          }
        }

        return newPicks;
      });
    },
    [isLocked, getDownstreamMatchups]
  );

  // Start editing a submitted bracket
  const startEditing = useCallback(() => {
    if (editingAllowed && isSubmitted) {
      setIsEditing(true);
    }
  }, [editingAllowed, isSubmitted]);

  // Cancel editing and revert to submitted picks
  const cancelEditing = useCallback(async () => {
    const userBracket = await getUserBracket();
    if (userBracket) {
      setUserPicks(userBracket.picks || {});
    }
    setIsEditing(false);
  }, []);

  // Reset all picks (clear state and draft storage)
  const resetPicks = useCallback(() => {
    setUserPicks({});
    clearDraftPicks();
  }, []);

  // Submit the bracket (or re-submit if editing)
  const submitUserBracket = useCallback(async () => {
    if (isLocked) {
      return { success: false, error: "Voting is closed - bracket is locked." };
    }

    const validation = validateBracketComplete(userPicks);
    if (!validation.isComplete) {
      return {
        success: false,
        error: "Please complete all matchup predictions before submitting.",
        missingPicks: validation.missingPicks,
      };
    }

    const result = await submitBracketService(userPicks);

    if (result.error) {
      return { success: false, error: result.error };
    }

    setIsSubmitted(true);
    setSubmittedAt(result.bracket.submittedAt);
    setIsEditing(false);
    clearDraftPicks();

    // Refresh aggregate votes and winners after submission
    const [aggVotes, winners] = await Promise.all([getAggregateVotes(), getAllWinners()]);
    setAggregateVotes(aggVotes);
    setActualWinners(winners);

    return { success: true, isResubmission: !!result.bracket.firstSubmittedAt };
  }, [userPicks, isLocked]);

  // Get the display winner for a matchup
  const getDisplayWinner = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (viewMode === "results" && isRoundClosedLocal(roundKey) && isRoundRevealedByPhase(roundKey)) {
        return actualWinners[matchupId] || null;
      }
      return userPicks[matchupId] || null;
    },
    [viewMode, isRoundClosedLocal, isRoundRevealedByPhase, actualWinners, userPicks]
  );

  // Compute which parks are actually in a matchup based on actual winners
  const getActualMatchupParks = useCallback(
    (matchupId) => {
      if (matchupId.startsWith("r16")) {
        const matchup = INITIAL_BRACKET.round16.find((m) => m.id === matchupId);
        return matchup ? { parkA: matchup.parkA, parkB: matchup.parkB, complete: true } : null;
      }

      const feedingMatchups = Object.entries(BRACKET_PROGRESSION).filter(
        ([_, prog]) => prog.nextRound === matchupId
      );

      const parks = { parkA: null, parkB: null };
      let allFeedingMatchupsResolved = true;

      feedingMatchups.forEach(([sourceMatchupId, prog]) => {
        const sourceRound = getRoundKeyFromMatchupId(sourceMatchupId);
        const winner = actualWinners[sourceMatchupId];

        if (isRoundClosedLocal(sourceRound) && !winner) {
          allFeedingMatchupsResolved = false;
        } else if (winner) {
          parks[prog.slot] = winner;
        } else {
          allFeedingMatchupsResolved = false;
        }
      });

      return { ...parks, complete: allFeedingMatchupsResolved };
    },
    [actualWinners, isRoundClosedLocal]
  );

  // Check if user's pick matches the actual winner
  const doesUserPickMatch = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (!isRoundClosedLocal(roundKey) || !isRoundRevealedByPhase(roundKey)) return null;

      const userPick = userPicks[matchupId];
      const actualWinner = actualWinners[matchupId];

      if (!userPick) return null;

      if (!matchupId.startsWith("r16")) {
        const actualParks = getActualMatchupParks(matchupId);
        if (actualParks && actualParks.complete) {
          const validParks = [actualParks.parkA, actualParks.parkB].filter(Boolean);
          if (validParks.length > 0 && !validParks.includes(userPick)) {
            return false;
          }
        } else if (actualParks && !actualParks.complete) {
          return null;
        }
      }

      if (!actualWinner) return null;
      return userPick === actualWinner;
    },
    [userPicks, actualWinners, getActualMatchupParks, isRoundClosedLocal, isRoundRevealedByPhase]
  );

  // Get votes for display (when the matchup's round is closed AND revealed by phase)
  const getVotesForMatchup = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (!isRoundClosedLocal(roundKey) || !isRoundRevealedByPhase(roundKey)) {
        return null;
      }
      return getCombinedVotesLocal(matchupId);
    },
    [isRoundClosedLocal, isRoundRevealedByPhase, getCombinedVotesLocal]
  );

  // Check if matchup should show vote counts
  const shouldShowVotes = useCallback(() => {
    return isLocked;
  }, [isLocked]);

  // Check if a matchup has a tie
  const checkMatchupTie = useCallback(
    (matchupId) => {
      const votes = getCombinedVotesLocal(matchupId);
      if (Object.keys(votes).length < 2) return false;
      const sorted = Object.values(votes).sort((a, b) => b - a);
      return sorted[0] === sorted[1];
    },
    [getCombinedVotesLocal]
  );

  // Check if a matchup's round is closed and revealed (for per-matchup display mode)
  const shouldShowResults = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      return isRoundClosedLocal(roundKey) && isRoundRevealedByPhase(roundKey);
    },
    [isRoundClosedLocal, isRoundRevealedByPhase]
  );

  // Update a draft round vote (does not submit to API)
  const updateRoundVoteDraft = useCallback(
    (matchupId, parkId) => {
      setDraftRoundVotes((prev) => ({ ...prev, [matchupId]: parkId }));
    },
    []
  );

  // Submit all round votes at once
  const submitAllRoundVotes = useCallback(async () => {
    if (!activeRound) {
      return { success: false, error: "No active round for voting" };
    }

    const matchupIds = getMatchupIdsForRound(activeRound);
    const missingVotes = matchupIds.filter((id) => !draftRoundVotes[id]);

    if (missingVotes.length > 0) {
      return {
        success: false,
        error: `Please vote on all ${missingVotes.length} remaining matchups`,
      };
    }

    // Submit each vote
    for (const matchupId of matchupIds) {
      const result = await submitPerRoundVoteService(matchupId, draftRoundVotes[matchupId]);
      if (result.error) {
        return { success: false, error: result.error };
      }
    }

    // Refresh state after submission
    const [updatedRoundVotes, updatedPerRoundVotes, winners] = await Promise.all([
      getUserRoundVotes(),
      getPerRoundVotes(),
      getAllWinners(),
    ]);

    setPerRoundVotes(updatedPerRoundVotes);
    setUserRoundVotes(updatedRoundVotes);
    setActualWinners(winners);
    setIsRoundVotesSubmitted(true);

    // Reset draft state to match what was just submitted
    const submittedForRound = {};
    matchupIds.forEach((id) => {
      if (updatedRoundVotes[id]) {
        submittedForRound[id] = updatedRoundVotes[id];
      }
    });
    setDraftRoundVotes(submittedForRound);
    clearDraftRoundVotes();

    return { success: true, isResubmission: isRoundVotesSubmitted };
  }, [activeRound, draftRoundVotes, isRoundVotesSubmitted]);

  // Get matchups for the active round with resolved park IDs
  const getActiveRoundMatchups = useCallback(() => {
    if (!activeRound) return [];

    const matchupIds = getMatchupIdsForRound(activeRound);

    return matchupIds.map((matchupId) => {
      if (matchupId.startsWith("r16")) {
        const matchup = INITIAL_BRACKET.round16.find((m) => m.id === matchupId);
        return matchup ? { id: matchupId, parkA: matchup.parkA, parkB: matchup.parkB } : null;
      }

      const feedingMatchups = Object.entries(BRACKET_PROGRESSION).filter(
        ([_, prog]) => prog.nextRound === matchupId
      );

      let parkA = null;
      let parkB = null;

      feedingMatchups.forEach(([sourceId, prog]) => {
        const winner = actualWinners[sourceId];
        if (winner) {
          if (prog.slot === "parkA") parkA = winner;
          else parkB = winner;
        }
      });

      return { id: matchupId, parkA, parkB };
    }).filter(Boolean);
  }, [activeRound, actualWinners]);

  // Validation state
  const bracketValidation = useMemo(() => {
    return validateBracketComplete(userPicks);
  }, [userPicks]);

  // Count of completed picks
  const completedPicksCount = useMemo(() => {
    return Object.keys(userPicks).length;
  }, [userPicks]);

  const totalMatchups = 15;

  // Round voting progress
  const roundVotingProgress = useMemo(() => {
    if (!activeRound) return { completed: 0, total: 0, isComplete: false };
    const matchupIds = getMatchupIdsForRound(activeRound);
    const completed = matchupIds.filter((id) => draftRoundVotes[id]).length;
    return {
      completed,
      total: matchupIds.length,
      isComplete: completed === matchupIds.length,
    };
  }, [activeRound, draftRoundVotes]);

  // Check if drafts differ from submitted votes
  const hasUnsavedRoundChanges = useMemo(() => {
    if (!activeRound) return false;
    const matchupIds = getMatchupIdsForRound(activeRound);
    return matchupIds.some((id) => draftRoundVotes[id] !== userRoundVotes[id]);
  }, [activeRound, draftRoundVotes, userRoundVotes]);

  return {
    // Loading state
    isLoading,

    // User's bracket state
    userPicks,
    isSubmitted,
    submittedAt,
    updatePick,
    submitUserBracket,
    resetPicks,

    // Editing state
    isEditing,
    isLocked,
    editingAllowed,
    startEditing,
    cancelEditing,

    // Validation
    bracketValidation,
    completedPicksCount,
    totalMatchups,

    // Voting data
    aggregateVotes,
    actualWinners,
    refreshVotingData,

    // View mode
    viewMode,
    setViewMode,

    // Display helpers
    getDisplayWinner,
    doesUserPickMatch,
    getVotesForMatchup,
    shouldShowVotes,
    shouldShowResults,
    checkMatchupTie,

    // Viewing phase (auto-derived, read-only)
    viewingPhase,

    // Per-round voting
    activeRound,
    perRoundVotes,
    userRoundVotes,
    draftRoundVotes,
    updateRoundVoteDraft,
    submitAllRoundVotes,
    isRoundVotesSubmitted,
    hasUnsavedRoundChanges,
    roundVotingProgress,
    getActiveRoundMatchups,
  };
}
