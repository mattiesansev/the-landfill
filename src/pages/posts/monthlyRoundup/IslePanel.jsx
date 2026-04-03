import React from "react";

const IslePanel = ({ isle, onClose }) => {
  const isOpen = isle !== null;

  return (
    <>
      <div
        className={`isle-panel-overlay${isOpen ? " isle-panel-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`isle-panel${isOpen ? " isle-panel--open" : ""}`} aria-label="Isle detail panel">
        {isle && (
          <>
            <div className="isle-panel-header">
              <div className="isle-panel-number">Isle {isle.number}</div>
              <h2 className="isle-panel-title">{isle.title}</h2>
              <button className="isle-panel-close" onClick={onClose} aria-label="Close panel">
                ✕
              </button>
            </div>
            <div className="isle-panel-body">
              {isle.sections.map((section, i) => (
                <div key={i} className="isle-section">
                  <h3 className="isle-section-title">{section.title}</h3>
                  <p className="isle-section-body">{section.body}</p>
                  {section.prompt && (
                    <div className="isle-section-prompt">
                      <span className="prompt-label">Reader prompt:</span> {section.prompt}
                    </div>
                  )}
                  {section.links && section.links.length > 0 && (
                    <ul className="isle-section-links">
                      {section.links.map((link, j) => (
                        <li key={j}>
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
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default IslePanel;
