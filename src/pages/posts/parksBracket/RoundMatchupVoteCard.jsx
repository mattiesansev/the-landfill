import React from "react";
import { PARKS } from "./bracketData";

const RoundMatchupVoteCard = ({
  matchup,
  userVote,
  perRoundVotes,
  onVote,
}) => {
  const { id, parkA, parkB } = matchup;
  const parkAData = parkA ? PARKS[parkA] : null;
  const parkBData = parkB ? PARKS[parkB] : null;
  const votes = perRoundVotes[id] || {};

  // If either park is not determined yet
  if (!parkA || !parkB) {
    return (
      <div className="round-vote-card waiting">
        <div className="round-vote-matchup-id">{id}</div>
        <div className="round-vote-waiting">Waiting for previous round results...</div>
      </div>
    );
  }

  const parkAVotes = votes[parkA] || 0;
  const parkBVotes = votes[parkB] || 0;
  const totalVotes = parkAVotes + parkBVotes;

  return (
    <div className={`round-vote-card ${userVote ? "voted" : ""}`}>
      <div className="round-vote-buttons">
        <button
          className={`round-vote-btn ${userVote === parkA ? "selected" : ""}`}
          onClick={() => onVote(id, parkA)}
        >
          <span className="round-vote-park-name">{parkAData?.name || parkA}</span>
          {totalVotes > 0 && (
            <span className="round-vote-count">{parkAVotes}</span>
          )}
        </button>
        <span className="round-vote-vs">vs</span>
        <button
          className={`round-vote-btn ${userVote === parkB ? "selected" : ""}`}
          onClick={() => onVote(id, parkB)}
        >
          <span className="round-vote-park-name">{parkBData?.name || parkB}</span>
          {totalVotes > 0 && (
            <span className="round-vote-count">{parkBVotes}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default RoundMatchupVoteCard;
