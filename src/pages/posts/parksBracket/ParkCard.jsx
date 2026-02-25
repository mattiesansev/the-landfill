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
      <span className="park-name" onClick={handleNameClick}>
        {park.name}
      </span>
      {isWinner && <span className="winner-indicator">&#10003;</span>}
      {userPickWrong && <span className="wrong-pick-indicator">&#10007;</span>}
      {isUserPick && !userPickWrong && !isWinner && (
        <span className="user-pick-indicator">*</span>
      )}
    </div>
  );
};

export default ParkCard;
