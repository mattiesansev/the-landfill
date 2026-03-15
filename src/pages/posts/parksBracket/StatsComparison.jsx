import React from "react";
import { createPortal } from "react-dom";
import { PARKS, findMatchup } from "./bracketData";

const StatsComparison = ({ matchupId, bracket, onSelectWinner, onClose }) => {
  const matchup = findMatchup(matchupId, bracket);
  if (!matchup || !matchup.parkA || !matchup.parkB) return null;

  const parkA = PARKS[matchup.parkA];
  const parkB = PARKS[matchup.parkB];

  const stats = [
    { label: "Acreage", valueA: parkA.stats.acreage, valueB: parkB.stats.acreage },
    { label: "Year Est.", valueA: parkA.stats.yearEstablished ?? "—", valueB: parkB.stats.yearEstablished ?? "—" },
    { label: "Neighborhood", valueA: parkA.stats.neighborhood, valueB: parkB.stats.neighborhood },
  ];

  return createPortal(
    <div className="stats-comparison-overlay" onClick={onClose}>
      <div className="stats-comparison-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Park headers: images + names */}
        <div className="comparison-header">
          <div className="comparison-park-header">
            {parkA.image && (
              <img className="comparison-park-image" src={parkA.image} alt={parkA.name} />
            )}
            <h4 className="comparison-park-name">{parkA.name}</h4>
          </div>
          <div className="comparison-park-header">
            {parkB.image && (
              <img className="comparison-park-image" src={parkB.image} alt={parkB.name} />
            )}
            <h4 className="comparison-park-name">{parkB.name}</h4>
          </div>
        </div>

        {/* Stats comparison table */}
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

        {/* Blurbs / fun facts */}
        <div className="comparison-blurbs">
          <div className="park-blurb">
            <h4>{parkA.name}</h4>
            <p>{parkA.description}</p>
          </div>
          <div className="park-blurb">
            <h4>{parkB.name}</h4>
            <p>{parkB.description}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StatsComparison;
