import React from "react";
import { PARKS, findMatchup } from "./bracketData";

const StatsComparison = ({ matchupId, bracket, onSelectWinner, onClose }) => {
  const matchup = findMatchup(matchupId, bracket);
  if (!matchup || !matchup.parkA || !matchup.parkB) return null;

  const parkA = PARKS[matchup.parkA];
  const parkB = PARKS[matchup.parkB];

  const stats = [
    { label: "Acreage", valueA: parkA.stats.acreage, valueB: parkB.stats.acreage },
    { label: "Playgrounds", valueA: parkA.stats.playgrounds, valueB: parkB.stats.playgrounds },
    { label: "Sports Fields", valueA: parkA.stats.sportsFields, valueB: parkB.stats.sportsFields },
    { label: "Year Est.", valueA: parkA.stats.yearEstablished, valueB: parkB.stats.yearEstablished },
  ];

  return (
    <div className="stats-comparison-overlay" onClick={onClose}>
      <div className="stats-comparison-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="comparison-main">
          {/* Left park image */}
          <div className="comparison-side left">
            {parkA.image && (
              <img className="comparison-park-image" src={parkA.image} alt={parkA.name} />
            )}
            <button
              className={`select-btn ${matchup.winner === matchup.parkA ? "selected" : ""}`}
              onClick={() => onSelectWinner(matchupId, matchup.parkA)}
            >
              Select
            </button>
          </div>

          {/* Center stats table */}
          <div className="comparison-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-row">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-values">
                  <span className="stat-value">{stat.valueA}</span>
                  <span className="stat-divider">|</span>
                  <span className="stat-value">{stat.valueB}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right park image */}
          <div className="comparison-side right">
            {parkB.image && (
              <img className="comparison-park-image" src={parkB.image} alt={parkB.name} />
            )}
            <button
              className={`select-btn ${matchup.winner === matchup.parkB ? "selected" : ""}`}
              onClick={() => onSelectWinner(matchupId, matchup.parkB)}
            >
              Select
            </button>
          </div>
        </div>

        {/* Blurbs / fun facts below */}
        <div className="comparison-blurbs">
          <div className="park-blurb">
            <h4>{parkA.name}</h4>
            <p>{parkA.description}</p>
            {parkA.funFact && <p className="fun-fact">{parkA.funFact}</p>}
          </div>
          <div className="park-blurb">
            <h4>{parkB.name}</h4>
            <p>{parkB.description}</p>
            {parkB.funFact && <p className="fun-fact">{parkB.funFact}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsComparison;
