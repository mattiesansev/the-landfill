import React, { useState } from "react";
import AdminPanel from "./posts/parksBracket/AdminPanel";
import DebugVoteStats from "./posts/parksBracket/DebugVoteStats";
import {
  verifyAdminPassword,
  setAdminPassword,
} from "../services/bracketVoteService";

const BracketAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setAuthError(null);
    setLoading(true);
    const valid = await verifyAdminPassword(passwordInput);
    setLoading(false);
    if (valid) {
      setAdminPassword(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput("");
    } else {
      setAuthError("Invalid password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bracket-admin-login">
        <h2>Bracket Admin</h2>
        <p>Enter the admin password to access controls and debug stats.</p>
        {authError && <div className="bracket-admin-error">{authError}</div>}
        <div className="bracket-admin-login-form">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
            placeholder="Password"
            disabled={loading}
            autoFocus
          />
          <button onClick={handleLogin} disabled={loading || !passwordInput}>
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bracket-admin-page">
      <div className="bracket-admin-header">
        <h2>Bracket Admin</h2>
        <button
          className="bracket-admin-logout"
          onClick={() => setIsAuthenticated(false)}
        >
          Log out
        </button>
      </div>
      <div className="bracket-admin-sections">
        <section className="bracket-admin-section">
          <AdminPanel standalone onRefresh={() => {}} />
        </section>
        <section className="bracket-admin-section">
          <DebugVoteStats standalone />
        </section>
      </div>
    </div>
  );
};

export default BracketAdmin;
