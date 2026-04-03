import React from "react";
import SectionCard from "./SectionCard";

const IsleCard = ({ isle }) => {
  return (
    <div className="isle-card">
      <h2 className="isle-card-title">{isle.title}</h2>

      <ul className="isle-card-stats">
        {isle.stats.map((stat, i) => (
          <li key={i}>
            <span className="isle-stat-value">{stat.value}</span>{" "}
            <span className="isle-stat-label">{stat.label}</span>
          </li>
        ))}
      </ul>

      <div className="section-cards">
        {isle.sections.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>
    </div>
  );
};

export default IsleCard;
