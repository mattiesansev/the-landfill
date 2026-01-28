import React from "react";
import SupervisorTile from "./SupervisorTile";

const SupervisorGrid = ({ supervisors, vote }) => {
  const getVoteStatus = (lastName) => {
    if (vote.ayes_names.includes(lastName)) return "yes";
    if (vote.noes_names.includes(lastName)) return "no";
    if (vote.excused.includes(lastName)) return "excused";
    return "absent";
  };

  return (
    <div className="supervisor-grid">
      {supervisors.map((supervisor) => (
        <SupervisorTile
          key={supervisor.district}
          supervisor={supervisor}
          voteStatus={getVoteStatus(supervisor.lastName)}
        />
      ))}
    </div>
  );
};

export default SupervisorGrid;
