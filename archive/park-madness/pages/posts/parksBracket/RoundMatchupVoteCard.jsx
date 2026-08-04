import React from "react";
import { PARKS } from "./bracketData";

const RoundMatchupVoteCard = ({
  matchup,
  userVote,
  perRoundVotes,
  aggregateVotes,
  onVote,
}) => {
  const { id, parkA, parkB } = matchup;
  const parkAData = parkA ? PARKS[parkA] : null;
  const parkBData = parkB ? PARKS[parkB] : null;
  const roundVotes = perRoundVotes[id] || {};
  const bracketVotes = aggregateVotes?.[id] || {};

  // If either park is not determined yet
  if (!parkA || !parkB) {
    return (
      <div className="round-vote-card waiting">
        <div className="round-vote-matchup-id">{id}</div>
        <div className="round-vote-waiting">Waiting for previous round results...</div>
      </div>
    );
  }

  // Mirror getCombinedVotesLocal: R16 combines bracket + per-round, QF+ uses per-round only
  const isR16 = id.startsWith('r16');
  const combinedA = (isR16 ? (bracketVotes[parkA] || 0) : 0) + (roundVotes[parkA] || 0);
  const combinedB = (isR16 ? (bracketVotes[parkB] || 0) : 0) + (roundVotes[parkB] || 0);
  const totalVotes = combinedA + combinedB;
  const percentA = totalVotes > 0 ? (combinedA / totalVotes) * 100 : 50;

  return (
    <div className={`round-vote-card ${userVote ? "voted" : ""}`}>
      <div className="round-vote-buttons">
        <button
          className={`round-vote-btn ${userVote === parkA ? "selected" : ""}`}
          onClick={() => onVote(id, parkA)}
        >
          <span className="round-vote-park-name">{parkAData?.name || parkA}</span>
          {totalVotes > 0 && (
            <span className="round-vote-count">{combinedA}</span>
          )}
        </button>
        <span className="round-vote-vs">vs</span>
        <button
          className={`round-vote-btn ${userVote === parkB ? "selected" : ""}`}
          onClick={() => onVote(id, parkB)}
        >
          <span className="round-vote-park-name">{parkBData?.name || parkB}</span>
          {totalVotes > 0 && (
            <span className="round-vote-count">{combinedB}</span>
          )}
        </button>
      </div>
      {totalVotes > 0 && (
        <div className="round-vote-bar">
          <div
            className="round-vote-bar-fill left"
            style={{ width: `${percentA}%` }}
          />
          <div
            className="round-vote-bar-fill right"
            style={{ width: `${100 - percentA}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default RoundMatchupVoteCard;
