import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PARKS, findMatchup } from "./bracketData";

const StatsComparison = ({ matchupId, bracket, onSelectWinner, onClose }) => {
  const matchup = findMatchup(matchupId, bracket);
  if (!matchup || !matchup.parkA || !matchup.parkB) return null;

  const parkA = PARKS[matchup.parkA];
  const parkB = PARKS[matchup.parkB];

  const comparisonData = [
    {
      category: "Acreage",
      [parkA.name]: parkA.stats.acreage,
      [parkB.name]: parkB.stats.acreage,
    },
    {
      category: "Playgrounds",
      [parkA.name]: parkA.stats.playgrounds,
      [parkB.name]: parkB.stats.playgrounds,
    },
    {
      category: "Sports Fields",
      [parkA.name]: parkA.stats.sportsFields,
      [parkB.name]: parkB.stats.sportsFields,
    },
    {
      category: "Year Est.",
      [parkA.name]: parkA.stats.yearEstablished,
      [parkB.name]: parkB.stats.yearEstablished,
    },
  ];

  return (
    <div className="stats-comparison-overlay" onClick={onClose}>
      <div className="stats-comparison-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>
          {parkA.name} vs {parkB.name}
        </h2>

        <div className="comparison-chart">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey={parkA.name} fill="#7a9ec4" />
              <Bar dataKey={parkB.name} fill="#8ac4d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="amenities-comparison">
          <div className="park-amenities">
            <h4>{parkA.name}</h4>
            <ul>
              {parkA.stats.amenities.slice(0, 5).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <div className="park-features">
              {parkA.stats.dogFriendly && <span className="feature">Dog Friendly</span>}
              {parkA.stats.hasRestrooms && <span className="feature">Restrooms</span>}
              {parkA.stats.hasParking && <span className="feature">Parking</span>}
            </div>
          </div>
          <div className="park-amenities">
            <h4>{parkB.name}</h4>
            <ul>
              {parkB.stats.amenities.slice(0, 5).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <div className="park-features">
              {parkB.stats.dogFriendly && <span className="feature">Dog Friendly</span>}
              {parkB.stats.hasRestrooms && <span className="feature">Restrooms</span>}
              {parkB.stats.hasParking && <span className="feature">Parking</span>}
            </div>
          </div>
        </div>

        <div className="selection-buttons">
          <button
            className={`select-btn ${matchup.winner === matchup.parkA ? "selected" : ""}`}
            onClick={() => onSelectWinner(matchupId, matchup.parkA)}
          >
            Select {parkA.name}
          </button>
          <button
            className={`select-btn ${matchup.winner === matchup.parkB ? "selected" : ""}`}
            onClick={() => onSelectWinner(matchupId, matchup.parkB)}
          >
            Select {parkB.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsComparison;
