import React from "react";
import IsleNode from "./IsleNode";

const IsleTrack = ({ isles, activeIsle, onSelectIsle }) => {
  return (
    <div className="isle-track">
      {isles.map((isle) => (
        <IsleNode
          key={isle.id}
          isle={isle}
          isActive={activeIsle === isle.id}
          onClick={() => onSelectIsle(isle.id)}
        />
      ))}
    </div>
  );
};

export default IsleTrack;
