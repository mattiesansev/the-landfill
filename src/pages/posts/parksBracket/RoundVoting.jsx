import React from "react";
import RoundMatchupVoteCard from "./RoundMatchupVoteCard";

const ROUND_LABELS = {
  round16: "Round of 16",
  quarterfinals: "Quarterfinals",
  semifinals: "Semifinals",
  finals: "Finals",
};

const RoundVoting = ({
  activeRound,
  matchups,
  userRoundVotes,
  perRoundVotes,
  onVote,
}) => {
  if (!activeRound || !matchups || matchups.length === 0) {
    return null;
  }

  return (
    <div className="round-voting-section">
      <h3 className="round-voting-header">
        {ROUND_LABELS[activeRound] || activeRound}
      </h3>
      <div className="round-voting-cards">
        {matchups.map((matchup) => (
          <RoundMatchupVoteCard
            key={matchup.id}
            matchup={matchup}
            userVote={userRoundVotes[matchup.id] || null}
            perRoundVotes={perRoundVotes}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
};

export default RoundVoting;
