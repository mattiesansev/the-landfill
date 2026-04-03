import React from "react";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_ROUNDUPS } from "./roundupIndex";

const MONTHS = [
  { key: "01", label: "January" },
  { key: "02", label: "February" },
  { key: "03", label: "March" },
  { key: "04", label: "April" },
  { key: "05", label: "May" },
  { key: "06", label: "June" },
  { key: "07", label: "July" },
  { key: "08", label: "August" },
  { key: "09", label: "September" },
  { key: "10", label: "October" },
  { key: "11", label: "November" },
  { key: "12", label: "December" },
];

const YearView = ({ year }) => {
  const navigate = useNavigate();
  const available = new Set(AVAILABLE_ROUNDUPS.map((r) => r.yearMonth));

  return (
    <div className="year-view">
      <div className="roundup-eyebrow">Board of Supervisors</div>
      <div className="year-view-title">{year}</div>
      <div className="year-grid">
        {MONTHS.map(({ key, label }) => {
          const yearMonth = `${year}-${key}`;
          const isActive = available.has(yearMonth);
          return (
            <div
              key={key}
              className={`month-box month-box--${isActive ? "active" : "inactive"}`}
              onClick={() => isActive && navigate(`/post/monthly-roundup/${yearMonth}`)}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;
