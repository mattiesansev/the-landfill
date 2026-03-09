import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
      Live Results
    </button>
  </div>
);

const BracketContainer = () => {
  const isMobile = useIsMobile();
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
    isSubmitted,
    updatePick,
    submitUserBracket,
    resetPicks,
    bracketValidation,
    actualWinners,
    aggregateVotes,
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
    votes: null,
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

  // Show the view toggle only when there are actual results AND user has a bracket
  const showViewToggle = (phase === "voting" || phase === "complete") && isSubmitted;

  // Force "live" view for users who never submitted when bracket is locked
  useEffect(() => {
    if (!isSubmitted && isLocked) setBracketView("live");
  }, [isSubmitted, isLocked]);

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
        aggregateVotes={aggregateVotes}
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
          aggregateVotes={aggregateVotes}
          onDraftVote={updateRoundVoteDraft}
          onSubmitRoundVotes={submitAllRoundVotes}
          isRoundVotesSubmitted={isRoundVotesSubmitted}
          hasUnsavedRoundChanges={hasUnsavedRoundChanges}
          roundVotingProgress={roundVotingProgress}
        />
      )}

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

const ROUND_TABS = [
  { key: "round16", label: "Round of 16" },
  { key: "quarterfinals", label: "Quarterfinals" },
  { key: "semifinals", label: "Semifinals" },
  { key: "finals", label: "Finals" },
];

// Mobile layout — swipeable rounds
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
  aggregateVotes,
  updateRoundVoteDraft,
  submitAllRoundVotes,
  isRoundVotesSubmitted,
  hasUnsavedRoundChanges,
  roundVotingProgress,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);

  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  const showWest = bracketRegion === "full" || bracketRegion === "west";
  const showEast = bracketRegion === "full" || bracketRegion === "east";

  const westR16 = bracket.round16.slice(0, 4);
  const eastR16 = bracket.round16.slice(4, 8);
  const westQF = bracket.quarterfinals.slice(0, 2);
  const eastQF = bracket.quarterfinals.slice(2, 4);

  // Sync active tab from scroll position
  const handleScroll = useCallback(() => {
    if (isScrolling.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveTab(index);
  }, []);

  // Scroll to tab on tap
  const scrollToTab = useCallback((index) => {
    const el = scrollRef.current;
    if (!el) return;
    isScrolling.current = true;
    setActiveTab(index);
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
    setTimeout(() => { isScrolling.current = false; }, 400);
  }, []);

  const renderMatchups = (matchups, roundClass) =>
    matchups.map((matchup) => (
      <MatchupCard
        key={matchup.id}
        matchup={matchup}
        roundClass={roundClass}
        isFlipped={isMatchupFlipped(matchup.id)}
        onSelectWinner={onSelectWinner}
        onMatchupClick={onMatchupClick}
        onParkClick={onParkClick}
        {...getMatchupVotingProps(matchup.id)}
      />
    ));

  return (
    <div className="bracket-wrapper mobile">
      {/* Phase 2: Round voting at top */}
      {phase === "voting" && (
        <RoundVoting
          activeRound={activeRound}
          matchups={activeRoundMatchups}
          draftRoundVotes={draftRoundVotes}
          perRoundVotes={perRoundVotes}
          aggregateVotes={aggregateVotes}
          onDraftVote={updateRoundVoteDraft}
          onSubmitRoundVotes={submitAllRoundVotes}
          isRoundVotesSubmitted={isRoundVotesSubmitted}
          hasUnsavedRoundChanges={hasUnsavedRoundChanges}
          roundVotingProgress={roundVotingProgress}
        />
      )}

      <>
        {showViewToggle && (
          <BracketViewToggle
            bracketView={bracketView}
            onChange={onBracketViewChange}
          />
        )}

        {/* Round tabs */}
        <div className="mobile-round-tabs">
          {ROUND_TABS.map((tab, i) => (
            <button
              key={tab.key}
              className={`mobile-round-tab ${activeTab === i ? "active" : ""}`}
              onClick={() => scrollToTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Swipeable round panels */}
        <div
          className="mobile-rounds-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div className="mobile-round-panel">
            <div className="mobile-matchups">
              {showWest && renderMatchups(westR16, "r16")}
              {showEast && renderMatchups(eastR16, "r16")}
            </div>
          </div>

          <div className="mobile-round-panel">
            <div className="mobile-matchups">
              {showWest && renderMatchups(westQF, "qf")}
              {showEast && renderMatchups(eastQF, "qf")}
            </div>
          </div>

          <div className="mobile-round-panel">
            <div className="mobile-matchups">
              {showWest && renderMatchups([bracket.semifinals[0]], "sf")}
              {showEast && renderMatchups([bracket.semifinals[1]], "sf")}
            </div>
          </div>

          {bracketRegion === "full" && (
            <div className="mobile-round-panel">
              <div className="mobile-matchups">
                {renderMatchups([bracket.finals], "finals")}
              </div>
            </div>
          )}
        </div>

        {!isLocked && bracketView === "mine" && (
          <div className="bracket-action-buttons">
            <button className="reset-bracket-btn" onClick={onReset}>
              Reset
            </button>
            {activeTab < 3 ? (
              <button className="save-bracket-btn" onClick={() => scrollToTab(activeTab + 1)}>
                Next
              </button>
            ) : (
              <button
                className="save-bracket-btn"
                onClick={onSave}
                disabled={!bracketValidation.isComplete}
              >
                Save
              </button>
            )}
          </div>
        )}
      </>

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
