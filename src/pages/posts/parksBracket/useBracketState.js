import { useState, useCallback } from "react";
import { INITIAL_BRACKET, BRACKET_PROGRESSION } from "./bracketData";

export function useBracketState() {
  const [bracket, setBracket] = useState(JSON.parse(JSON.stringify(INITIAL_BRACKET)));
  const [selectedMatchup, setSelectedMatchup] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);

  const selectWinner = useCallback((matchupId, winnerParkId) => {
    setBracket((prevBracket) => {
      const newBracket = JSON.parse(JSON.stringify(prevBracket));

      // Find the matchup
      let matchup = null;
      if (matchupId === "f-1") {
        matchup = newBracket.finals;
      } else {
        for (const roundKey of ["round16", "quarterfinals", "semifinals"]) {
          const found = newBracket[roundKey].find((m) => m.id === matchupId);
          if (found) {
            matchup = found;
            break;
          }
        }
      }

      if (!matchup) return prevBracket;

      // Check if winner is changing - if so, we need to clear downstream
      const previousWinner = matchup.winner;
      const winnerChanged = previousWinner !== null && previousWinner !== winnerParkId;

      // Set winner
      matchup.winner = winnerParkId;

      // If winner changed, clear downstream selections
      if (winnerChanged) {
        clearDownstream(newBracket, matchupId);
      }

      // Propagate to next round
      const progression = BRACKET_PROGRESSION[matchupId];
      if (progression) {
        if (progression.nextRound === "f-1") {
          newBracket.finals[progression.slot] = winnerParkId;
        } else {
          const nextRoundKey = progression.nextRound.startsWith("qf")
            ? "quarterfinals"
            : "semifinals";
          const nextMatchup = newBracket[nextRoundKey].find(
            (m) => m.id === progression.nextRound
          );
          if (nextMatchup) {
            nextMatchup[progression.slot] = winnerParkId;
          }
        }
      }

      // Set champion if finals winner selected
      if (matchupId === "f-1") {
        newBracket.champion = winnerParkId;
      }

      return newBracket;
    });
  }, []);

  // Clear all downstream selections when a winner changes
  const clearDownstream = (bracket, matchupId) => {
    const progression = BRACKET_PROGRESSION[matchupId];
    if (!progression) return;

    const clearMatchup = (id) => {
      if (id === "f-1") {
        bracket.finals.parkA = null;
        bracket.finals.parkB = null;
        bracket.finals.winner = null;
        bracket.champion = null;
        return;
      }

      const roundKey = id.startsWith("qf") ? "quarterfinals" : "semifinals";
      const matchup = bracket[roundKey].find((m) => m.id === id);
      if (matchup) {
        // Only clear the slot that was fed from the changed matchup
        const prog = BRACKET_PROGRESSION[matchupId];
        if (prog && prog.nextRound === id) {
          matchup[prog.slot] = null;
        }
        matchup.winner = null;

        // Recursively clear downstream
        const nextProg = BRACKET_PROGRESSION[id];
        if (nextProg) {
          clearMatchup(nextProg.nextRound);
        }
      }
    };

    clearMatchup(progression.nextRound);
  };

  const resetBracket = useCallback(() => {
    setBracket(JSON.parse(JSON.stringify(INITIAL_BRACKET)));
    setSelectedMatchup(null);
    setSelectedPark(null);
  }, []);

  const openStatsComparison = useCallback((matchupId) => {
    setSelectedMatchup(matchupId);
  }, []);

  const closeStatsComparison = useCallback(() => {
    setSelectedMatchup(null);
  }, []);

  const openParkDetail = useCallback((parkId) => {
    setSelectedPark(parkId);
  }, []);

  const closeParkDetail = useCallback(() => {
    setSelectedPark(null);
  }, []);

  return {
    bracket,
    selectedMatchup,
    selectedPark,
    selectWinner,
    resetBracket,
    openStatsComparison,
    closeStatsComparison,
    openParkDetail,
    closeParkDetail,
  };
}
