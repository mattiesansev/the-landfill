import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import IsleCard from "./monthlyRoundup/IsleCard";

const MonthlyRoundup = () => {
  const { month } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/roundups/${month}.json`);
        if (!response.ok) throw new Error("Roundup data not found");
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [month]);

  if (loading) return <div className="weekly-report-loading">Loading...</div>;
  if (error) return <div className="weekly-report-error">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="monthly-roundup">
      <div className="roundup-header">
        <div className="roundup-eyebrow">Board of Supervisors</div>
        <h1 className="roundup-title">{data.display_month} Roundup</h1>
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
      </div>

      <div className="roundup-isles">
        {data.isles.map((isle) => (
          <IsleCard key={isle.id} isle={isle} />
        ))}
      </div>
    </div>
  );
};

export default MonthlyRoundup;
