import React, { useState } from "react";

const SectionCard = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`section-card${open ? " section-card--open" : ""}`}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
    >
      <div className="section-card-title">{section.title}</div>

      {open && (
        <div className="section-card-body" onClick={(e) => e.stopPropagation()}>
          <p>{section.body}</p>
          {section.prompt && (
            <div className="section-card-prompt">
              <span className="prompt-label">Reader prompt:</span> {section.prompt}
            </div>
          )}
          {section.links && section.links.length > 0 && (
            <ul className="section-card-links">
              {section.links.map((link, i) => (
                <li key={i}>
                  {link.url ? (
                    <a href={link.url} target="_blank" rel="noreferrer">{link.text}</a>
                  ) : (
                    <span>{link.text}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
