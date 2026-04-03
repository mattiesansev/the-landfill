import React from "react";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_ROUNDUPS } from "./roundupIndex";

const YearView = ({ year }) => {
  const navigate = useNavigate();

  return (
    <div className="year-view">
      <div className="roundup-eyebrow">Board of Supervisors</div>
      <h1 className="year-view-title">{year} Monthly Roundups</h1>
      <p className="year-view-subtitle">Click a month to explore</p>
      <div className="year-sticky-board">
        {AVAILABLE_ROUNDUPS.map(({ yearMonth, label }, i) => (
          <div
            key={yearMonth}
            className={`month-sticky-note month-sticky-note--${(i % 4) + 1}`}
            onClick={() => navigate(`/post/monthly-roundup/${yearMonth}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(`/post/monthly-roundup/${yearMonth}`)
            }
          >
            <div className="month-sticky-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearView;
