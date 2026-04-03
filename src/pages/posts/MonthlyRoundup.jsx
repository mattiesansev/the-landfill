import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import YearView from "./monthlyRoundup/YearView";
import MonthCalendar from "./monthlyRoundup/MonthCalendar";

const MonthlyRoundup = () => {
  const { month } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    if (!month) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
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

  return (
    <div className="monthly-roundup">
      {!month ? (
        <YearView year={2026} />
      ) : (
        data && <MonthCalendar data={data} yearMonth={month} />
      )}
    </div>
  );
};

export default MonthlyRoundup;
