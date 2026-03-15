import React, { useState, useEffect } from "react";
import {
  getAggregateVotes,
  isBracketLocked,
  getAllWinners,
  getTotalVoters,
  getUserBracket,
  canEditBracket,
  simulateVoters,
  getPerRoundVotes,
  getActiveRound,
  getUserRoundVotes,
} from "../../../services/bracketVoteService";
import { PARKS } from "./bracketData";

const ROUND_GROUPS = [
  { key: "r16", label: "Round of 16", matchupIds: ["r16-1", "r16-2", "r16-3", "r16-4", "r16-5", "r16-6", "r16-7", "r16-8"] },
  { key: "qf", label: "Quarterfinals", matchupIds: ["qf-1", "qf-2", "qf-3", "qf-4"] },
  { key: "sf", label: "Semifinals", matchupIds: ["sf-1", "sf-2"] },
  { key: "f", label: "Finals", matchupIds: ["f-1"] },
];

const DebugVoteStats = ({ standalone = false }) => {
  const [isOpen, setIsOpen] = useState(standalone);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      refreshStats();
    }
  }, [isOpen]);

  const refreshStats = async () => {
    const [aggregateVotes, perRoundVotes, locked, winners, userBracket, activeRound, userRoundVotes, voters, editable] =
      await Promise.all([
        getAggregateVotes(),
        getPerRoundVotes(),
        isBracketLocked(),
        getAllWinners(),
        getUserBracket(),
        getActiveRound(),
        getUserRoundVotes(),
        getTotalVoters(),
        canEditBracket(),
      ]);

    // Collect all matchup IDs from both sources
    const allMatchupIds = new Set([
      ...Object.keys(aggregateVotes),
      ...Object.keys(perRoundVotes),
    ]);

    // Build stats for each matchup
    const matchupStats = {};
    for (const matchupId of allMatchupIds) {
      const bracketVotes = aggregateVotes[matchupId] || {};
      const roundVotes = perRoundVotes[matchupId] || {};

      // Compute combined votes locally using same round-aware logic:
      // R16: bracket + per-round; QF+: per-round only
      const combinedVotes = {};
      if (matchupId.startsWith('r16')) {
        Object.entries(bracketVotes).forEach(([parkId, count]) => {
          combinedVotes[parkId] = (combinedVotes[parkId] || 0) + count;
        });
      }
      Object.entries(roundVotes).forEach(([parkId, count]) => {
        combinedVotes[parkId] = (combinedVotes[parkId] || 0) + count;
      });

      const sortedCombined = Object.entries(combinedVotes).sort((a, b) => b[1] - a[1]);
      const totalCombined = sortedCombined.reduce((sum, [, count]) => sum + count, 0);
      const leader = sortedCombined[0];

      // Detect tie locally from combined votes
      const hasTie = sortedCombined.length >= 2 && sortedCombined[0][1] === sortedCombined[1][1];

      matchupStats[matchupId] = {
        bracketVotes,
        roundVotes,
        combined: sortedCombined.map(([parkId, count]) => ({
          parkId,
          parkName: PARKS[parkId]?.name || parkId,
          count,
          percentage: totalCombined > 0 ? ((count / totalCombined) * 100).toFixed(1) : 0,
        })),
        totalCombined,
        leader: leader ? { parkId: leader[0], parkName: PARKS[leader[0]]?.name || leader[0], count: leader[1] } : null,
        hasTie,
        winner: winners[matchupId] ? PARKS[winners[matchupId]]?.name || winners[matchupId] : null,
      };
    }

    // Compute bracket-only totals
    const bracketTotalVotes = Object.values(aggregateVotes).reduce(
      (sum, matchup) => sum + Object.values(matchup).reduce((s, c) => s + c, 0),
      0
    );

    // Compute round-only totals
    const roundTotalVotes = Object.values(perRoundVotes).reduce(
      (sum, matchup) => sum + Object.values(matchup).reduce((s, c) => s + c, 0),
      0
    );

    setStats({
      totalVoters: voters,
      bracketLocked: locked,
      activeRound,
      matchupStats,
      editingAllowed: editable,
      bracketTotalVotes,
      roundTotalVotes,
      userRoundVotesCount: Object.keys(userRoundVotes).length,
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

  const content = (
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
          {!standalone && (
            <button onClick={() => setIsOpen(false)} style={{ padding: "5px 10px", cursor: "pointer" }}>
              Close
            </button>
          )}
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
              <div>Total Bracket Voters: {stats.totalVoters}</div>
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
              <div style={{ marginTop: "10px" }}>
                <strong>Active Round: </strong>
                <span
                  style={{
                    marginLeft: "10px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: stats.activeRound ? "#38a169" : "#4a5568",
                    color: "white",
                    fontSize: "11px",
                  }}
                >
                  {stats.activeRound || "None"}
                </span>
              </div>
            </div>

            {/* Bracket Votes Section */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#63b3ed" }}>
                Bracket Votes
                <span style={{ fontSize: "12px", color: "#a0aec0", marginLeft: "10px", fontWeight: "400" }}>
                  {stats.bracketTotalVotes} total votes
                </span>
              </h3>
              {ROUND_GROUPS.map((group) => {
                const groupEntries = group.matchupIds
                  .filter((id) => stats.matchupStats[id] && Object.keys(stats.matchupStats[id].bracketVotes).length > 0)
                  .map((id) => [id, stats.matchupStats[id]]);
                if (groupEntries.length === 0) return null;
                const groupTotal = groupEntries.reduce(
                  (sum, [, data]) => sum + Object.values(data.bracketVotes).reduce((s, c) => s + c, 0), 0
                );
                return (
                  <div key={group.key} style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", color: "#63b3ed", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {group.label}
                      <span style={{ color: "#a0aec0", fontWeight: "400", marginLeft: "8px" }}>{groupTotal} votes</span>
                    </div>
                    {groupEntries.map(([matchupId, data]) => (
                      <div key={matchupId} style={{ marginBottom: "8px", padding: "8px", background: "#1a1a2e", borderRadius: "6px", borderLeft: "3px solid #63b3ed" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <strong style={{ color: "#63b3ed" }}>{matchupId}</strong>
                          <span style={{ color: "#a0aec0", fontSize: "12px" }}>
                            {Object.values(data.bracketVotes).reduce((s, c) => s + c, 0)} votes
                          </span>
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          {Object.entries(data.bracketVotes)
                            .sort((a, b) => b[1] - a[1])
                            .map(([parkId, count]) => (
                              <span key={parkId} style={{ marginRight: "14px" }}>
                                {PARKS[parkId]?.name || parkId}: {count}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {stats.bracketTotalVotes === 0 && (
                <div style={{ color: "#4a5568", fontStyle: "italic" }}>No bracket votes yet</div>
              )}
            </div>

            {/* Round Votes Section */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#f6ad55" }}>
                Round Votes
                <span style={{ fontSize: "12px", color: "#a0aec0", marginLeft: "10px", fontWeight: "400" }}>
                  {stats.roundTotalVotes} total votes | Your round votes: {stats.userRoundVotesCount}
                </span>
              </h3>
              {ROUND_GROUPS.map((group) => {
                const groupEntries = group.matchupIds
                  .filter((id) => stats.matchupStats[id] && Object.keys(stats.matchupStats[id].roundVotes).length > 0)
                  .map((id) => [id, stats.matchupStats[id]]);
                if (groupEntries.length === 0) return null;
                const groupTotal = groupEntries.reduce(
                  (sum, [, data]) => sum + Object.values(data.roundVotes).reduce((s, c) => s + c, 0), 0
                );
                return (
                  <div key={group.key} style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "11px", color: "#f6ad55", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {group.label}
                      <span style={{ color: "#a0aec0", fontWeight: "400", marginLeft: "8px" }}>{groupTotal} votes</span>
                    </div>
                    {groupEntries.map(([matchupId, data]) => (
                      <div key={matchupId} style={{ marginBottom: "8px", padding: "8px", background: "#1a1a2e", borderRadius: "6px", borderLeft: "3px solid #f6ad55" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <strong style={{ color: "#f6ad55" }}>{matchupId}</strong>
                          <span style={{ color: "#a0aec0", fontSize: "12px" }}>
                            {Object.values(data.roundVotes).reduce((s, c) => s + c, 0)} votes
                          </span>
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          {Object.entries(data.roundVotes)
                            .sort((a, b) => b[1] - a[1])
                            .map(([parkId, count]) => (
                              <span key={parkId} style={{ marginRight: "14px" }}>
                                {PARKS[parkId]?.name || parkId}: {count}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {stats.roundTotalVotes === 0 && (
                <div style={{ color: "#4a5568", fontStyle: "italic" }}>No round votes yet</div>
              )}
            </div>

            {/* Simulation Controls */}
            <div style={{ marginBottom: "20px", padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#f6ad55" }}>Simulate Voters</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={async () => { await simulateVoters(5); await refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +5 Random
                </button>
                <button
                  onClick={async () => { await simulateVoters(10); await refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +10 Random
                </button>
                <button
                  onClick={async () => { await simulateVoters(25); await refreshStats(); }}
                  style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  +25 Random
                </button>
              </div>
              <div style={{ marginTop: "8px", fontSize: "11px", color: "#a0aec0" }}>
                Generates random bracket submissions + round votes for active round
              </div>
            </div>

            {/* Combined Matchup Stats */}
            <div style={{ padding: "10px", background: "#2a2a4a", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#f6ad55" }}>Combined Matchup Results</h3>
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
                        {data.totalCombined} combined
                        {data.hasTie && <span style={{ color: "#f6ad55", marginLeft: "10px" }}>TIE</span>}
                        {data.winner && <span style={{ color: "#68d391", marginLeft: "10px" }}>Winner: {data.winner}</span>}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      {data.combined.map((vote, idx) => (
                        <div key={vote.parkId} style={{ padding: "2px 0", color: idx === 0 && !data.hasTie ? "#68d391" : "inherit" }}>
                          {idx === 0 && !data.hasTie && "► "}
                          {vote.parkName}: {vote.count} ({vote.percentage}%)
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
  );

  if (standalone) {
    return content;
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
      {content}
    </div>
  );
};

export default DebugVoteStats;
