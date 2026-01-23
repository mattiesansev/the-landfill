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

const BracketContainer = () => {
  const isMobile = useIsMobile();
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
      />
    );
  }

  return (
    <div className="bracket-wrapper">
      <div className="bracket-container">
        {/* Left side: Round of 16 (4 matchups) -> Quarterfinals (2) -> Semifinal (1) */}
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

        {/* Center: Finals + Champion */}
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

        {/* Right side: Round of 16 (4 matchups) -> Quarterfinals (2) -> Semifinal (1) - reversed */}
        <div className="bracket-side right">
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
        </div>
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
}) => {
  const isMatchupFlipped = (matchupId) => selectedMatchup === matchupId;

  return (
    <div className="bracket-wrapper mobile">
      <div className="bracket-mobile">
        <div className="mobile-round">
          <h3>Round of 16</h3>
          <div className="mobile-matchups">
            {bracket.round16.map((matchup) => (
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
          <h3>Quarterfinals</h3>
          <div className="mobile-matchups">
            {bracket.quarterfinals.map((matchup) => (
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
          <h3>Semifinals</h3>
          <div className="mobile-matchups">
            {bracket.semifinals.map((matchup) => (
              <MatchupCard
                key={matchup.id}
                matchup={matchup}
                roundClass="sf"
                isFlipped={isMatchupFlipped(matchup.id)}
                onSelectWinner={onSelectWinner}
                onMatchupClick={onMatchupClick}
                onParkClick={onParkClick}
              />
            ))}
          </div>
        </div>

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
