import React, { useState, useEffect } from "react";
import { useBracketState } from "./useBracketState";
import { PARKS } from "./bracketData";
import MatchupCard from "./MatchupCard";
import ParkCard from "./ParkCard";
import StatsComparison from "./StatsComparison";
import ParkDetailModal from "./ParkDetailModal";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${activeView === "full" ? "active" : ""}`}
        onClick={() => onViewChange("full")}
      >
        Full Tournament
      </button>
      <button
        className={`view-toggle-btn ${activeView === "west" ? "active" : ""}`}
        onClick={() => onViewChange("west")}
      >
        West Region
      </button>
      <button
        className={`view-toggle-btn ${activeView === "east" ? "active" : ""}`}
        onClick={() => onViewChange("east")}
      >
        East Region
      </button>
    </div>
  );
};

const BracketContainer = () => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState("full");
  const {
    bracket,
    selectedMatchup,
    selectedPark,
    selectWinner,
    resetBracket,
    openStatsComparison,
    closeStatsComparison,
    openParkDetail,
    closeParkDetail,
  } = useBracketState();

  // Helper to check if a specific matchup is flipped (selected for comparison)
  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

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
        activeView={activeView}
        onViewChange={setActiveView}
      />
    );
  }

  const showWest = activeView === "full" || activeView === "west";
  const showEast = activeView === "full" || activeView === "east";
  const showCenter = activeView === "full";

  return (
    <div className="bracket-wrapper">
      <ViewToggle activeView={activeView} onViewChange={setActiveView} />

      <div className={`bracket-container ${activeView !== "full" ? "region-view" : ""}`}>
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
            />
            {bracket.champion && (
              <div className="champion-display">
                <div className="champion-label">CHAMPION</div>
                <ParkCard
                  parkId={bracket.champion}
                  isChampion={true}
                  onParkNameClick={openParkDetail}
                />
              </div>
            )}
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
              />
            </div>
          </div>
        )}
      </div>

      <button className="reset-bracket-btn" onClick={resetBracket}>
        Reset Bracket
      </button>

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
  activeView,
  onViewChange,
}) => {
  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  const showWest = activeView === "full" || activeView === "west";
  const showEast = activeView === "full" || activeView === "east";

  // West region: r16 slots 1-4, qf 1-2, sf 1
  // East region: r16 slots 5-8, qf 3-4, sf 2
  const westR16 = bracket.round16.slice(0, 4);
  const eastR16 = bracket.round16.slice(4, 8);
  const westQF = bracket.quarterfinals.slice(0, 2);
  const eastQF = bracket.quarterfinals.slice(2, 4);

  return (
    <div className="bracket-wrapper mobile">
      <ViewToggle activeView={activeView} onViewChange={onViewChange} />

      <div className="bracket-mobile">
        <div className="mobile-round">
          <h3>Round of 16 {activeView !== "full" && `(${activeView === "west" ? "West" : "East"})`}</h3>
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
              />
            ))}
          </div>
        </div>

        <div className="mobile-round">
          <h3>Quarterfinals {activeView !== "full" && `(${activeView === "west" ? "West" : "East"})`}</h3>
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
              />
            ))}
          </div>
        </div>

        <div className="mobile-round">
          <h3>Semifinals {activeView !== "full" && `(${activeView === "west" ? "West" : "East"})`}</h3>
          <div className="mobile-matchups">
            {showWest && (
              <MatchupCard
                matchup={bracket.semifinals[0]}
                roundClass="sf"
                isFlipped={isMatchupFlipped(bracket.semifinals[0].id)}
                onSelectWinner={onSelectWinner}
                onMatchupClick={onMatchupClick}
                onParkClick={onParkClick}
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
              />
            )}
          </div>
        </div>

        {activeView === "full" && (
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
                />
              </div>
            </div>

            {bracket.champion && (
              <div className="mobile-champion">
                <h3>Champion</h3>
                <ParkCard
                  parkId={bracket.champion}
                  isChampion={true}
                  onParkNameClick={onParkClick}
                />
              </div>
            )}
          </>
        )}
      </div>

      <button className="reset-bracket-btn" onClick={onReset}>
        Reset Bracket
      </button>

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
