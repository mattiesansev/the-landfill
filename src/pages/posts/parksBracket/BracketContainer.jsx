import React, { useState, useEffect, useMemo } from "react";
import { useBracketState } from "./useBracketState";
import { useBracketVoting } from "./useBracketVoting";
import { PARKS } from "./bracketData";
import MatchupCard from "./MatchupCard";
import ParkCard from "./ParkCard";
import StatsComparison from "./StatsComparison";
import ParkDetailModal from "./ParkDetailModal";
import RoundVoting from "./RoundVoting";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

// Toggle between the user's own predictions and the live community bracket
const BracketViewToggle = ({ bracketView, onChange }) => (
  <div className="bracket-view-toggle">
    <button
      className={`bracket-view-btn ${bracketView === "mine" ? "active" : ""}`}
      onClick={() => onChange("mine")}
    >
      My Bracket
    </button>
    <button
      className={`bracket-view-btn live ${bracketView === "live" ? "active" : ""}`}
      onClick={() => onChange("live")}
    >
      Live
    </button>
  </div>
);

const BracketContainer = () => {
  const isMobile = useIsMobile();
  const [bracketExpanded, setBracketExpanded] = useState(true);
  // "mine" = user's predictions, "live" = actual advancing parks
  const [bracketView, setBracketView] = useState("mine");
  const [bracketRegion] = useState("full");

  const {
    bracket,
    selectedMatchup,
    selectedPark,
    selectWinner: selectWinnerBase,
    resetBracket: resetBracketBase,
    loadFromPicks,
    openStatsComparison,
    closeStatsComparison,
    openParkDetail,
    closeParkDetail,
  } = useBracketState();

  const {
    userPicks,
    updatePick,
    submitUserBracket,
    resetPicks,
    bracketValidation,
    actualWinners,
    refreshVotingData,
    doesUserPickMatch,
    getVotesForMatchup,
    shouldShowResults,
    getActualMatchupParks,
    isLocked,
    activeRound,
    perRoundVotes,
    draftRoundVotes,
    updateRoundVoteDraft,
    submitAllRoundVotes,
    isRoundVotesSubmitted,
    hasUnsavedRoundChanges,
    roundVotingProgress,
    getActiveRoundMatchups,
  } = useBracketVoting();

  const activeRoundMatchups = useMemo(
    () => getActiveRoundMatchups(),
    [getActiveRoundMatchups]
  );

  // Phase drives the entire layout
  const phase = !activeRound ? "submission" : activeRound === "completed" ? "complete" : "voting";

  // Collapse bracket by default when voting starts; expand otherwise
  useEffect(() => {
    setBracketExpanded(phase !== "voting");
  }, [phase]);

  // Reset to "My Bracket" view during submission — no live data to show yet
  useEffect(() => {
    if (phase === "submission") setBracketView("mine");
  }, [phase]);

  // Sync visual bracket state from persisted picks
  useEffect(() => {
    loadFromPicks(userPicks);
  }, [userPicks, loadFromPicks]);

  // Poll every 30s during active voting so admin changes are picked up
  useEffect(() => {
    if (phase !== "voting") return;
    const interval = setInterval(refreshVotingData, 30000);
    return () => clearInterval(interval);
  }, [phase]);

  const selectWinner = (matchupId, parkId) => {
    if (isLocked) return;
    selectWinnerBase(matchupId, parkId);
    updatePick(matchupId, parkId);
  };

  const resetBracket = () => {
    if (isLocked) return;
    resetBracketBase();
    resetPicks();
  };

  const handleSaveBracket = async () => {
    const result = await submitUserBracket();
    if (result.success) {
      alert(result.isResubmission ? "Bracket updated!" : "Bracket saved!");
    } else {
      alert(result.error);
    }
  };

  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  // For "My Bracket" view: show user's picks with ✓/✗ badges on closed rounds
  const getMatchupVotingProps = (matchupId) => ({
    displayMode: shouldShowResults(matchupId) ? "results" : "user",
    isLocked,
    votes: getVotesForMatchup(matchupId),
    actualWinner: actualWinners[matchupId],
    userPick: userPicks[matchupId],
    userPickMatches: doesUserPickMatch(matchupId),
  });

  // For "Live" view: show actual advancing parks with vote results, no user pick badges
  const getLiveMatchupVotingProps = (matchupId) => ({
    displayMode: shouldShowResults(matchupId) ? "results" : "user",
    isLocked: true,
    votes: getVotesForMatchup(matchupId),
    actualWinner: actualWinners[matchupId],
    userPick: null,
    userPickMatches: null,
  });

  const activeVotingProps = bracketView === "live"
    ? getLiveMatchupVotingProps
    : getMatchupVotingProps;

  // Live bracket: replace each matchup's parks with the actual advancing parks
  const displayBracket = useMemo(() => {
    if (bracketView !== "live") return bracket;

    const resolve = (matchup) => {
      const actual = getActualMatchupParks(matchup.id);
      return {
        ...matchup,
        parkA: actual?.parkA ?? null,
        parkB: actual?.parkB ?? null,
        winner: actualWinners[matchup.id] ?? null,
      };
    };

    return {
      ...bracket,
      round16: bracket.round16.map(resolve),
      quarterfinals: bracket.quarterfinals.map(resolve),
      semifinals: bracket.semifinals.map(resolve),
      finals: resolve(bracket.finals),
    };
  }, [bracket, bracketView, getActualMatchupParks, actualWinners]);

  // Show the view toggle only when there are actual results to compare against
  const showViewToggle = phase === "voting" || phase === "complete";

  if (isMobile) {
    return (
      <MobileBracket
        bracket={displayBracket}
        selectedMatchup={selectedMatchup}
        onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
        onMatchupClick={openStatsComparison}
        onParkClick={openParkDetail}
        onReset={resetBracket}
        onSave={handleSaveBracket}
        selectedPark={selectedPark}
        closeStatsComparison={closeStatsComparison}
        closeParkDetail={closeParkDetail}
        bracketRegion={bracketRegion}
        bracketExpanded={bracketExpanded}
        onToggleBracket={() => setBracketExpanded((e) => !e)}
        phase={phase}
        showViewToggle={showViewToggle}
        bracketView={bracketView}
        onBracketViewChange={setBracketView}
        getMatchupVotingProps={activeVotingProps}
        bracketValidation={bracketValidation}
        isLocked={isLocked}
        activeRound={activeRound}
        activeRoundMatchups={activeRoundMatchups}
        draftRoundVotes={draftRoundVotes}
        perRoundVotes={perRoundVotes}
        updateRoundVoteDraft={updateRoundVoteDraft}
        submitAllRoundVotes={submitAllRoundVotes}
        isRoundVotesSubmitted={isRoundVotesSubmitted}
        hasUnsavedRoundChanges={hasUnsavedRoundChanges}
        roundVotingProgress={roundVotingProgress}
      />
    );
  }

  const showWest = bracketRegion === "full" || bracketRegion === "west";
  const showEast = bracketRegion === "full" || bracketRegion === "east";
  const showCenter = bracketRegion === "full";

  return (
    <div className="bracket-wrapper">
      {/* Phase 2: Round voting at the top when a round is active */}
      {phase === "voting" && (
        <RoundVoting
          activeRound={activeRound}
          matchups={activeRoundMatchups}
          draftRoundVotes={draftRoundVotes}
          perRoundVotes={perRoundVotes}
          onDraftVote={updateRoundVoteDraft}
          onSubmitRoundVotes={submitAllRoundVotes}
          isRoundVotesSubmitted={isRoundVotesSubmitted}
          hasUnsavedRoundChanges={hasUnsavedRoundChanges}
          roundVotingProgress={roundVotingProgress}
        />
      )}

      {/* Bracket section header with collapse toggle (voting phase only) */}
      {phase === "voting" && (
        <div className="bracket-section-header">
          <button
            className="bracket-collapse-toggle"
            onClick={() => setBracketExpanded((e) => !e)}
          >
            {bracketExpanded ? "Hide bracket ▲" : "Show bracket & results ▼"}
          </button>
        </div>
      )}

      {/* Bracket — always visible during submission/complete, collapsible during voting */}
      {(phase !== "voting" || bracketExpanded) && (
        <>
          {/* My Bracket / Live toggle (shown when results exist) */}
          {showViewToggle && (
            <BracketViewToggle
              bracketView={bracketView}
              onChange={setBracketView}
            />
          )}

          <div className={`bracket-container ${bracketRegion !== "full" ? "region-view" : ""}`}>
            {showWest && (
              <div className="bracket-side left">
                <div className="bracket-round round-16">
                  {displayBracket.round16.slice(0, 4).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="r16"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...activeVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round quarterfinals">
                  {displayBracket.quarterfinals.slice(0, 2).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="qf"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...activeVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round semifinals">
                  <MatchupCard
                    matchup={displayBracket.semifinals[0]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(displayBracket.semifinals[0].id)}
                    onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                    onMatchupClick={openStatsComparison}
                    onParkClick={openParkDetail}
                    {...activeVotingProps(displayBracket.semifinals[0].id)}
                  />
                </div>
              </div>
            )}

            {showCenter && (
              <div className="bracket-center">
                <div className="finals-label">FINALS</div>
                <MatchupCard
                  matchup={displayBracket.finals}
                  roundClass="finals"
                  isFlipped={isMatchupFlipped(displayBracket.finals.id)}
                  onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                  onMatchupClick={openStatsComparison}
                  onParkClick={openParkDetail}
                  {...activeVotingProps(displayBracket.finals.id)}
                />
              </div>
            )}

            {showEast && (
              <div className="bracket-side right">
                <div className="bracket-round round-16">
                  {displayBracket.round16.slice(4, 8).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="r16"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...activeVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round quarterfinals">
                  {displayBracket.quarterfinals.slice(2, 4).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="qf"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...activeVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round semifinals">
                  <MatchupCard
                    matchup={displayBracket.semifinals[1]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(displayBracket.semifinals[1].id)}
                    onSelectWinner={bracketView === "live" ? () => {} : selectWinner}
                    onMatchupClick={openStatsComparison}
                    onParkClick={openParkDetail}
                    {...activeVotingProps(displayBracket.semifinals[1].id)}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLocked && bracketView === "mine" && (
            <div className="bracket-action-buttons">
              <button className="reset-bracket-btn" onClick={resetBracket}>
                Reset
              </button>
              <button
                className="save-bracket-btn"
                onClick={handleSaveBracket}
                disabled={!bracketValidation.isComplete}
              >
                Save
              </button>
            </div>
          )}
        </>
      )}

      {selectedMatchup && (
        <StatsComparison
          matchupId={selectedMatchup}
          bracket={bracket}
          onSelectWinner={selectWinner}
          onClose={closeStatsComparison}
        />
      )}
      {selectedPark && (
        <ParkDetailModal parkId={selectedPark} onClose={closeParkDetail} />
      )}
    </div>
  );
};

// Mobile layout — same phase-aware structure
const MobileBracket = ({
  bracket,
  selectedMatchup,
  onSelectWinner,
  onMatchupClick,
  onParkClick,
  onReset,
  onSave,
  selectedPark,
  closeStatsComparison,
  closeParkDetail,
  bracketRegion,
  bracketExpanded,
  onToggleBracket,
  phase,
  showViewToggle,
  bracketView,
  onBracketViewChange,
  getMatchupVotingProps,
  bracketValidation,
  isLocked,
  activeRound,
  activeRoundMatchups,
  draftRoundVotes,
  perRoundVotes,
  updateRoundVoteDraft,
  submitAllRoundVotes,
  isRoundVotesSubmitted,
  hasUnsavedRoundChanges,
  roundVotingProgress,
}) => {
  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  const showWest = bracketRegion === "full" || bracketRegion === "west";
  const showEast = bracketRegion === "full" || bracketRegion === "east";

  const westR16 = bracket.round16.slice(0, 4);
  const eastR16 = bracket.round16.slice(4, 8);
  const westQF = bracket.quarterfinals.slice(0, 2);
  const eastQF = bracket.quarterfinals.slice(2, 4);

  return (
    <div className="bracket-wrapper mobile">
      {/* Phase 2: Round voting at top */}
      {phase === "voting" && (
        <RoundVoting
          activeRound={activeRound}
          matchups={activeRoundMatchups}
          draftRoundVotes={draftRoundVotes}
          perRoundVotes={perRoundVotes}
          onDraftVote={updateRoundVoteDraft}
          onSubmitRoundVotes={submitAllRoundVotes}
          isRoundVotesSubmitted={isRoundVotesSubmitted}
          hasUnsavedRoundChanges={hasUnsavedRoundChanges}
          roundVotingProgress={roundVotingProgress}
        />
      )}

      {/* Bracket collapse toggle during voting */}
      {phase === "voting" && (
        <div className="bracket-section-header">
          <button className="bracket-collapse-toggle" onClick={onToggleBracket}>
            {bracketExpanded ? "Hide bracket ▲" : "Show bracket & results ▼"}
          </button>
        </div>
      )}

      {/* Bracket */}
      {(phase !== "voting" || bracketExpanded) && (
        <>
          {showViewToggle && (
            <BracketViewToggle
              bracketView={bracketView}
              onChange={onBracketViewChange}
            />
          )}

          <div className="bracket-mobile">
            <div className="mobile-round">
              <h3>Round of 16</h3>
              <div className="mobile-matchups">
                {showWest && westR16.map((matchup) => (
                  <MatchupCard
                    key={matchup.id}
                    matchup={matchup}
                    roundClass="r16"
                    isFlipped={isMatchupFlipped(matchup.id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(matchup.id)}
                  />
                ))}
                {showEast && eastR16.map((matchup) => (
                  <MatchupCard
                    key={matchup.id}
                    matchup={matchup}
                    roundClass="r16"
                    isFlipped={isMatchupFlipped(matchup.id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(matchup.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mobile-round">
              <h3>Quarterfinals</h3>
              <div className="mobile-matchups">
                {showWest && westQF.map((matchup) => (
                  <MatchupCard
                    key={matchup.id}
                    matchup={matchup}
                    roundClass="qf"
                    isFlipped={isMatchupFlipped(matchup.id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(matchup.id)}
                  />
                ))}
                {showEast && eastQF.map((matchup) => (
                  <MatchupCard
                    key={matchup.id}
                    matchup={matchup}
                    roundClass="qf"
                    isFlipped={isMatchupFlipped(matchup.id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(matchup.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mobile-round">
              <h3>Semifinals</h3>
              <div className="mobile-matchups">
                {showWest && (
                  <MatchupCard
                    matchup={bracket.semifinals[0]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(bracket.semifinals[0].id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(bracket.semifinals[0].id)}
                  />
                )}
                {showEast && (
                  <MatchupCard
                    matchup={bracket.semifinals[1]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(bracket.semifinals[1].id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(bracket.semifinals[1].id)}
                  />
                )}
              </div>
            </div>

            {bracketRegion === "full" && (
              <div className="mobile-round">
                <h3>Finals</h3>
                <div className="mobile-matchups">
                  <MatchupCard
                    matchup={bracket.finals}
                    roundClass="finals"
                    isFlipped={isMatchupFlipped(bracket.finals.id)}
                    onSelectWinner={onSelectWinner}
                    onMatchupClick={onMatchupClick}
                    onParkClick={onParkClick}
                    {...getMatchupVotingProps(bracket.finals.id)}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLocked && bracketView === "mine" && (
            <div className="bracket-action-buttons">
              <button className="reset-bracket-btn" onClick={onReset}>
                Reset
              </button>
              <button
                className="save-bracket-btn"
                onClick={onSave}
                disabled={!bracketValidation.isComplete}
              >
                Save
              </button>
            </div>
          )}
        </>
      )}

      {selectedMatchup && (
        <StatsComparison
          matchupId={selectedMatchup}
          bracket={bracket}
          onSelectWinner={onSelectWinner}
          onClose={closeStatsComparison}
        />
      )}
      {selectedPark && (
        <ParkDetailModal parkId={selectedPark} onClose={closeParkDetail} />
      )}
    </div>
  );
};

export default BracketContainer;
