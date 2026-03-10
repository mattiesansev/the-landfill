import React, { useState } from "react";
import { PARKS } from "./bracketData";

const sortedParks = Object.values(PARKS).sort((a, b) => a.seed - b.seed);

const ParkStatsSection = () => {
  const [expandedPark, setExpandedPark] = useState(null);

  const toggle = (parkId) => {
    setExpandedPark(expandedPark === parkId ? null : parkId);
  };

  return (
    <div className="park-stats-section">
      <h3>Park Stats</h3>
      <div className="park-stats-list">
        {sortedParks.map((park) => {
          const isOpen = expandedPark === park.id;
          return (
            <div key={park.id} className={`park-stats-item ${isOpen ? "open" : ""}`}>
              <button className="park-stats-header" onClick={() => toggle(park.id)}>
                <span className="park-stats-seed">#{park.seed}</span>
                <span className="park-stats-name">{park.name}</span>
                <span className={`park-stats-chevron ${isOpen ? "open" : ""}`}>&#9662;</span>
              </button>
              {isOpen && (
                <div className="park-stats-body">
                  <p className="park-stats-description">{park.description}</p>

                  <div className="park-stats-grid">
                    <div className="stat">
                      <span className="stat-label">Acreage</span>
                      <span className="stat-value">{park.stats.acreage}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Established</span>
                      <span className="stat-value">{park.stats.yearEstablished}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Playgrounds</span>
                      <span className="stat-value">{park.stats.playgrounds}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Sports Fields</span>
                      <span className="stat-value">{park.stats.sportsFields}</span>
                    </div>
                  </div>

                  <div className="park-stats-amenities">
                    <h4>Amenities</h4>
                    <ul>
                      {park.stats.amenities.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="park-stats-features">
                    {park.stats.dogFriendly && <span className="feature">Dog Friendly</span>}
                    {park.stats.hasRestrooms && <span className="feature">Restrooms</span>}
                    {park.stats.hasParking && <span className="feature">Parking</span>}
                    {!park.stats.dogFriendly && <span className="feature no">No Dogs</span>}
                  </div>

                  {park.funFact && (
                    <div className="park-stats-fun-fact">
                      <strong>Fun Fact:</strong> {park.funFact}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParkStatsSection;
