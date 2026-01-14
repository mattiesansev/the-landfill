import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const WeeklyReport = () => {
  const { date } = useParams();
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  // Format the date for display
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(date);

  return (
    <div className="single">
      <div className="content">
        <div className="title">Board of Supervisors Meeting</div>
        <div className="subtitle">{formattedDate}</div>
        <p>Report coming soon...</p>
      </div>
    </div>
  );
};

export default WeeklyReport;
