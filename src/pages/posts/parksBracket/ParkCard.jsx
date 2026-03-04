import React from "react";
import { PARKS } from "./bracketData";

const ParkCard = ({
  parkId,
  isWinner,
  isLoser,
  isChampion,
  onSelect,
  onParkNameClick,
  isUserPick = false, // Show indicator that this was user's pick
  userPickWrong = false, // User picked this but it lost
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

  const classNames = [
    "park-card",
    isWinner ? "winner" : "",
    isLoser ? "loser" : "",
    isChampion ? "champion" : "",
    isUserPick ? "user-pick" : "",
    userPickWrong ? "user-pick-wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} onClick={onSelect}>
      <span className="seed">{park.seed}</span>
      <span className="park-name">{park.name}</span>
      {isWinner && <span className="winner-indicator">&#10003;</span>}
      {userPickWrong && <span className="wrong-pick-indicator">&#10007;</span>}
      {isUserPick && !userPickWrong && !isWinner && (
        <span className="user-pick-indicator">*</span>
      )}
      {onParkNameClick && (
        <button className="park-info-btn" onClick={handleNameClick} aria-label={`Info about ${park.name}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" />
            <line x1="12" y1="12" x2="12" y2="16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ParkCard;
