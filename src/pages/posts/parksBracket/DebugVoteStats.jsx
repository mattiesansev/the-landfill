import React, { useState, useEffect } from "react";
import {
  getAggregateVotes,
  isBracketLocked,
  getAllWinners,
  getTotalVoters,
  hasMatchupTie,
  getUserBracket,
  canEditBracket,
  addSimulatedVotes,
  clearSimulatedVotes,
} from "../../../services/bracketVoteService";
import { PARKS } from "./bracketData";

const DebugVoteStats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      refreshStats();
    }
  }, [isOpen]);

  const refreshStats = () => {
    const aggregateVotes = getAggregateVotes();
    const locked = isBracketLocked();
    const winners = getAllWinners();
    const userBracket = getUserBracket();

    // Build stats for each matchup
    const matchupStats = {};
    Object.entries(aggregateVotes).forEach(([matchupId, votes]) => {
      const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);
      const totalVotes = sortedVotes.reduce((sum, [, count]) => sum + count, 0);
      const leader = sortedVotes[0];
      const hasTie = hasMatchupTie(matchupId);

      matchupStats[matchupId] = {
        votes: sortedVotes.map(([parkId, count]) => ({
          parkId,
          parkName: PARKS[parkId]?.name || parkId,
          count,
          percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0,
        })),
        totalVotes,
        leader: leader ? { parkId: leader[0], parkName: PARKS[leader[0]]?.name || leader[0], count: leader[1] } : null,
        hasTie,
        winner: winners[matchupId] ? PARKS[winners[matchupId]]?.name || winners[matchupId] : null,
      };
    });

    setStats({
      totalVoters: getTotalVoters(),
      bracketLocked: locked,
      matchupStats,
      editingAllowed: canEditBracket(),
      userBracket: userBracket
        ? {
            submittedAt: userBracket.submittedAt,
            firstSubmittedAt: userBracket.firstSubmittedAt,
            sessionId: userBracket.sessionId,
            picksCount: Object.keys(userBracket.picks || {}).length,
          }
        : null,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          padding: "8px 16px",
          background: "#805ad5",
          color: "white",
          border: "none",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          zIndex: 100,
          opacity: 0.8,
        }}
      >
        Debug Stats
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 2000,
        padding: "20px",
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "#1a1a2e",
          color: "#eee",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "800px",
          width: "100%",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <h2 style={{ margin: 0, color: "#805ad5" }}>Vote Stats Debug</h2>
          <div>
            <button onClick={refreshStats} style={{ marginRight: "10px", padding: "5px 10px", cursor: "pointer" }}>
              Refresh
            </button>
            <button onClick={() => setIsOpen(false)} style={{ padding: "5px 10px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* User Bracket Status */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#f6ad55" }}>Your Bracket Status</h3>
              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: stats.editingAllowed ? "#38a169" : "#c53030",
                    color: "white",
                  }}
                >
                  {stats.editingAllowed ? "Editing Allowed" : "Bracket Locked"}
                </span>
              </div>
              {stats.userBracket ? (
                <div>
                  <div>Last Update: {new Date(stats.userBracket.submittedAt).toLocaleString()}</div>
                  {stats.userBracket.firstSubmittedAt && stats.userBracket.firstSubmittedAt !== stats.userBracket.submittedAt && (
                    <div style={{ color: "#a0aec0" }}>First Submitted: {new Date(stats.userBracket.firstSubmittedAt).toLocaleString()}</div>
                  )}
                  <div>Session ID: {stats.userBracket.sessionId}</div>
                  <div>Picks: {stats.userBracket.picksCount}/15</div>
                </div>
              ) : (
                <div style={{ color: "#68d391" }}>No bracket submitted yet</div>
              )}
            </div>

            {/* Overview */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#f6ad55" }}>Overview</h3>
              <div>Total Voters: {stats.totalVoters}</div>
              <div style={{ marginTop: "10px" }}>
                <strong>Bracket Status: </strong>
                <span
                  style={{
                    marginLeft: "10px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: stats.bracketLocked ? "#c53030" : "#38a169",
                    color: "white",
                    fontSize: "11px",
                  }}
                >
                  {stats.bracketLocked ? "Locked" : "Open"}
                </span>
              </div>
            </div>

            {/* Simulation Controls */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#f6ad55" }}>Simulate Voters</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { addSimulatedVotes(5); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +5 Random
                </button>
                <button
                  onClick={() => { addSimulatedVotes(10); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +10 Random
                </button>
                <button
                  onClick={() => { addSimulatedVotes(25); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +25 Random
                </button>
                <button
                  onClick={() => { addSimulatedVotes(10, "favorites"); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#3182ce", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +10 Favorites
                </button>
                <button
                  onClick={() => { addSimulatedVotes(10, "underdogs"); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#d69e2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +10 Underdogs
                </button>
                <button
                  onClick={() => { clearSimulatedVotes(); refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#e53e3e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  Clear Votes
                </button>
              </div>
              <div style={{ marginTop: "8px", fontSize: "11px", color: "#a0aec0" }}>
                Favorites = 70% higher seed wins | Underdogs = 70% lower seed wins | Clear keeps your bracket
              </div>
            </div>

            {/* Matchup Stats */}
            <div style={{ padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#f6ad55" }}>Matchup Results</h3>
              {Object.entries(stats.matchupStats)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([matchupId, data]) => (
                  <div
                    key={matchupId}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      background: "#1a1a2e",
                      borderRadius: "6px",
                      borderLeft: data.hasTie ? "3px solid #f6ad55" : data.winner ? "3px solid #68d391" : "3px solid #4a5568",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong style={{ color: "#63b3ed" }}>{matchupId}</strong>
                      <span style={{ color: "#a0aec0" }}>
                        {data.totalVotes} votes
                        {data.hasTie && <span style={{ color: "#f6ad55", marginLeft: "10px" }}>TIE</span>}
                        {data.winner && <span style={{ color: "#68d391", marginLeft: "10px" }}>Winner: {data.winner}</span>}
                      </span>
                    </div>
                    <div>
                      {data.votes.map((vote, idx) => (
                        <div
                          key={vote.parkId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                            color: idx === 0 ? "#68d391" : "#e2e8f0",
                          }}
                        >
                          <span>
                            {idx === 0 && !data.hasTie && "► "}
                            {vote.parkName}
                          </span>
                          <span>
                            {vote.count} ({vote.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DebugVoteStats;
