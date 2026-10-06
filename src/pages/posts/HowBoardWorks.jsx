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

// Each supervisor assigned to their primary committee (first-listed below), purely for
// non-overlapping avatar layout in Section 2. True full rosters (used for highlighting
// in Section 3) live in COMMITTEE_DETAILS below.
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

// True committee rosters + jurisdiction, pulled from the Board's current committee
// schedule (effective 1/12/2026) and Rules of Order (effective 6/30/2026). Drives the
// Section 3 spotlight — independent of COMMITTEES' one-column-per-supervisor layout above.
const COMMITTEE_DETAILS = [
  {
    id: "budget-finance",
    fullName: "Budget & Finance Committee",
    meeting: "Wednesdays, 10:00 a.m., year-round",
    members: ["Chan", "Dorsey", "Sauter"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "gov-audit",
    fullName: "Government Audit & Oversight Committee",
    meeting: "1st & 3rd Thursday, 10:00 a.m.",
    members: ["Fielder", "Sauter", "Sherrill"],
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "land-use",
    fullName: "Land Use & Transportation Committee",
    meeting: "Mondays, 1:30 p.m.",
    members: ["Melgar", "Chen", "Mahmood"],
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "public-safety",
    fullName: "Public Safety and Neighborhood Services Committee",
    meeting: "2nd & 4th Thursday, 10:00 a.m.",
    members: ["Dorsey", "Mahmood", "Wong"],
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "rules",
    fullName: "Rules Committee",
    meeting: "Mondays, 10:00 a.m.",
    members: ["Walton", "Sherrill", "Mandelman"],
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    id: "budget-approps",
    fullName: "Budget & Appropriations Committee",
    meeting: "Wednesdays, 1:30 p.m., Feb. 1 – Aug. 1",
    members: ["Chan", "Dorsey", "Sauter", "Walton", "Mandelman"],
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
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
  const section3Ref = useRef(null);
  const [s1Progress, setS1Progress] = useState(0);
  const [s2Progress, setS2Progress] = useState(0);
  const [s3Progress, setS3Progress] = useState(0);

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
      setS3Progress(calcProgress(section3Ref.current));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section 1 derived values
  const s1Eased = easeInOut(s1Progress);
  const heroOpacity = Math.max(0, 1 - s1Progress / 0.3);
  const factBlurbOpacity = Math.max(0, Math.min(1, (s1Progress - 0.4) / 0.25));

  // Section 2 derived values
  // Header fades in, holds, then fades out before the committee labels (which share
  // the same on-screen position) fade in — so the two never compete for the same space.
  const s2HeaderOpacity = Math.max(0, Math.min(s2Progress / 0.2, (0.45 - s2Progress) / 0.15));
  const committeeLabelsOpacity = Math.max(0, Math.min(1, (s2Progress - 0.45) / 0.3));

  // Section 3 derived values
  const spotlightCount = COMMITTEE_DETAILS.length;
  const activeSpotlightIndex = Math.min(spotlightCount - 1, Math.floor(s3Progress * spotlightCount));
  const activeSpotlight = COMMITTEE_DETAILS[activeSpotlightIndex];

  return (
    <div className="how-board-works">

      {/* ── Section 1: Hero → 11 supervisors ── */}
      <div className="hbw-scrolly" ref={section1Ref}>
        <div className="hbw-sticky">
          <div className="hbw-hero-text" style={{ opacity: heroOpacity }}>
            <div className="hbw-title">
              San Francisco Board of Supervisors
            </div>

            <div className="hbw-overview">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>

          <div className="hbw-fact-blurb" style={{ opacity: factBlurbOpacity }}>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.</p>
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
                  <span className="hbw-avatar-district">D{sup.district}</span>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
                  <span className="hbw-avatar-district">D{sup.district}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 3: Spotlight one committee at a time ── */}
      <div className="hbw-scrolly hbw-scrolly--spotlight" ref={section3Ref}>
        <div className="hbw-sticky">

          <div className="hbw-committee-labels">
            {COMMITTEES.map((c) => {
              const isActive = c.members.some((m) => activeSpotlight.members.includes(m));
              return (
                <div
                  key={c.id}
                  className="hbw-committee-label"
                  style={{ left: `${c.x}%`, opacity: isActive ? 1 : 0.3 }}
                >
                  <div className="hbw-committee-name">{c.name}</div>
                  <div className="hbw-committee-meeting">{c.meeting}</div>
                </div>
              );
            })}
          </div>

          <div className="hbw-avatars hbw-avatars--spotlight">
            {SUPERVISORS.map((sup) => {
              const pos = getCommitteePosition(sup.lastName);
              const isActive = activeSpotlight.members.includes(sup.lastName);
              return (
                <div
                  key={sup.district}
                  className={`hbw-avatar${isActive ? " hbw-avatar--active" : ""}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <img src={sup.image} alt={sup.fullName} />
                  <span className="hbw-avatar-name">{sup.lastName}</span>
                  <span className="hbw-avatar-district">D{sup.district}</span>
                </div>
              );
            })}
          </div>

          <div className="hbw-s3-panel">
            <div className="hbw-s3-eyebrow">{activeSpotlightIndex + 1} / {spotlightCount}</div>
            <div className="hbw-s3-name">{activeSpotlight.fullName}</div>
            <div className="hbw-s3-meeting">{activeSpotlight.meeting}</div>
            <p className="hbw-s3-description">{activeSpotlight.description}</p>
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

          <div className="subtitle">Committees at a Glance</div>
          <ul className="hbw-committee-reference">
            {COMMITTEE_DETAILS.map((c) => (
              <li key={c.id}>
                <strong>{c.fullName}</strong> — {c.meeting}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowBoardWorks;
