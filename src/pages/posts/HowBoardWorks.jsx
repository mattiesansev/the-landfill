import React, { useState, useEffect, useRef } from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";

const SUPERVISORS = [
  { district: 1,  lastName: "Chan",      fullName: "Connie Chan",       image: "/img/supervisors/connie_chan.png" },
  { district: 2,  lastName: "Sherrill",  fullName: "Stephen Sherrill",  image: "/img/supervisors/D02-Stephen_Sherrill_2025_roster.png" },
  { district: 3,  lastName: "Sauter",    fullName: "Danny Sauter",      image: "/img/supervisors/D03-Danny_Sauter_2025_roster.png" },
  { district: 4,  lastName: "Wong",      fullName: "Alan Wong",         image: "/img/supervisors/D04-Alan_Wong_2025_roster.png" },
  { district: 5,  lastName: "Mahmood",   fullName: "Bilal Mahmood",     image: "/img/supervisors/D05-Bilal_Mahmood_2025_roster.png" },
  { district: 6,  lastName: "Dorsey",    fullName: "Matt Dorsey",       image: "/img/supervisors/matt_dorsey_roster92622.png" },
  { district: 7,  lastName: "Melgar",    fullName: "Myrna Melgar",      image: "/img/supervisors/D07-Myrna_Melgar_2025_roster.png" },
  { district: 8,  lastName: "Mandelman", fullName: "Rafael Mandelman",  image: "/img/supervisors/D08-Rafael_Mandelman_2025_roster.png" },
  { district: 9,  lastName: "Fielder",   fullName: "Jackie Fielder",    image: "/img/supervisors/D09-Jackie-Fielder_2025_roster.png" },
  { district: 10, lastName: "Walton",    fullName: "Shamann Walton",    image: "/img/supervisors/D10-Shamann_Walton_2025_roster.png" },
  { district: 11, lastName: "Chen",      fullName: "Chyanne Chen",      image: "/img/supervisors/D11-Chyanne_Chen_2025_roster.png" },
];

// Each supervisor assigned to their primary committee (first-listed in the PDF).
// Budget & Appropriations is a seasonal superset and is explained in the article body.
const COMMITTEES = [
  {
    id: "budget-finance",
    name: "Budget &\nFinance",
    fullName: "Budget & Finance Committee",
    meeting: "Every Wednesday, 10:00 a.m.",
    members: ["Chan", "Dorsey", "Sauter"],
    x: 10,
  },
  {
    id: "gov-audit",
    name: "Gov. Audit &\nOversight",
    fullName: "Government Audit & Oversight Committee",
    meeting: "1st & 3rd Thursday, 10:00 a.m.",
    members: ["Fielder", "Sherrill"],
    x: 28,
  },
  {
    id: "land-use",
    name: "Land Use &\nTransportation",
    fullName: "Land Use & Transportation Committee",
    meeting: "Every Monday, 1:30 p.m.",
    members: ["Melgar", "Chen", "Mahmood"],
    x: 50,
  },
  {
    id: "public-safety",
    name: "Public Safety &\nNeighborhood Svcs.",
    fullName: "Public Safety & Neighborhood Services Committee",
    meeting: "2nd & 4th Thursday, 10:00 a.m.",
    members: ["Wong"],
    x: 72,
  },
  {
    id: "rules",
    name: "Rules\nCommittee",
    fullName: "Rules Committee",
    meeting: "Every Monday, 10:00 a.m.",
    members: ["Walton", "Mandelman"],
    x: 90,
  },
];

const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Section 1: two-row cluster (6 top, 5 bottom)
const getClusterPosition = (index) => {
  if (index < 6) {
    return { x: (index + 0.5) / 6 * 76 + 12, y: 46 };
  }
  const col = index - 6;
  return { x: (col + 1) / 6 * 76 + 12, y: 66 };
};

// Shared: bottom row (section 1 end = section 2 start)
const getBottomRowPosition = (index) => ({
  x: (index + 0.5) / 11 * 86 + 7,
  y: 84,
});

// Section 2: committee group positions
const getCommitteePosition = (lastName) => {
  for (let ci = 0; ci < COMMITTEES.length; ci++) {
    const memberIdx = COMMITTEES[ci].members.indexOf(lastName);
    if (memberIdx !== -1) {
      return { x: COMMITTEES[ci].x, y: 42 + memberIdx * 18 };
    }
  }
  return { x: 50, y: 50 };
};

const HowBoardWorks = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const [s1Progress, setS1Progress] = useState(0);
  const [s2Progress, setS2Progress] = useState(0);

  useEffect(() => {
    const calcProgress = (el) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    };
    const handleScroll = () => {
      setS1Progress(calcProgress(section1Ref.current));
      setS2Progress(calcProgress(section2Ref.current));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section 1 derived values
  const s1Eased = easeInOut(s1Progress);
  const titleOpacity = Math.max(0, 1 - s1Progress / 0.35);
  const overviewOpacity = Math.max(0, Math.min(1, (s1Progress - 0.48) / 0.25));

  // Section 2 derived values
  const s2HeaderOpacity = Math.min(1, s2Progress / 0.2); // fade in quickly at start
  const committeeLabelsOpacity = Math.max(0, Math.min(1, (s2Progress - 0.45) / 0.3));

  return (
    <div className="how-board-works">

      {/* ── Section 1: Hero title → Overview ── */}
      <div className="hbw-scrolly" ref={section1Ref}>
        <div className="hbw-sticky">
          <div className="hbw-title" style={{ opacity: titleOpacity }}>
            How the Board of Supervisors Functions in San Francisco
          </div>

          <div className="hbw-overview" style={{ opacity: overviewOpacity }}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

          <div className="hbw-avatars">
            {SUPERVISORS.map((sup, i) => {
              const start = getClusterPosition(i);
              const end = getBottomRowPosition(i);
              return (
                <div
                  key={sup.district}
                  className="hbw-avatar"
                  style={{
                    left: `${lerp(start.x, end.x, s1Eased)}%`,
                    top:  `${lerp(start.y, end.y, s1Eased)}%`,
                  }}
                >
                  <img src={sup.image} alt={sup.fullName} />
                  <span className="hbw-avatar-name">{sup.lastName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 2: Committees ── */}
      <div className="hbw-scrolly" ref={section2Ref}>
        <div className="hbw-sticky">

          {/* Intro text */}
          <div className="hbw-s2-header" style={{ opacity: s2HeaderOpacity }}>
            <div className="hbw-s2-title">Legislation starts in committee</div>
            <p className="hbw-s2-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Before a bill reaches
              the full board for a vote, it must first pass through one of the Board's six
              standing committees, where supervisors conduct hearings, gather public input,
              and propose amendments.
            </p>
          </div>

          {/* Committee column labels — fade in as avatars arrive */}
          <div className="hbw-committee-labels" style={{ opacity: committeeLabelsOpacity }}>
            {COMMITTEES.map((c) => (
              <div key={c.id} className="hbw-committee-label" style={{ left: `${c.x}%` }}>
                <div className="hbw-committee-name">{c.name}</div>
                <div className="hbw-committee-meeting">{c.meeting}</div>
              </div>
            ))}
          </div>

          {/* Avatars: animate from bottom row → committee groups */}
          <div className="hbw-avatars">
            {SUPERVISORS.map((sup, i) => {
              // slight stagger so they don't all move at once
              const stagger = i * 0.015;
              const adj = Math.max(0, Math.min(1, (s2Progress - stagger) / (1 - stagger * SUPERVISORS.length * 0.5)));
              const eased = easeInOut(adj);
              const start = getBottomRowPosition(i);
              const end = getCommitteePosition(sup.lastName);
              return (
                <div
                  key={sup.district}
                  className="hbw-avatar"
                  style={{
                    left: `${lerp(start.x, end.x, eased)}%`,
                    top:  `${lerp(start.y, end.y, eased)}%`,
                  }}
                >
                  <img src={sup.image} alt={sup.fullName} />
                  <span className="hbw-avatar-name">{sup.lastName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <div className="single">
        <div className="content">
          <AuthorFooter
            authorImageUrl={authors["mattie"]["photo"]}
            postDate="April 19, 2026"
            authorName={authors["mattie"]["name"]}
          />

          <div className="subtitle">What is the Board of Supervisors?</div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate.
          </p>

          <div className="subtitle">How Committees Work</div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur
            sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.
          </p>

          <div className="subtitle">The Budget & Appropriations Committee</div>
          <p>
            In addition to the five standing committees above, a sixth committee — the Budget
            &amp; Appropriations Committee — convenes seasonally between February and August
            each year. It is a five-member panel comprised of Supervisors Chan, Dorsey, Sauter,
            Walton, and Mandelman, and oversees the city's annual budget process before it
            comes to the full Board for a vote.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowBoardWorks;
