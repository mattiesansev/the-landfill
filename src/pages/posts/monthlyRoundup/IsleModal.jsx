import React, { useEffect } from "react";

const IsleModal = ({ isle, onClose }) => {
  useEffect(() => {
    if (!isle) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isle, onClose]);

  if (!isle) return null;

  return (
    <div className="isle-modal-overlay" onClick={onClose}>
      <div className="isle-modal" onClick={(e) => e.stopPropagation()}>
        <button className="isle-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="isle-modal-header">
          <h2>{isle.title}</h2>
        </div>
        {isle.stats && isle.stats.length > 0 && (
          <ul className="isle-modal-stats">
            {isle.stats.map((stat, i) => (
              <li key={i}>
                <span className="isle-stat-value">{stat.value}</span>{" "}
                <span className="isle-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        )}
        {isle.sections &&
          isle.sections.map((section, i) => (
            <div key={i} className="isle-modal-section">
              <div className="isle-modal-section-title">{section.title}</div>
              <p>{section.body}</p>
              {section.list && section.list.length > 0 && (
                <ol className="isle-section-list">
                  {section.list.map((item, j) => <li key={j}>{item}</li>)}
                </ol>
              )}
              {section.body_after && (
                <p>{section.body_after}</p>
              )}
              {section.prompt && (
                <div className="section-card-prompt">
                  {section.prompt}
                </div>
              )}
              {section.links && section.links.filter((l) => l.url).length > 0 && (
                <ul className="isle-modal-links">
                  {section.links
                    .filter((l) => l.url)
                    .map((link, j) => (
                      <li key={j}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.text}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
              {section.image && (
                <img src={section.image} alt="" className="isle-section-image" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default IsleModal;
