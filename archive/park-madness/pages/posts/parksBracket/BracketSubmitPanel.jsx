import React, { useState } from "react";

const BracketSubmitPanel = ({
  isSubmitted,
  submittedAt,
  completedPicksCount,
  totalMatchups,
  bracketValidation,
  onSubmit,
  // New props for editing
  isEditing = false,
  isLocked = false,
  editingAllowed = true,
  onStartEditing,
  onCancelEditing,
}) => {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setError(null);
    setIsSubmitting(true);

    const result = onSubmit();

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };


  // Editing mode or first-time submission
  const progressPercent = (completedPicksCount / totalMatchups) * 100;
  const isComplete = bracketValidation.isComplete;

  return (
    <div className={`bracket-submit-panel ${isEditing ? "editing" : ""}`}>
      {isEditing && (
        <div className="editing-header">
          <span className="editing-badge">Editing</span>
          <button className="cancel-edit-btn" onClick={onCancelEditing}>
            Cancel
          </button>
        </div>
      )}

      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && <div className="submit-error">{error}</div>}

      <button
        className={`submit-btn ${isComplete ? "ready" : "disabled"}`}
        onClick={handleSubmit}
        disabled={!isComplete || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : isEditing ? "Update Bracket" : "Submit Bracket"}
      </button>

      {!isComplete && (
        <div className="submit-hint">
          Complete all {totalMatchups - completedPicksCount} remaining picks to
          submit
        </div>
      )}
    </div>
  );
};

export default BracketSubmitPanel;
