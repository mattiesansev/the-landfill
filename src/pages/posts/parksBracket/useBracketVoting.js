import { useState, useCallback, useMemo, useEffect } from "react";
import {
  getUserBracket,
  submitBracket as submitBracketService,
  getAggregateVotes,
  getAllWinners,
  validateBracketComplete,
  hasMatchupTie,
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
  isRoundClosed,
  getCombinedMatchupVotes,
  getRoundKeyFromMatchupId,
  saveDraftRoundVotes,
  getDraftRoundVotes as getDraftRoundVotesService,
  clearDraftRoundVotes,
} from "../../../services/bracketVoteService";
import { INITIAL_BRACKET, BRACKET_PROGRESSION } from "./bracketData";

export function useBracketVoting() {
  // User's picks (either from localStorage or current editing session)
  const [userPicks, setUserPicks] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // True when user is editing a submitted bracket

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

  // Load initial state from localStorage
  useEffect(() => {
    // DEV: Add ?clearBracket=true to URL to reset your submission
    const params = new URLSearchParams(window.location.search);
    if (params.get("clearBracket") === "true") {
      clearUserBracket();
      clearDraftPicks();
      // Remove param from URL without reload
      params.delete("clearBracket");
      const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
      console.log("[DEV] User bracket cleared via URL param");
    }

    const userBracket = getUserBracket();
    if (userBracket) {
      // Load from submitted bracket
      setUserPicks(userBracket.picks || {});
      setIsSubmitted(true);
      setSubmittedAt(userBracket.submittedAt);
    } else {
      // No submitted bracket - check for draft picks
      const draftPicks = getDraftPicks();
      if (draftPicks) {
        setUserPicks(draftPicks);
      }
    }

    setAggregateVotes(getAggregateVotes());
    setIsLocked(isBracketLocked());
    setActualWinners(getAllWinners());
    setPerRoundVotes(getPerRoundVotes());

    const existingUserRoundVotes = getUserRoundVotes();
    setUserRoundVotes(existingUserRoundVotes);

    const activeRd = getActiveRound();
    setActiveRoundState(activeRd);

    // Initialize draft round votes: from localStorage drafts, or from existing submitted votes
    if (activeRd) {
      const savedDrafts = getDraftRoundVotesService();
      const matchupIds = getMatchupIdsForRound(activeRd);

      // Filter saved drafts to only include matchups in the active round
      const filteredDrafts = {};
      matchupIds.forEach((id) => {
        if (savedDrafts[id]) {
          filteredDrafts[id] = savedDrafts[id];
        }
      });

      if (Object.keys(filteredDrafts).length > 0) {
        // Has drafts in progress for this round
        setDraftRoundVotes(filteredDrafts);
      } else {
        // Load from existing submitted votes for this round
        const existingForRound = {};
        matchupIds.forEach((id) => {
          if (existingUserRoundVotes[id]) {
            existingForRound[id] = existingUserRoundVotes[id];
          }
        });
        setDraftRoundVotes(existingForRound);
      }

      // Check if user has already submitted votes for all matchups in this round
      const hasAllVotes = matchupIds.every((id) => existingUserRoundVotes[id]);
      setIsRoundVotesSubmitted(hasAllVotes);
    }
  }, []);

  // Auto-save draft picks whenever userPicks changes (only if not submitted)
  useEffect(() => {
    // Only save drafts if user hasn't submitted yet (or is editing)
    // and there are actual picks to save
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
  const refreshVotingData = useCallback(() => {
    const locked = isBracketLocked();
    setAggregateVotes(getAggregateVotes());
    setIsLocked(locked);
    setActualWinners(getAllWinners());
    setPerRoundVotes(getPerRoundVotes());

    const existingUserRoundVotes = getUserRoundVotes();
    setUserRoundVotes(existingUserRoundVotes);

    const newActiveRound = getActiveRound();
    setActiveRoundState((prevActiveRound) => {
      // If active round changed, reset draft round votes
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

    // If bracket just locked, exit editing mode
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
  // Includes cascade clearing of downstream picks that become invalid
  const updatePick = useCallback(
    (matchupId, parkId) => {
      // Can't edit if bracket is locked
      if (isLocked) return;

      setUserPicks((prev) => {
        const oldPick = prev[matchupId];

        // If picking the same thing, no change needed
        if (oldPick === parkId) return prev;

        const newPicks = { ...prev, [matchupId]: parkId };

        // If there was an old pick, we need to clear downstream matchups
        // that had the old pick selected (since it's no longer advancing)
        if (oldPick) {
          const downstreamMatchups = getDownstreamMatchups(matchupId);

          for (const downstreamId of downstreamMatchups) {
            if (newPicks[downstreamId] === oldPick) {
              // This downstream pick was the park we just deselected
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
  const cancelEditing = useCallback(() => {
    const userBracket = getUserBracket();
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
  const submitUserBracket = useCallback(() => {
    if (isLocked) {
      return {
        success: false,
        error: "Voting is closed - bracket is locked.",
      };
    }

    const validation = validateBracketComplete(userPicks);
    if (!validation.isComplete) {
      return {
        success: false,
        error: "Please complete all matchup predictions before submitting.",
        missingPicks: validation.missingPicks,
      };
    }

    const result = submitBracketService(userPicks);

    if (result.error) {
      return { success: false, error: result.error };
    }

    setIsSubmitted(true);
    setSubmittedAt(result.bracket.submittedAt);
    setIsEditing(false);

    // Clear draft picks after successful submission
    clearDraftPicks();

    // Refresh aggregate votes and winners after submission
    setAggregateVotes(getAggregateVotes());
    setActualWinners(getAllWinners());

    return { success: true, isResubmission: !!result.bracket.firstSubmittedAt };
  }, [userPicks, isLocked]);

  // Get the display winner for a matchup
  // In "user" mode: returns user's pick
  // In "results" mode: returns actual winner (when locked) or user's pick
  const getDisplayWinner = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (viewMode === "results" && isRoundClosed(roundKey)) {
        return actualWinners[matchupId] || null;
      }

      return userPicks[matchupId] || null;
    },
    [viewMode, isLocked, activeRound, actualWinners, userPicks]
  );

  // Compute which parks are actually in a matchup based on actual winners
  // Returns null if we can't determine (e.g., due to a tie in a feeding matchup)
  const getActualMatchupParks = useCallback(
    (matchupId) => {
      // Round 16 - parks are fixed
      if (matchupId.startsWith("r16")) {
        const matchup = INITIAL_BRACKET.round16.find((m) => m.id === matchupId);
        return matchup ? { parkA: matchup.parkA, parkB: matchup.parkB, complete: true } : null;
      }

      // For later rounds, compute from actual winners
      // Find which matchups feed into this one
      const feedingMatchups = Object.entries(BRACKET_PROGRESSION).filter(
        ([_, prog]) => prog.nextRound === matchupId
      );

      const parks = { parkA: null, parkB: null };
      let allFeedingMatchupsResolved = true;

      feedingMatchups.forEach(([sourceMatchupId, prog]) => {
        const sourceRound = getRoundKeyFromMatchupId(sourceMatchupId);
        const winner = actualWinners[sourceMatchupId];

        if (isRoundClosed(sourceRound) && !winner) {
          // Round is closed but no winner (tie) - can't determine
          allFeedingMatchupsResolved = false;
        } else if (winner) {
          parks[prog.slot] = winner;
        } else {
          // Round not closed yet
          allFeedingMatchupsResolved = false;
        }
      });

      return { ...parks, complete: allFeedingMatchupsResolved };
    },
    [actualWinners, isLocked, activeRound]
  );

  // Check if user's pick matches the actual winner
  // Also verifies the user's pick was actually a valid contender in the actual matchup
  const doesUserPickMatch = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (!isRoundClosed(roundKey)) return null; // Round not closed yet

      const userPick = userPicks[matchupId];
      const actualWinner = actualWinners[matchupId];

      if (!userPick) return null;

      // For non-round16 matchups, verify the user's pick was actually in the matchup
      if (!matchupId.startsWith("r16")) {
        const actualParks = getActualMatchupParks(matchupId);
        if (actualParks && actualParks.complete) {
          const validParks = [actualParks.parkA, actualParks.parkB].filter(Boolean);
          // If user picked a park that didn't actually make it to this matchup, they're wrong
          if (validParks.length > 0 && !validParks.includes(userPick)) {
            return false;
          }
        } else if (actualParks && !actualParks.complete) {
          // Can't determine yet due to ties or incomplete previous rounds
          return null;
        }
      }

      // If no actual winner determined yet (tie), return null
      if (!actualWinner) return null;

      return userPick === actualWinner;
    },
    [userPicks, actualWinners, getActualMatchupParks]
  );

  // Get votes for display (when the matchup's round is closed)
  const getVotesForMatchup = useCallback(
    (matchupId) => {
      const roundKey = getRoundKeyFromMatchupId(matchupId);
      if (!isRoundClosed(roundKey)) {
        return null; // Don't show votes until round is closed
      }
      return getCombinedMatchupVotes(matchupId);
    },
    [aggregateVotes, perRoundVotes]
  );

  // Check if matchup should show vote counts
  const shouldShowVotes = useCallback(() => {
    return isLocked;
  }, [isLocked]);

  // Check if a matchup has a tie (for admin)
  const checkMatchupTie = useCallback((matchupId) => {
    return hasMatchupTie(matchupId);
  }, []);

  // Update a draft round vote (does not submit to API)
  const updateRoundVoteDraft = useCallback(
    (matchupId, parkId) => {
      setDraftRoundVotes((prev) => ({ ...prev, [matchupId]: parkId }));
    },
    []
  );

  // Submit all round votes at once
  const submitAllRoundVotes = useCallback(() => {
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
      const result = submitPerRoundVoteService(matchupId, draftRoundVotes[matchupId]);
      if (result.error) {
        return { success: false, error: result.error };
      }
    }

    // Update state - reset drafts to match submitted votes so auto-save doesn't re-save stale data
    const updatedUserRoundVotes = getUserRoundVotes();
    setPerRoundVotes(getPerRoundVotes());
    setUserRoundVotes(updatedUserRoundVotes);
    setActualWinners(getAllWinners());
    setIsRoundVotesSubmitted(true);

    // Reset draft state to match what was just submitted (prevents auto-save from re-saving)
    const submittedForRound = {};
    matchupIds.forEach((id) => {
      if (updatedUserRoundVotes[id]) {
        submittedForRound[id] = updatedUserRoundVotes[id];
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
      // Round 16 matchups have fixed parks
      if (matchupId.startsWith("r16")) {
        const matchup = INITIAL_BRACKET.round16.find((m) => m.id === matchupId);
        return matchup ? { id: matchupId, parkA: matchup.parkA, parkB: matchup.parkB } : null;
      }

      // Later rounds: resolve from actualWinners via BRACKET_PROGRESSION
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

  const totalMatchups = 15; // 8 + 4 + 2 + 1

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
    checkMatchupTie,

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
