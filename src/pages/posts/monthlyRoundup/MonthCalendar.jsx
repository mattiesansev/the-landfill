import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IsleModal from "./IsleModal";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const islesByDate = {};
  if (data && data.isles) {
    for (const isle of data.isles) {
      if (isle.date) {
        if (!islesByDate[isle.date]) islesByDate[isle.date] = [];
        islesByDate[isle.date].push(isle);
      }
    }
  }

  const formatDate = (day) => {
    const mm = String(monthIndex + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

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

      {data && data.headline_stats && (
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

      <div className="calendar-grid">
        {DAY_NAMES.map((name) => (
          <div key={name} className="calendar-day-header">
            {name}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="calendar-day calendar-day--empty" />;
          }
          const dateKey = formatDate(day);
          const isles = islesByDate[dateKey] || [];
          return (
            <div
              key={dateKey}
              className={`calendar-day${isles.length > 0 ? " calendar-day--has-isles" : ""}`}
            >
              <span className="day-number">{day}</span>
              {isles.length > 0 && (
                <div className="isle-chips">
                  {isles.map((isle) => (
                    <button
                      key={isle.id}
                      className="isle-chip"
                      onClick={() => setActiveIsle(isle)}
                    >
                      {isle.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <IsleModal isle={activeIsle} onClose={() => setActiveIsle(null)} />
    </div>
  );
};

export default MonthCalendar;
