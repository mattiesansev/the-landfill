import React from "react";

const SupervisorTile = ({ supervisor, voteStatus }) => {
  return (
    <div className={`supervisor-tile vote-${voteStatus}`}>
      <img
        src={supervisor.image}
        alt={supervisor.fullName}
      />
      <span className="district-label">D{supervisor.district}</span>
      <span className="name-label">{supervisor.lastName}</span>
    </div>
  );
};

export default SupervisorTile;
