import React from "react";
import ParkCard from "./ParkCard";

const MatchupCard = ({
  matchup,
  roundClass,
  isFlipped,
  onSelectWinner,
  onMatchupClick,
  onParkClick,
}) => {
  const { id, parkA, parkB, winner } = matchup;

  const handleParkSelect = (parkId, e) => {
    e.stopPropagation();
    if (parkA && parkB) {
      onSelectWinner(id, parkId);
    }
  };

  const handleMatchupClick = () => {
    if (parkA && parkB) {
      onMatchupClick(id);
    }
  };

  const canInteract = parkA && parkB;

  return (
    <div
      className={`matchup-card ${roundClass} ${canInteract ? "interactive" : "waiting"} ${isFlipped ? "flipped" : ""}`}
      onClick={handleMatchupClick}
    >
      <div className="matchup-card-inner">
        <div className="matchup-card-front">
          <ParkCard
            parkId={parkA}
            isWinner={winner === parkA}
            isLoser={winner && winner !== parkA}
            onSelect={(e) => handleParkSelect(parkA, e)}
            onParkNameClick={onParkClick}
          />
          <div className="matchup-divider">vs</div>
          <ParkCard
            parkId={parkB}
            isWinner={winner === parkB}
            isLoser={winner && winner !== parkB}
            onSelect={(e) => handleParkSelect(parkB, e)}
            onParkNameClick={onParkClick}
          />
          {canInteract && !winner && (
            <div className="view-stats-hint">Click to compare</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchupCard;
