import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ReactGA from "react-ga4";
import VoteCard from "../../components/votes/VoteCard";

const WeeklyReport = () => {
  const { date } = useParams();
  const location = useLocation();
  const [voteData, setVoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    async function loadVoteData() {
      try {
        const response = await fetch(`/votes/${date}.json`);
        if (!response.ok) {
          throw new Error("Vote data not found");
        }
        const data = await response.json();
        setVoteData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVoteData();
  }, [date]);

  if (loading) {
    return (
      <div className="single">
        <div className="content">
          <Link to="/post/supervisor-updates" className="back-link">
            &larr; All Meetings
          </Link>
          <div className="title">Board of Supervisors Meeting</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !voteData) {
    return (
      <div className="single">
        <div className="content">
          <Link to="/post/supervisor-updates" className="back-link">
            &larr; All Meetings
          </Link>
          <div className="title">Board of Supervisors Meeting</div>
          <p>Report coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="single">
      <div className="content">
        <Link to="/post/supervisor-updates" className="back-link">
          &larr; All Meetings
        </Link>
        <div className="title">Board of Supervisors Meeting</div>
        <div className="subtitle">{voteData.meeting.display_date}</div>

        <div className="votes-section">
          <h2>Key Votes</h2>
          {voteData.importantVotes.map((vote) => (
            <VoteCard
              key={vote.file_number}
              vote={vote}
              supervisors={voteData.supervisors}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
