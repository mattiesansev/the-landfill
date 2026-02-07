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

    // sourceMatchupId tracks which matchup feeds into the current one
    const clearMatchup = (id, sourceMatchupId) => {
      const prog = BRACKET_PROGRESSION[sourceMatchupId];

      if (id === "f-1") {
        // Only clear the slot that came from the affected side
        if (prog) {
          bracket.finals[prog.slot] = null;
        }
        bracket.finals.winner = null;
        bracket.champion = null;
        return;
      }

      const roundKey = id.startsWith("qf") ? "quarterfinals" : "semifinals";
      const matchup = bracket[roundKey].find((m) => m.id === id);
      if (matchup) {
        // Only clear the slot that was fed from the source matchup
        if (prog && prog.nextRound === id) {
          matchup[prog.slot] = null;
        }
        matchup.winner = null;

        // Recursively clear downstream, passing current matchup as the new source
        const nextProg = BRACKET_PROGRESSION[id];
        if (nextProg) {
          clearMatchup(nextProg.nextRound, id);
        }
      }
    };

    clearMatchup(progression.nextRound, matchupId);
  };

  const resetBracket = useCallback(() => {
    setBracket(JSON.parse(JSON.stringify(INITIAL_BRACKET)));
    setSelectedMatchup(null);
    setSelectedPark(null);
  }, []);

  // Reconstruct bracket state from a picks object (for loading persisted picks)
  const loadFromPicks = useCallback((picks) => {
    setBracket((prevBracket) => {
      // Start fresh
      const newBracket = JSON.parse(JSON.stringify(INITIAL_BRACKET));

      // If no picks, just reset to initial state
      if (!picks || Object.keys(picks).length === 0) {
        // Only update if different from current
        if (JSON.stringify(prevBracket) === JSON.stringify(newBracket)) {
          return prevBracket;
        }
        return newBracket;
      }

      // Helper to apply a single pick
      const applyPick = (matchupId, winnerParkId) => {
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

        if (!matchup) return;

        // Set winner
        matchup.winner = winnerParkId;

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
      };

      // Apply picks in order: r16 -> qf -> sf -> finals
      const orderedMatchups = [
        "r16-1", "r16-2", "r16-3", "r16-4", "r16-5", "r16-6", "r16-7", "r16-8",
        "qf-1", "qf-2", "qf-3", "qf-4",
        "sf-1", "sf-2",
        "f-1",
      ];

      orderedMatchups.forEach((matchupId) => {
        if (picks[matchupId]) {
          applyPick(matchupId, picks[matchupId]);
        }
      });

      // Only update if different from current
      if (JSON.stringify(prevBracket) === JSON.stringify(newBracket)) {
        return prevBracket;
      }
      return newBracket;
    });
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
    loadFromPicks,
    openStatsComparison,
    closeStatsComparison,
    openParkDetail,
    closeParkDetail,
  };
}
