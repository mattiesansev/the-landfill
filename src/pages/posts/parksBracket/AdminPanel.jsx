import React, { useState, useEffect } from "react";
import {
  isBracketLocked,
  lockBracket,
  unlockBracket,
  getAggregateVotes,
  exportVotesToCSV,
  importVotesFromCSV,
  hasMatchupTie,
  setAdminOverride,
  removeAdminOverride,
  getAdminOverrides,
  getTotalVoters,
  exportAllData,
  importAllData,
  clearAllVotingData,
  getVoteLeaderboard,
} from "../../../services/bracketVoteService";
import { PARKS } from "./bracketData";

const ROUNDS = [
  { key: "round16", label: "Round of 16", matchupPrefix: "r16" },
  { key: "quarterfinals", label: "Quarterfinals", matchupPrefix: "qf" },
  { key: "semifinals", label: "Semifinals", matchupPrefix: "sf" },
  { key: "finals", label: "Finals", matchupPrefix: "f" },
];

const AdminPanel = ({ onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bracketLocked, setBracketLocked] = useState(false);
  const [aggregateVotes, setAggregateVotes] = useState({});
  const [adminOverrides, setAdminOverrides] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [csvInput, setCsvInput] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setBracketLocked(isBracketLocked());
    setAggregateVotes(getAggregateVotes());
    setAdminOverrides(getAdminOverrides());
    setLeaderboard(getVoteLeaderboard());
  };

  const handleToggleLock = () => {
    if (bracketLocked) {
      unlockBracket();
    } else {
      lockBracket();
    }
    refreshData();
    onRefresh?.();
  };

  const handleExportCSV = () => {
    const csv = exportVotesToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sf_parks_bracket_votes_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Votes exported successfully!" });
  };

  const handleImportCSV = () => {
    if (!csvInput.trim()) {
      setMessage({ type: "error", text: "Please paste CSV data first" });
      return;
    }
    try {
      importVotesFromCSV(csvInput);
      refreshData();
      onRefresh?.();
      setCsvInput("");
      setMessage({ type: "success", text: "Votes imported successfully!" });
    } catch (e) {
      setMessage({ type: "error", text: "Failed to import CSV: " + e.message });
    }
  };

  const handleExportAll = () => {
    const data = exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sf_parks_bracket_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Full backup exported!" });
  };

  const handleSetOverride = (matchupId, parkId) => {
    setAdminOverride(matchupId, parkId);
    refreshData();
    onRefresh?.();
    setMessage({ type: "success", text: `Override set for ${matchupId}` });
  };

  const handleRemoveOverride = (matchupId) => {
    removeAdminOverride(matchupId);
    refreshData();
    onRefresh?.();
    setMessage({ type: "success", text: `Override removed for ${matchupId}` });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure? This will delete ALL voting data!")) {
      clearAllVotingData();
      refreshData();
      onRefresh?.();
      setMessage({ type: "success", text: "All data cleared" });
    }
  };

  const getMatchupsForRound = (prefix) => {
    return Object.keys(aggregateVotes)
      .filter((id) => id.startsWith(prefix) || (prefix === "f" && id === "f-1"))
      .sort();
  };

  const totalVoters = getTotalVoters();

  if (!isOpen) {
    return (
      <button className="admin-panel-toggle" onClick={() => setIsOpen(true)}>
        Admin
      </button>
    );
  }

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel">
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <h2>Admin Panel</h2>

        {message && (
          <div className={`admin-message ${message.type}`}>{message.text}</div>
        )}

        <div className="admin-stats">
          <span>Total Voters: {totalVoters}</span>
        </div>

        <div className="admin-section">
          <h3>Bracket Lock</h3>
          <div className="lock-control">
            <button
              className={`lock-toggle ${bracketLocked ? "locked" : "unlocked"}`}
              onClick={handleToggleLock}
            >
              {bracketLocked ? "Locked - Click to Unlock" : "Unlocked - Click to Lock"}
            </button>
            <p className="lock-description">
              {bracketLocked
                ? "Voting is closed. Results are visible."
                : "Voting is open. Users can submit and edit brackets."}
            </p>
          </div>
        </div>

        <div className="admin-section">
          <h3>Popular Vote Leaderboard</h3>
          <div className="leaderboard">
            {leaderboard.length === 0 ? (
              <p className="no-votes">No votes yet</p>
            ) : (
              <ol className="leaderboard-list">
                {leaderboard.map(({ parkId, votes }, index) => {
                  const park = PARKS[parkId];
                  return (
                    <li key={parkId} className="leaderboard-item">
                      <span className="leaderboard-rank">#{index + 1}</span>
                      <span className="leaderboard-park">{park?.name || parkId}</span>
                      <span className="leaderboard-votes">{votes} votes</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        <div className="admin-section">
          <h3>Vote Totals by Matchup</h3>
          {ROUNDS.map((round) => {
            const matchups = getMatchupsForRound(round.matchupPrefix);
            if (matchups.length === 0) return null;

            return (
              <div key={round.key} className="round-votes">
                <h4>{round.label}</h4>
                {matchups.map((matchupId) => {
                  const votes = aggregateVotes[matchupId] || {};
                  const hasTie = hasMatchupTie(matchupId);
                  const override = adminOverrides[matchupId];

                  return (
                    <div
                      key={matchupId}
                      className={`matchup-votes ${hasTie ? "tie" : ""}`}
                    >
                      <div className="matchup-id">{matchupId}</div>
                      <div className="votes-list">
                        {Object.entries(votes)
                          .sort((a, b) => b[1] - a[1])
                          .map(([parkId, count]) => {
                            const park = PARKS[parkId];
                            const isOverride = override === parkId;
                            return (
                              <div
                                key={parkId}
                                className={`vote-item ${isOverride ? "override" : ""}`}
                              >
                                <span className="park-name">
                                  {park?.name || parkId}
                                </span>
                                <span className="vote-count">{count}</span>
                                {hasTie && (
                                  <button
                                    className="override-btn"
                                    onClick={() =>
                                      handleSetOverride(matchupId, parkId)
                                    }
                                  >
                                    {isOverride ? "Winner" : "Set Winner"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      {override && (
                        <button
                          className="remove-override-btn"
                          onClick={() => handleRemoveOverride(matchupId)}
                        >
                          Remove Override
                        </button>
                      )}
                      {hasTie && !override && (
                        <div className="tie-warning">TIE - Select a winner</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="admin-section">
          <h3>Data Management</h3>
          <div className="data-buttons">
            <button onClick={handleExportCSV}>Export Votes CSV</button>
            <button onClick={handleExportAll}>Export Full Backup</button>
            <button className="danger" onClick={handleClearAll}>
              Clear All Data
            </button>
          </div>
          <div className="csv-import">
            <textarea
              placeholder="Paste CSV data here to import..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
            <button onClick={handleImportCSV}>Import CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
