import React from "react";
import { PARKS } from "./bracketData";

const VoteResultsOverlay = ({ parkAId, parkBId, votes, winner }) => {
  if (!votes || Object.keys(votes).length === 0) {
    return null;
  }

  const parkAVotes = votes[parkAId] || 0;
  const parkBVotes = votes[parkBId] || 0;
  const totalVotes = parkAVotes + parkBVotes;

  if (totalVotes === 0) {
    return null;
  }

  const parkAPercent = Math.round((parkAVotes / totalVotes) * 100);
  const parkBPercent = 100 - parkAPercent;

  const isTie = parkAVotes === parkBVotes;

  return (
    <div className="vote-results-overlay">
      <div className="vote-bar">
        <div
          className={`vote-bar-fill park-a ${winner === parkAId ? "winner" : ""}`}
          style={{ width: `${parkAPercent}%` }}
        />
        <div
          className={`vote-bar-fill park-b ${winner === parkBId ? "winner" : ""}`}
          style={{ width: `${parkBPercent}%` }}
        />
      </div>
      <div className="vote-counts">
        <span className={`vote-count park-a ${winner === parkAId ? "winner" : ""}`}>
          {parkAVotes}
        </span>
        <span className="vote-label">{isTie ? "TIE" : "votes"}</span>
        <span className={`vote-count park-b ${winner === parkBId ? "winner" : ""}`}>
          {parkBVotes}
        </span>
      </div>
    </div>
  );
};

export default VoteResultsOverlay;
