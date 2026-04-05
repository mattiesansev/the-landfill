import { useState } from "react";
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
      <button className="back-link" onClick={() => navigate("/post/monthly-roundup")}>
        ← All Months
      </button>

      <div className="roundup-page-header">
        <div className="roundup-eyebrow">Board of Supervisors</div>
        <h1 className="roundup-page-title">{MONTH_NAMES[monthIndex]} Roundup</h1>
        <p className="roundup-page-subtitle">Your monthly digest of city governance</p>
      </div>

      {data?.headline_stats && (
        <div className="roundup-stat-cards">
          {data.headline_stats.map((stat, i) => (
            <div key={i} className="roundup-stat-card">
              <span className="stat-card-value">{stat.value}</span>
              <span className="stat-card-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      <p className="roundup-isles-intro">
        We pulled out {data?.isles?.length ?? "a few"} key areas of interest from
        the world of SF local politics in the month of {MONTH_NAMES[monthIndex]}.
        Click on each sticky note to learn more!
      </p>

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
              {isle.stats && isle.stats.map((stat, j) => (
                <span key={j} className="isle-sticky-stat">
                  <span className="sticky-stat-value">{stat.value}</span>{" "}
                  <span className="sticky-stat-label">{stat.label}</span>
                </span>
              ))}
            </button>
          ))}
        </div>
      )}

      <IsleModal isle={activeIsle} onClose={() => setActiveIsle(null)} />
    </div>
  );
};

export default MonthCalendar;
