import React from "react";
import ParkCard from "./ParkCard";
import VoteResultsOverlay from "./VoteResultsOverlay";

const MatchupCard = ({
  matchup,
  roundClass,
  isFlipped,
  onSelectWinner,
  onMatchupClick,
  onParkClick,
  // Voting props
  displayMode = "user", // "user" or "results"
  isLocked = false, // True if bracket is submitted
  votes = null, // Vote counts for this matchup (if closed round)
  actualWinner = null, // Community winner (for closed rounds)
  userPick = null, // User's pick for this matchup
  userPickMatches = null, // true/false/null - does user's pick match actual winner
}) => {
  const { id, parkA, parkB, winner } = matchup;

  const handleParkSelect = (parkId, e) => {
    e.stopPropagation();
    if (parkA && parkB && !isLocked) {
      onSelectWinner(id, parkId);
    }
  };

  const handleMatchupClick = () => {
    if (parkA && parkB) {
      onMatchupClick(id);
    }
  };

  const canInteract = parkA && parkB;
  const showVotes = votes && Object.keys(votes).length > 0;

  // Determine display winner based on mode
  // Only use actualWinner if it's one of the parks shown in this card;
  // otherwise fall back to the user's bracket pick.
  const actualWinnerIsDisplayed = actualWinner && (actualWinner === parkA || actualWinner === parkB);
  const displayWinner = displayMode === "results" && actualWinnerIsDisplayed
    ? actualWinner
    : winner;

  // Check if user's pick was wrong (for results mode)
  const userWasWrong = userPickMatches === false;

  return (
    <div
      className={`matchup-card ${roundClass} ${canInteract ? "interactive" : "waiting"} ${isFlipped ? "flipped" : ""} ${isLocked ? "locked" : ""} ${userWasWrong ? "user-wrong" : ""}`}
      onClick={handleMatchupClick}
    >
      <div className="matchup-card-inner">
        <div className="matchup-card-front">
          <ParkCard
            parkId={parkA}
            isWinner={displayWinner === parkA}
            isLoser={displayWinner && displayWinner !== parkA}
            onSelect={(e) => handleParkSelect(parkA, e)}
            onParkNameClick={onParkClick}
            isUserPick={userPick === parkA && displayMode === "results"}
            userPickWrong={userPick === parkA && userWasWrong}
          />
          <div className="matchup-divider">vs</div>
          <ParkCard
            parkId={parkB}
            isWinner={displayWinner === parkB}
            isLoser={displayWinner && displayWinner !== parkB}
            onSelect={(e) => handleParkSelect(parkB, e)}
            onParkNameClick={onParkClick}
            isUserPick={userPick === parkB && displayMode === "results"}
            userPickWrong={userPick === parkB && userWasWrong}
          />
          {showVotes && (
            <VoteResultsOverlay
              parkAId={parkA}
              parkBId={parkB}
              votes={votes}
              winner={actualWinner}
            />
          )}
          {canInteract && !displayWinner && !isLocked && (
            <div className="view-stats-hint">Click to compare</div>
          )}
          {isLocked && !displayWinner && (
            <div className="view-stats-hint">Awaiting results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchupCard;
