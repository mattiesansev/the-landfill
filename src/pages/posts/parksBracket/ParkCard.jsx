import React from "react";
import { PARKS } from "./bracketData";

const ParkCard = ({
  parkId,
  isWinner,
  isLoser,
  isChampion,
  onSelect,
  onParkNameClick,
}) => {
  if (!parkId) {
    return <div className="park-card empty">TBD</div>;
  }

  const park = PARKS[parkId];

  const handleNameClick = (e) => {
    e.stopPropagation();
    if (onParkNameClick) {
      onParkNameClick(parkId);
    }
  };

  return (
    <div
      className={`park-card ${isWinner ? "winner" : ""} ${isLoser ? "loser" : ""} ${isChampion ? "champion" : ""}`}
      onClick={onSelect}
    >
      <span className="seed">{park.seed}</span>
      <span className="park-name" onClick={handleNameClick}>
        {park.name}
      </span>
      {isWinner && <span className="winner-indicator">&#10003;</span>}
    </div>
  );
};

export default ParkCard;
