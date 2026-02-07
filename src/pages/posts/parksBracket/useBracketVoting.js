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
  }, []);

  // Auto-save draft picks whenever userPicks changes (only if not submitted)
  useEffect(() => {
    // Only save drafts if user hasn't submitted yet (or is editing)
    // and there are actual picks to save
    if (!isSubmitted && Object.keys(userPicks).length > 0) {
      saveDraftPicks(userPicks);
    }
  }, [userPicks, isSubmitted]);

  // Refresh voting data (call this after admin changes)
  const refreshVotingData = useCallback(() => {
    const locked = isBracketLocked();
    setAggregateVotes(getAggregateVotes());
    setIsLocked(locked);
    setActualWinners(getAllWinners());

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

    // Refresh aggregate votes after submission
    setAggregateVotes(getAggregateVotes());

    return { success: true, isResubmission: !!result.bracket.firstSubmittedAt };
  }, [userPicks, isLocked]);

  // Get the display winner for a matchup
  // In "user" mode: returns user's pick
  // In "results" mode: returns actual winner (when locked) or user's pick
  const getDisplayWinner = useCallback(
    (matchupId) => {
      if (viewMode === "results" && isLocked) {
        return actualWinners[matchupId] || null;
      }

      return userPicks[matchupId] || null;
    },
    [viewMode, isLocked, actualWinners, userPicks]
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
        const winner = actualWinners[sourceMatchupId];

        if (isLocked && !winner) {
          // Bracket is locked but no winner (tie) - can't determine
          allFeedingMatchupsResolved = false;
        } else if (winner) {
          parks[prog.slot] = winner;
        } else {
          // Not locked yet
          allFeedingMatchupsResolved = false;
        }
      });

      return { ...parks, complete: allFeedingMatchupsResolved };
    },
    [actualWinners, isLocked]
  );

  // Check if user's pick matches the actual winner
  // Also verifies the user's pick was actually a valid contender in the actual matchup
  const doesUserPickMatch = useCallback(
    (matchupId) => {
      if (!isLocked) return null; // Bracket not locked yet

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
    [isLocked, userPicks, actualWinners, getActualMatchupParks]
  );

  // Get votes for display (only when locked)
  const getVotesForMatchup = useCallback(
    (matchupId) => {
      if (!isLocked) {
        return null; // Don't show votes until locked
      }
      return aggregateVotes[matchupId] || {};
    },
    [isLocked, aggregateVotes]
  );

  // Check if matchup should show vote counts
  const shouldShowVotes = useCallback(() => {
    return isLocked;
  }, [isLocked]);

  // Check if a matchup has a tie (for admin)
  const checkMatchupTie = useCallback((matchupId) => {
    return hasMatchupTie(matchupId);
  }, []);

  // Validation state
  const bracketValidation = useMemo(() => {
    return validateBracketComplete(userPicks);
  }, [userPicks]);

  // Count of completed picks
  const completedPicksCount = useMemo(() => {
    return Object.keys(userPicks).length;
  }, [userPicks]);

  const totalMatchups = 15; // 8 + 4 + 2 + 1

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
  };
}
