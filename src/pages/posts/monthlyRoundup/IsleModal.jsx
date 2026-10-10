import React, { useEffect, lazy, Suspense } from "react";

const LandmarkMap = lazy(() => import("./LandmarkMap"));
const LandmarkMapJuly2026 = lazy(() => import("./LandmarkMapJuly2026"));
const HousingTrustFundMap = lazy(() => import("./HousingTrustFundMap"));

function renderInlineLinks(text) {
  const tokenRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  if (!tokenRegex.test(text)) return text;
  tokenRegex.lastIndex = 0;
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[3] !== undefined) {
      parts.push(<strong key={i++}>{match[3]}</strong>);
    } else {
      parts.push(<a key={i++} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

const IsleModal = ({ isle, onClose }) => {
  useEffect(() => {
    if (!isle) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isle, onClose]);

  // Datawrapper embeds post their rendered height; resize the matching iframe.
  useEffect(() => {
    const handler = (e) => {
      const heights = e.data && e.data["datawrapper-height"];
      if (!heights) return;
      document.querySelectorAll(".isle-datawrapper iframe").forEach((iframe) => {
        if (iframe.contentWindow === e.source) {
          const h = Object.values(heights)[0];
          if (h) iframe.style.height = `${h}px`;
        }
      });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
              {section.title && <div className="isle-modal-section-title">{section.title}</div>}
              {section.body && section.body.split("\n\n").map((para, k) => (
                <p key={k}>{renderInlineLinks(para)}</p>
              ))}
              {section.list && section.list.length > 0 && (
                <ol className="isle-section-list">
                  {section.list.map((item, j) => <li key={j}>{item}</li>)}
                </ol>
              )}
              {section.body_after && section.body_after.split("\n\n").map((para, k) => (
                <p key={k}>{renderInlineLinks(para)}</p>
              ))}
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
                <picture>
                  {section.image_mobile && (
                    <source media="(max-width: 600px)" srcSet={section.image_mobile} />
                  )}
                  <img src={section.image} alt="" className="isle-section-image" />
                </picture>
              )}
              {section.datawrapper && (
                <div className="isle-datawrapper">
                  <iframe
                    title={section.datawrapper.title}
                    aria-label={section.datawrapper.title}
                    id={`datawrapper-chart-${section.datawrapper.id}`}
                    src={section.datawrapper.src}
                    scrolling="no"
                    frameBorder="0"
                    style={{ width: 0, minWidth: "100%", border: "none" }}
                    height={section.datawrapper.height}
                    data-external="1"
                  />
                </div>
              )}
              {section.landmarks_map && (
                <Suspense fallback={<div className="landmark-map-loading">Loading map…</div>}>
                  <LandmarkMap />
                </Suspense>
              )}
              {section.landmarks_map_july_2026 && (
                <Suspense fallback={<div className="landmark-map-loading">Loading map…</div>}>
                  <LandmarkMapJuly2026 />
                </Suspense>
              )}
              {section.housing_map && (
                <Suspense fallback={<div className="landmark-map-loading">Loading map…</div>}>
                  <HousingTrustFundMap />
                </Suspense>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default IsleModal;
