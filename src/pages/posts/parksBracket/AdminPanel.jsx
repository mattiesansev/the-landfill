import React, { useState, useEffect } from "react";
import {
  isBracketLocked,
  lockBracket,
  unlockBracket,
  getAggregateVotes,
  exportVotesToCSV,
  importVotesFromCSV,
  setAdminOverride,
  removeAdminOverride,
  getAdminOverrides,
  getTotalVoters,
  exportAllData,
  clearAllVotingData,
  getVoteLeaderboard,
  getActiveRound,
  setActiveRound,
  getAllMatchupIds,
  getCombinedMatchupVotes,
  getPerRoundMatchupVotes,
  getRoundKeyFromMatchupId,
  setAdminPassword,
  verifyAdminPassword,
} from "../../../services/bracketVoteService";
import { PARKS } from "./bracketData";

const ROUNDS = [
  { key: "round16", label: "Round of 16", matchupPrefix: "r16" },
  { key: "quarterfinals", label: "Quarterfinals", matchupPrefix: "qf" },
  { key: "semifinals", label: "Semifinals", matchupPrefix: "sf" },
  { key: "finals", label: "Finals", matchupPrefix: "f" },
  { key: "completed", label: "Completed" },
];

const AdminPanel = ({ onRefresh, standalone = false }) => {
  const [isOpen, setIsOpen] = useState(standalone);
  const [bracketLocked, setBracketLocked] = useState(false);
  const [aggregateVotes, setAggregateVotes] = useState({});
  const [adminOverrides, setAdminOverrides] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [csvInput, setCsvInput] = useState("");
  const [message, setMessage] = useState(null);
  const [currentActiveRound, setCurrentActiveRound] = useState(null);
  const [tiedMatchups, setTiedMatchups] = useState([]);

  // Admin auth — skip when running in standalone mode (page already authenticated)
  const [isAuthenticated, setIsAuthenticated] = useState(standalone);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshData();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async () => {
    setAuthError(null);
    const valid = await verifyAdminPassword(passwordInput);
    if (valid) {
      setAdminPassword(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput("");
    } else {
      setAuthError("Invalid password");
    }
  };

  const refreshData = async () => {
    const [locked, aggVotes, overrides, board, activeRd, voters] = await Promise.all([
      isBracketLocked(),
      getAggregateVotes(),
      getAdminOverrides(),
      getVoteLeaderboard(),
      getActiveRound(),
      getTotalVoters(),
    ]);

    setBracketLocked(locked);
    setAggregateVotes(aggVotes);
    setAdminOverrides(overrides);
    setLeaderboard(board);
    setCurrentActiveRound(activeRd);
    setTotalVoters(voters);

    // Find all tied matchups that don't have an override.
    // R16: use combined bracket + per-round votes (parks are fixed seedings).
    // QF+: use ONLY per-round votes — bracket predictions include parks that may
    //      not have advanced, which would create phantom ties with the wrong parks.
    const tied = [];
    const allIds = getAllMatchupIds();
    for (const matchupId of allIds) {
      if (overrides[matchupId]) continue; // already resolved
      const votes = matchupId.startsWith('r16')
        ? await getCombinedMatchupVotes(matchupId)
        : await getPerRoundMatchupVotes(matchupId);
      const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
      if (sorted.length >= 2 && sorted[0][1] === sorted[1][1] && sorted[0][1] > 0) {
        tied.push({
          matchupId,
          round: getRoundKeyFromMatchupId(matchupId),
          parks: sorted.map(([parkId, count]) => ({ parkId, count })),
        });
      }
    }
    setTiedMatchups(tied);
  };

  const handleToggleLock = async () => {
    if (bracketLocked) {
      await unlockBracket();
    } else {
      await lockBracket();
    }
    await refreshData();
    onRefresh?.();
  };

  const handleToggleActiveRound = async (roundKey) => {
    if (currentActiveRound === roundKey) {
      await setActiveRound(null);
    } else {
      await setActiveRound(roundKey);
    }
    await refreshData();
    onRefresh?.();
  };

  const handleExportCSV = async () => {
    const csv = await exportVotesToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sf_parks_bracket_votes_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Votes exported successfully!" });
  };

  const handleImportCSV = async () => {
    if (!csvInput.trim()) {
      setMessage({ type: "error", text: "Please paste CSV data first" });
      return;
    }
    try {
      await importVotesFromCSV(csvInput);
      await refreshData();
      onRefresh?.();
      setCsvInput("");
      setMessage({ type: "success", text: "Votes imported successfully!" });
    } catch (e) {
      setMessage({ type: "error", text: "Failed to import CSV: " + e.message });
    }
  };

  const handleExportAll = async () => {
    const data = await exportAllData();
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

  const handleSetOverride = async (matchupId, parkId) => {
    await setAdminOverride(matchupId, parkId);
    await refreshData();
    onRefresh?.();
    setMessage({ type: "success", text: `Override set for ${matchupId}` });
  };

  const handleRemoveOverride = async (matchupId) => {
    await removeAdminOverride(matchupId);
    await refreshData();
    onRefresh?.();
    setMessage({ type: "success", text: `Override removed for ${matchupId}` });
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure? This will delete ALL voting data!")) {
      await clearAllVotingData();
      await refreshData();
      onRefresh?.();
      setMessage({ type: "success", text: "All data cleared" });
    }
  };

  const getMatchupsForRound = (prefix) => {
    return Object.keys(aggregateVotes)
      .filter((id) => id.startsWith(prefix) || (prefix === "f" && id === "f-1"))
      .sort();
  };

  if (!isOpen) {
    return (
      <button className="admin-panel-toggle" onClick={() => setIsOpen(true)}>
        Admin
      </button>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-panel-overlay">
        <div className="admin-panel">
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            &times;
          </button>
          <h2>Admin Panel</h2>
          <div className="admin-section">
            <h3>Enter Admin Password</h3>
            {authError && (
              <div className="admin-message error">{authError}</div>
            )}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #4a5568", background: "#2a2a4a", color: "#eee", flex: 1 }}
              />
              <button onClick={handleLogin} style={{ padding: "8px 16px" }}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const panelContent = (
    <div className="admin-panel">
      {!standalone && (
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          &times;
        </button>
      )}
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
          <h3>Per-Round Voting</h3>
          {currentActiveRound && (
            <div className="active-round-info">
              Active: {ROUNDS.find((r) => r.key === currentActiveRound)?.label || currentActiveRound}
            </div>
          )}
          <div className="round-selector">
            {ROUNDS.map((round) => (
              <button
                key={round.key}
                className={`round-selector-btn ${currentActiveRound === round.key ? "active" : ""}`}
                onClick={() => handleToggleActiveRound(round.key)}
              >
                {round.label}
              </button>
            ))}
          </div>
          <p className="lock-description">
            {currentActiveRound === "completed"
              ? "All rounds completed. Results are fully visible. Click again to revert."
              : currentActiveRound
              ? "Click the active round again to close per-round voting."
              : "Select a round to open per-round voting."}
          </p>
        </div>

        <div className="admin-section">
          <h3>Tie Breakers</h3>
          {tiedMatchups.length === 0 ? (
            <p className="no-votes">No tied matchups</p>
          ) : (
            <div className="tiebreaker-list">
              {ROUNDS.map((round) => {
                const roundTies = tiedMatchups.filter((t) => t.round === round.key);
                if (roundTies.length === 0) return null;
                return (
                  <div key={round.key} className="tiebreaker-round">
                    <h4>{round.label}</h4>
                    {roundTies.map(({ matchupId, parks }) => (
                      <div key={matchupId} className="tiebreaker-matchup">
                        <div className="tiebreaker-matchup-id">{matchupId}</div>
                        <div className="tiebreaker-options">
                          {parks.map(({ parkId, count }) => (
                            <button
                              key={parkId}
                              className="tiebreaker-pick-btn"
                              onClick={() => handleSetOverride(matchupId, parkId)}
                            >
                              {PARKS[parkId]?.name || parkId}
                              <span className="tiebreaker-count">{count}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {Object.keys(adminOverrides).length > 0 && (
            <div className="tiebreaker-overrides">
              <h4>Active Overrides</h4>
              {Object.entries(adminOverrides).map(([matchupId, parkId]) => (
                <div key={matchupId} className="tiebreaker-override-item">
                  <span className="tiebreaker-override-matchup">{matchupId}</span>
                  <span className="tiebreaker-override-winner">
                    {PARKS[parkId]?.name || parkId}
                  </span>
                  <button
                    className="remove-override-btn"
                    onClick={() => handleRemoveOverride(matchupId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
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
                  const override = adminOverrides[matchupId];

                  return (
                    <div
                      key={matchupId}
                      className="matchup-votes"
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
  );

  if (standalone) {
    return panelContent;
  }

  return (
    <div className="admin-panel-overlay">
      {panelContent}
    </div>
  );
};

export default AdminPanel;
