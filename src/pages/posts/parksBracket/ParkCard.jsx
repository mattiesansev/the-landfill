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
  roundClass = "r16", // Only show seed in round of 16
  votePosition = null, // "park-a" or "park-b" — shows color dot next to name
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
      {roundClass === "r16" && <span className="seed">{park.seed}</span>}
      {votePosition && <span className={`color-dot ${votePosition}`} />}
      <span className="park-name">{park.name}</span>
      {isWinner && <span className="winner-indicator">&#10003;</span>}
      {userPickWrong && <span className="wrong-pick-indicator">&#10007;</span>}
      {isUserPick && !userPickWrong && !isWinner && (
        <span className="user-pick-indicator">*</span>
      )}
    </div>
  );
};

export default ParkCard;
