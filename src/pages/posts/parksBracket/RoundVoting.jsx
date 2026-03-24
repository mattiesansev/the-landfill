import React, { useState } from "react";
import RoundMatchupVoteCard from "./RoundMatchupVoteCard";

const ROUND_LABELS = {
  round16: "Sweet 16",
  quarterfinals: "Quarterfinals",
  semifinals: "Semifinals",
  finals: "Finals",
};

const RoundVoting = ({
  activeRound,
  matchups,
  draftRoundVotes,
  perRoundVotes,
  aggregateVotes,
  onDraftVote,
  onSubmitRoundVotes,
  isRoundVotesSubmitted,
  hasUnsavedRoundChanges,
  roundVotingProgress,
}) => {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeRound || !matchups || matchups.length === 0) {
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await onSubmitRoundVotes();

      if (!result.success) {
        setError(result.error);
      }
    } catch (e) {
      setError(e.message || "Failed to submit votes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { completed, total, isComplete } = roundVotingProgress;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  // Determine button state
  const showSubmitButton = !isRoundVotesSubmitted || hasUnsavedRoundChanges;
  const buttonText = isSubmitting
    ? "Submitting..."
    : isRoundVotesSubmitted && hasUnsavedRoundChanges
      ? "Update Votes"
      : "Submit Votes";

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
            userVote={draftRoundVotes[matchup.id] || null}
            perRoundVotes={perRoundVotes}
            aggregateVotes={aggregateVotes}
            onVote={onDraftVote}
          />
        ))}
      </div>

      {/* Submit panel at bottom after all vote cards */}
      <div className="round-voting-submit-panel">
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isRoundVotesSubmitted && !hasUnsavedRoundChanges && (
          <div className="round-submitted-status">Votes submitted</div>
        )}

        {error && <div className="submit-error">{error}</div>}

        {showSubmitButton && (
          <>
            <button
              className={`submit-btn ${isComplete ? "ready" : "disabled"}`}
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
            >
              {buttonText}
            </button>

            {!isComplete && (
              <div className="submit-hint">
                Vote on {total - completed} more matchup{total - completed !== 1 ? "s" : ""} to submit
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoundVoting;
