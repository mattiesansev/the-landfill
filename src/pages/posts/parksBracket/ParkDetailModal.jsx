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
          {park.stats.yearEstablished && (
            <div className="stat">
              <span className="stat-label">Established</span>
              <span className="stat-value">{park.stats.yearEstablished}</span>
            </div>
          )}
          <div className="stat">
            <span className="stat-label">Neighborhood</span>
            <span className="stat-value">{park.stats.neighborhood}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParkDetailModal;
