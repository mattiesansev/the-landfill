import React from "react";

const IsleNode = ({ isle, isActive, onClick }) => {
  return (
    <div
      className={`isle-node${isActive ? " isle-node--active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="node-dot" />
      <div className="node-title">{isle.title}</div>
      <ul className="node-stats">
        {isle.stats.map((stat, i) => (
          <li key={i}>
            <span className="node-stat-value">{stat.value}</span>{" "}
            <span className="node-stat-label">{stat.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IsleNode;
