import React, { useState, useEffect, useMemo } from "react";
import { useBracketState } from "./useBracketState";
import { useBracketVoting } from "./useBracketVoting";
import { PARKS } from "./bracketData";
import MatchupCard from "./MatchupCard";
import ParkCard from "./ParkCard";
import StatsComparison from "./StatsComparison";
import ParkDetailModal from "./ParkDetailModal";
import AdminPanel from "./AdminPanel";
import DebugVoteStats from "./DebugVoteStats";
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

const MainViewToggle = ({ topView, onTopViewChange, activeRound }) => {
  if (!activeRound) return null;

  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${topView === "bracket" ? "active" : ""}`}
        onClick={() => onTopViewChange("bracket")}
      >
        Bracket
      </button>
      <button
        className={`view-toggle-btn ${topView === "roundVoting" ? "active" : ""}`}
        onClick={() => onTopViewChange("roundVoting")}
      >
        Round Voting
      </button>
    </div>
  );
};

const BracketContainer = () => {
  const isMobile = useIsMobile();
  const [topView, setTopView] = useState("bracket");
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
    viewMode,
    getDisplayWinner,
    doesUserPickMatch,
    getVotesForMatchup,
    shouldShowVotes,
    // Editing state
    isLocked,
    // Per-round voting
    activeRound,
    perRoundVotes,
    userRoundVotes,
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

  // Sync visual bracket state from persisted picks whenever userPicks changes
  useEffect(() => {
    loadFromPicks(userPicks);
  }, [userPicks, loadFromPicks]);

  // Reset to bracket view if active round is cleared
  useEffect(() => {
    if (!activeRound && topView === "roundVoting") {
      setTopView("bracket");
    }
  }, [activeRound, topView]);

  // Wrap selectWinner to also update voting picks
  const selectWinner = (matchupId, parkId) => {
    // Allow selection if not locked
    if (isLocked) return;
    selectWinnerBase(matchupId, parkId);
    updatePick(matchupId, parkId);
  };

  // Wrap resetBracket to also clear picks
  const resetBracket = () => {
    if (isLocked) return; // Can't reset when locked
    resetBracketBase();
    resetPicks();
  };

  // Helper to check if a specific matchup is flipped (selected for comparison)
  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  // Determine if user can interact with matchups
  // Can interact anytime round16 is still open
  const canInteractWithBracket = !isLocked;

  // When locked, always show results overlay
  const effectiveViewMode = isLocked ? "results" : viewMode;

  // Get voting props for a matchup
  const getMatchupVotingProps = (matchupId) => ({
    displayMode: effectiveViewMode,
    isLocked: !canInteractWithBracket,
    votes: getVotesForMatchup(matchupId),
    actualWinner: actualWinners[matchupId],
    userPick: userPicks[matchupId],
    userPickMatches: doesUserPickMatch(matchupId),
  });

  if (isMobile) {
    return (
      <MobileBracket
        bracket={bracket}
        selectedMatchup={selectedMatchup}
        onSelectWinner={selectWinner}
        onMatchupClick={openStatsComparison}
        onParkClick={openParkDetail}
        onReset={resetBracket}
        selectedPark={selectedPark}
        closeStatsComparison={closeStatsComparison}
        closeParkDetail={closeParkDetail}
        topView={topView}
        onTopViewChange={setTopView}
        bracketRegion={bracketRegion}
        // Voting props
        getMatchupVotingProps={getMatchupVotingProps}
        bracketValidation={bracketValidation}
        submitUserBracket={submitUserBracket}
        refreshVotingData={refreshVotingData}
        isLocked={isLocked}
        // Per-round voting
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
      <div className="bracket-controls">
        <div className="bracket-view-controls">
          <MainViewToggle topView={topView} onTopViewChange={setTopView} activeRound={activeRound} />
        </div>
      </div>

      {topView === "bracket" && (
        <>
          <div className={`bracket-container ${bracketRegion !== "full" ? "region-view" : ""}`}>
            {/* Left side: Round of 16 (4 matchups) -> Quarterfinals (2) -> Semifinal (1) */}
            {showWest && (
              <div className="bracket-side left">
                <div className="bracket-round round-16">
                  {bracket.round16.slice(0, 4).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="r16"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...getMatchupVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round quarterfinals">
                  {bracket.quarterfinals.slice(0, 2).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="qf"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...getMatchupVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round semifinals">
                  <MatchupCard
                    matchup={bracket.semifinals[0]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(bracket.semifinals[0].id)}
                    onSelectWinner={selectWinner}
                    onMatchupClick={openStatsComparison}
                    onParkClick={openParkDetail}
                    {...getMatchupVotingProps(bracket.semifinals[0].id)}
                  />
                </div>
              </div>
            )}

            {/* Center: Finals + Champion */}
            {showCenter && (
              <div className="bracket-center">
                <div className="finals-label">FINALS</div>
                <MatchupCard
                  matchup={bracket.finals}
                  roundClass="finals"
                  isFlipped={isMatchupFlipped(bracket.finals.id)}
                  onSelectWinner={selectWinner}
                  onMatchupClick={openStatsComparison}
                  onParkClick={openParkDetail}
                  {...getMatchupVotingProps(bracket.finals.id)}
                />
              </div>
            )}

            {/* Right side: Round of 16 (4 matchups) -> Quarterfinals (2) -> Semifinal (1) - flows toward center */}
            {showEast && (
              <div className="bracket-side right">
                <div className="bracket-round round-16">
                  {bracket.round16.slice(4, 8).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="r16"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...getMatchupVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round quarterfinals">
                  {bracket.quarterfinals.slice(2, 4).map((matchup) => (
                    <MatchupCard
                      key={matchup.id}
                      matchup={matchup}
                      roundClass="qf"
                      isFlipped={isMatchupFlipped(matchup.id)}
                      onSelectWinner={selectWinner}
                      onMatchupClick={openStatsComparison}
                      onParkClick={openParkDetail}
                      {...getMatchupVotingProps(matchup.id)}
                    />
                  ))}
                </div>
                <div className="bracket-round semifinals">
                  <MatchupCard
                    matchup={bracket.semifinals[1]}
                    roundClass="sf"
                    isFlipped={isMatchupFlipped(bracket.semifinals[1].id)}
                    onSelectWinner={selectWinner}
                    onMatchupClick={openStatsComparison}
                    onParkClick={openParkDetail}
                    {...getMatchupVotingProps(bracket.semifinals[1].id)}
                  />
                </div>
              </div>
            )}
          </div>

          {!isLocked && (
            <div className="bracket-action-buttons">
              <button className="reset-bracket-btn" onClick={resetBracket}>
                Reset
              </button>
              <button
                className="save-bracket-btn"
                onClick={async () => {
                  const result = await submitUserBracket();
                  if (result.success) {
                    alert(result.isResubmission ? "Bracket updated!" : "Bracket saved!");
                  } else {
                    alert(result.error);
                  }
                }}
                disabled={!bracketValidation.isComplete}
              >
                Save
              </button>
            </div>
          )}
        </>
      )}

      {topView === "roundVoting" && (
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

      <AdminPanel onRefresh={refreshVotingData} />
      <DebugVoteStats />

      {/* Modals */}
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

// Mobile layout - vertical rounds
const MobileBracket = ({
  bracket,
  selectedMatchup,
  onSelectWinner,
  onMatchupClick,
  onParkClick,
  onReset,
  selectedPark,
  closeStatsComparison,
  closeParkDetail,
  topView,
  onTopViewChange,
  bracketRegion,
  // Voting props
  getMatchupVotingProps,
  bracketValidation,
  submitUserBracket,
  refreshVotingData,
  isLocked,
  // Per-round voting
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

  // West region: r16 slots 1-4, qf 1-2, sf 1
  // East region: r16 slots 5-8, qf 3-4, sf 2
  const westR16 = bracket.round16.slice(0, 4);
  const eastR16 = bracket.round16.slice(4, 8);
  const westQF = bracket.quarterfinals.slice(0, 2);
  const eastQF = bracket.quarterfinals.slice(2, 4);

  return (
    <div className="bracket-wrapper mobile">
      <div className="bracket-controls">
        <div className="bracket-view-controls">
          <MainViewToggle topView={topView} onTopViewChange={onTopViewChange} activeRound={activeRound} />
        </div>
      </div>

      {topView === "bracket" && (
        <>
          <div className="bracket-mobile">
            <div className="mobile-round">
              <h3>Round of 16 {bracketRegion !== "full" && `(${bracketRegion === "west" ? "West" : "East"})`}</h3>
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
              <h3>Quarterfinals {bracketRegion !== "full" && `(${bracketRegion === "west" ? "West" : "East"})`}</h3>
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
              <h3>Semifinals {bracketRegion !== "full" && `(${bracketRegion === "west" ? "West" : "East"})`}</h3>
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
              <>
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
              </>
            )}
          </div>

          {!isLocked && (
            <div className="bracket-action-buttons">
              <button className="reset-bracket-btn" onClick={onReset}>
                Reset
              </button>
              <button
                className="save-bracket-btn"
                onClick={async () => {
                  const result = await submitUserBracket();
                  if (result.success) {
                    alert(result.isResubmission ? "Bracket updated!" : "Bracket saved!");
                  } else {
                    alert(result.error);
                  }
                }}
                disabled={!bracketValidation.isComplete}
              >
                Save
              </button>
            </div>
          )}
        </>
      )}

      {topView === "roundVoting" && (
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

      <AdminPanel onRefresh={refreshVotingData} />
      <DebugVoteStats />

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
