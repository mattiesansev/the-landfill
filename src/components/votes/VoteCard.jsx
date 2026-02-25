import React from "react";
import SupervisorGrid from "./SupervisorGrid";

const VoteCard = ({ vote, supervisors }) => {
  const ayesCount = vote.vote.ayes_names.length;
  const noesCount = vote.vote.noes_names.length;
  const excusedCount = vote.vote.excused.length;

  return (
    <div className="vote-card">
      <div className="vote-header">
        <span className="vote-action">{vote.action}</span>
        <span className="file-number">File #{vote.file_number}</span>
      </div>
      <h3 className="vote-title">{vote.title}</h3>
      <p className="vote-description">{vote.description}</p>
      <SupervisorGrid supervisors={supervisors} vote={vote.vote} />
      <div className="vote-summary">
        <span className="ayes">{ayesCount} Ayes</span>
        <span className="noes">{noesCount} Noes</span>
        {excusedCount > 0 && (
          <span className="excused">{excusedCount} Excused</span>
        )}
      </div>
    </div>
  );
};

export default VoteCard;
