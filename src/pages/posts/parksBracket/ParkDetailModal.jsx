import React from "react";
import { PARKS } from "./bracketData";

const ParkDetailModal = ({ parkId, onClose }) => {
  if (!parkId) return null;

  const park = PARKS[parkId];

  return (
    <div className="park-detail-overlay" onClick={onClose}>
      <div className="park-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>{park.name}</h2>
        <div className="park-seed-badge">Seed #{park.seed}</div>

        <p className="park-description">{park.description}</p>

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

        <div className="park-amenities-full">
          <h4>Amenities</h4>
          <ul>
            {park.stats.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="park-features-full">
          {park.stats.dogFriendly && <span className="feature">Dog Friendly</span>}
          {park.stats.hasRestrooms && <span className="feature">Restrooms</span>}
          {park.stats.hasParking && <span className="feature">Parking</span>}
          {!park.stats.dogFriendly && <span className="feature no">No Dogs</span>}
        </div>

        {park.funFact && (
          <div className="fun-fact">
            <h4>Fun Fact</h4>
            <p>{park.funFact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkDetailModal;
