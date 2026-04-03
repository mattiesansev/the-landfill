import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IsleModal from "./IsleModal";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthCalendar = ({ data, yearMonth }) => {
  const navigate = useNavigate();
  const [activeIsle, setActiveIsle] = useState(null);

  const [yearStr, monthStr] = yearMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <button className="back-link" onClick={() => navigate("/post/monthly-roundup")}>
          ← All Months
        </button>
        <h1>
          {MONTH_NAMES[monthIndex]} {year}
        </h1>
      </div>

      {data?.headline_stats && (
        <div className="roundup-stats">
          {data.headline_stats.map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="roundup-stats-sep">·</span>}
              <div className="roundup-stat">
                <span className="roundup-stat-value">{stat.value}</span>
                <span className="roundup-stat-label">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {data?.isles && data.isles.length > 0 && (
        <div className="isle-sticky-board">
          {data.isles.map((isle, i) => (
            <button
              key={isle.id}
              className={`isle-sticky-note isle-sticky-note--${(i % 4) + 1}`}
              onClick={() => setActiveIsle(isle)}
            >
              <span className="isle-sticky-num">Isle {isle.number}</span>
              <span className="isle-sticky-title">{isle.title}</span>
              {isle.stats && isle.stats[0] && (
                <span className="isle-sticky-stat">
                  <span className="sticky-stat-value">{isle.stats[0].value}</span>{" "}
                  <span className="sticky-stat-label">{isle.stats[0].label}</span>
                </span>
              )}
              {isle.sections && isle.sections[0] && (
                <span className="isle-sticky-preview">
                  {isle.sections[0].body.slice(0, 90)}…
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <IsleModal isle={activeIsle} onClose={() => setActiveIsle(null)} />
    </div>
  );
};

export default MonthCalendar;
