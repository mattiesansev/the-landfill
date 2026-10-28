import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

const findSupervisor = (lastName) => SUPERVISORS.find((s) => s.lastName === lastName);

// All six standing committees with their full rosters, pulled from the Board's
// current committee schedule (effective 1/12/2026) and Rules of Order (effective
// 6/30/2026). A supervisor serving on multiple committees appears once per
// committee, so each committee always shows its complete, real membership.
const COMMITTEES = [
  {
    id: "budget-finance",
    name: "Budget &\nFinance",
    fullName: "The Budget and Finance Committee",
    meeting: "Wednesdays, 10:00 a.m., year-round",
    members: ["Chan", "Dorsey", "Sauter"],
    description:
      "The Budget and Finance Committee handles legislation concerning bond issues, taxes, fees and other revenue measures, redevelopment, grants, and real estate. For example, in September 2026, the Budget and Finance Committee voted on a resolution that allows the city's Department of Public Works to accept and spend up to $1 million in state grant money for an upgraded recycled water irrigation system on Sunset Boulevard.",
  },
  {
    id: "gov-audit",
    name: "Gov. Audit &\nOversight",
    fullName: "Government Audit and Oversight Committee",
    meeting: "1st & 3rd Thursday, 10:00 a.m.",
    members: ["Fielder", "Sauter", "Sherrill"],
    description:
      "The Government Audit and Oversight Committee oversees audits and considers labor agreements, Civil Grand Jury Reports, and settlement of claims, litigation, and rewards. For example, the Government Audit and Oversight Committee voted on a resolution that authorizes city officials in the Film Commission to solicit donations from the San Francisco Travel Association and hotels to promote the city as a film and media destination. Since soliciting these kinds of donations is generally barred, the Government Audit and Oversight Committee must vote on it.",
  },
  {
    id: "land-use",
    name: "Land Use &\nTransportation",
    fullName: "The Land Use and Transportation Committee",
    meeting: "Mondays, 1:30 p.m.",
    members: ["Melgar", "Chen", "Mahmood"],
    description:
      "The Land Use and Transportation Committee handles a myriad of issues, including measures related to housing, land use, zoning, planning, rent control, transportation, the MTA, economic development, resident employment, workforce training and placement, homelessness and the environment. In 2026, this committee has approved countless Landmark Designations.",
  },
  {
    id: "public-safety",
    name: "Public Safety &\nNeighborhood Svcs.",
    fullName: "Public Safety and Neighborhood Services Committee",
    meeting: "2nd & 4th Thursday, 10:00 a.m.",
    members: ["Dorsey", "Mahmood", "Wong"],
    description:
      "The Public Safety and Neighborhood Services Committee handles measures related to public works, infrastructure, traffic and parking control, parks and recreation, utilities, public protections, delinquency prevention, public health, emergency services, seniors, the disabled, children and their families, as well as measures related to the City's coordination, strategies, policies, programs, and budgetary actions surrounding public safety. For example, the committee has held hearings related to citywide drug market conditions as well as voted on increasing the city's number of speed cameras.",
  },
  {
    id: "rules",
    name: "Rules\nCommittee",
    fullName: "Rules Committee",
    meeting: "Mondays, 10:00 a.m.",
    members: ["Walton", "Sherrill", "Mandelman"],
    description:
      "The Rules Committee handles measures related to appointments, ballot measures (excluding those which will be heard by the Budget and Finance Committee), Charter amendments, amendments to the Administrative Code, and Board Rules of Order. In plain terms, the Rules Committee handles decisions about governance and structure in the city. For example, the committee voted to nominate a new Controller, Greg Wagner, to the Public Works Commission.",
  },
  {
    id: "budget-approps",
    name: "Budget &\nApprops.",
    fullName: "The Budget and Appropriations Committee",
    meeting: "Wednesdays, 1:30 p.m., Feb. 1 – Aug. 1",
    members: ["Chan", "Dorsey", "Sauter", "Walton", "Mandelman"],
    description:
      "The Budget and Appropriations Committee is a temporary committee that convenes between February and August each year. Unlike other committees which contain 3 members, the Budget and Appropriations committee consists of 5 members, 3 of which come from the Budget and Finance Committee. Each year, this committee considers the Mayor's proposed budget, and invites robust public participation as they construct the annual appropriations ordinance. Past ordinances can be found on sf.gov.",
  },
];

// One slot per committee membership (not per supervisor) — a supervisor on multiple
// committees gets one slot per committee, so every committee shows its full roster.
const COMMITTEE_SLOTS = COMMITTEES.flatMap((committee, committeeIndex) =>
  committee.members.map((lastName, memberIndex) => ({
    key: `${committee.id}-${lastName}`,
    committeeIndex,
    memberIndex,
    columnSize: committee.members.length,
    supervisor: findSupervisor(lastName),
  }))
);

// The first slot for each supervisor. Their other slots stack on top of it in the
// full-Board group, so those duplicates hide their names there.
const PRIMARY_SLOT_KEYS = new Set(
  SUPERVISORS.map((sup) => COMMITTEE_SLOTS.find((s) => s.supervisor === sup)?.key)
);

const MOBILE_BREAKPOINT = 770;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// ── Stage layouts ──
// The animated sections pin a "stage" that holds nothing but photos and committee
// labels, so text can never collide with them. Layouts are computed in pixels from
// the stage's measured size; every coordinate is the center of a photo.

const NAME_LINE = 26;        // photo-to-name gap + one 15px label line
const ROW_LABEL_H = 28;      // one-line committee name above each row (mobile)
const ROW_GAP = 16;
const SPLIT_OFFSET = 44;     // half-distance between Budget & Approps' two sub-columns

// Desktop: committees side by side as columns. Mobile: committees stacked as rows,
// members running horizontally beneath each committee name.
const getCommitteeLayout = (width, height, isMobile) => {
  if (isMobile) {
    const maxMembers = Math.max(...COMMITTEES.map((c) => c.members.length));
    const rows = COMMITTEES.length;
    const size = Math.max(28, Math.min(
      52,
      (height - (rows - 1) * ROW_GAP) / rows - ROW_LABEL_H,
      (width - (maxMembers - 1) * 10) / maxMembers,
    ));
    const rowH = ROW_LABEL_H + size;
    const top = Math.max(0, (height - rows * rowH - (rows - 1) * ROW_GAP) / 2);
    const rowTop = (i) => top + i * (rowH + ROW_GAP);
    return {
      size,
      showNames: false,
      label: (i) => ({ x: 0, y: rowTop(i) }),
      slot: (s) => ({
        x: size / 2 + s.memberIndex * (size + 10),
        y: rowTop(s.committeeIndex) + ROW_LABEL_H + size / 2,
      }),
    };
  }

  const colW = width / COMMITTEES.length;
  // Accent bar + committee name, which wraps to as many as four lines in narrow columns.
  const labelH = colW < 130 ? 100 : 80;
  // Names only fit under the photos once Budget & Approps' two sub-columns have room
  // for side-by-side names without spilling into the Rules column.
  const showNames = colW >= 166;
  const stepExtra = showNames ? NAME_LINE + 14 : 12;
  const size = Math.max(32, Math.min(
    72,
    (height - labelH - 16) / 3 - stepExtra,
    showNames ? 72 : (colW - 16) / 2,
  ));
  const step = size + stepExtra;
  const top = Math.max(0, (height - labelH - 16 - 3 * step + stepExtra) / 2);
  const splitOffset = showNames ? SPLIT_OFFSET : size / 2 + 4;
  return {
    size,
    showNames,
    label: (i) => ({ x: colW * (i + 0.5), y: top }),
    slot: (s) => {
      let row = s.memberIndex;
      let dx = 0;
      // A committee with more than 3 members (Budget & Approps, with 5) splits
      // into a "3 + 2" pair of sub-columns rather than one tall column of 5.
      if (s.columnSize > 3) {
        const leftCount = Math.ceil(s.columnSize / 2);
        const isLeft = s.memberIndex < leftCount;
        row = isLeft ? s.memberIndex : s.memberIndex - leftCount;
        dx = isLeft ? -splitOffset : splitOffset;
      }
      return {
        x: colW * (s.committeeIndex + 0.5) + dx,
        y: top + labelH + 16 + size / 2 + row * step,
      };
    },
  };
};

// The full Board as one centered group: 6 + 5 on desktop, 4 + 4 + 3 on mobile.
const getClusterPosition = (index, width, height, isMobile, size, showNames) => {
  const perRow = isMobile ? 4 : 6;
  const rowCount = Math.ceil(SUPERVISORS.length / perRow);
  const row = Math.floor(index / perRow);
  const col = index % perRow;
  const inRow = Math.min(perRow, SUPERVISORS.length - row * perRow);
  const spacing = Math.min(width / perRow, showNames ? Math.max(size + 28, 100) : size + 16);
  const rowStep = size + (showNames ? NAME_LINE + 24 : 16);
  return {
    x: width / 2 + (col - (inRow - 1) / 2) * spacing,
    y: height / 2 + (row - (rowCount - 1) / 2) * rowStep,
  };
};

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

// 0 when the section's sticky stage first pins, 1 when it's about to unpin.
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      const sticky = el?.firstElementChild;
      if (!el || !sticky) return;
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const scrollable = el.offsetHeight - sticky.offsetHeight;
      if (scrollable <= 0) return;
      setProgress(clamp01((stickyTop - el.getBoundingClientRect().top) / scrollable));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);
  return progress;
}

const Avatar = ({ sup, showName = true, showDistrict = true, hidden = false, labelOpacity, className = "", style }) => (
  <div className={`hbw-avatar ${className}`} style={style} aria-hidden={hidden || undefined}>
    <img src={sup.image} alt={hidden ? "" : sup.fullName} title={showName ? undefined : sup.fullName} />
    {showName && (
      <div className="hbw-avatar-label" style={labelOpacity === undefined ? undefined : { opacity: labelOpacity }}>
        <span className="hbw-avatar-name">{sup.lastName}</span>
        {showDistrict && <span className="hbw-avatar-district">District {sup.district}</span>}
      </div>
    )}
  </div>
);

const BoardGrid = ({ className = "" }) => (
  <div className={`hbw-board-grid ${className}`}>
    {SUPERVISORS.map((sup) => (
      <Avatar key={sup.district} sup={sup} />
    ))}
  </div>
);

// A pinned stage that animates photos from the full-Board group into the
// committee layout.
const CommitteeStage = ({ isMobile }) => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const { width, height } = useElementSize(stageRef);
  const ready = width > 0 && height > 0;

  const layout = ready ? getCommitteeLayout(width, height, isMobile) : null;
  const labelsOpacity = clamp01((progress - 0.45) / 0.3);

  return (
    <div className="hbw-scrolly" ref={sectionRef}>
      <div className="hbw-sticky">
        <div
          className={`hbw-stage${isMobile ? " hbw-stage--rows" : ""}`}
          ref={stageRef}
          style={layout ? { "--hbw-size": `${layout.size}px` } : undefined}
          aria-hidden="true"
        >
          {ready && (
            <>
              {COMMITTEES.map((c, i) => {
                const pos = layout.label(i);
                return (
                  <div
                    key={c.id}
                    className="hbw-stage-label"
                    style={{ left: pos.x, top: pos.y, opacity: labelsOpacity }}
                  >
                    {isMobile ? c.name.replace(/\n/g, " ") : c.name}
                  </div>
                );
              })}

              {/* A supervisor on multiple committees renders one photo per committee,
                  all stacked in the same group spot and splitting apart as they
                  travel to their different committees. */}
              {COMMITTEE_SLOTS.map((slot, i) => {
                const sup = slot.supervisor;
                const group = getClusterPosition(
                  sup.district - 1, width, height, isMobile, layout.size, layout.showNames
                );
                const committee = layout.slot(slot);
                // Stagger each photo's start slightly so the group peels apart
                // rather than moving as one block.
                const itemStart = (i / (COMMITTEE_SLOTS.length - 1)) * 0.25;
                const t = easeInOut(clamp01((progress - itemStart) / 0.65));
                return (
                  <Avatar
                    key={slot.key}
                    sup={sup}
                    hidden
                    showName={layout.showNames}
                    showDistrict={false}
                    labelOpacity={PRIMARY_SLOT_KEYS.has(slot.key) ? 1 : t}
                    style={{ left: lerp(group.x, committee.x, t), top: lerp(group.y, committee.y, t) }}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const HowBoardWorks = () => {
  const isMobile = useIsMobile();

  return (
    <div className="how-board-works">

      {/* ── The full Board ── */}
      <section className="hbw-section">
        <div className="hbw-column">
          <h1 className="hbw-title">SF Board of Supervisors</h1>
          <AuthorFooter
            authorImageUrl={authors["mattie"]["photo"]}
            postDate="April 19, 2026"
            authorName={authors["mattie"]["name"]}
          />
          <p className="hbw-body">
            The Board of Supervisors is the legislative branch of the City and County of San
            Francisco. The Board is made up of eleven members, with each member representing
            one of San Francisco's municipal districts. Supervisors serve a maximum of two
            four year terms, with half of the city's supervisors going up for election at a time.
          </p>
        </div>
        <BoardGrid />
      </section>

      {/* ── Committees form ── */}
      <section className="hbw-section hbw-section--before-stage">
        <div className="hbw-column">
          <h2 className="hbw-heading">Legislation starts in committee</h2>
          <p className="hbw-body">
            Before facing a final vote by the board, most proposed legislation is assigned to a
            committee. Three board members are selected by the Board of Supervisors President to
            staff each committee, with the exception of the temporary Budget & Appropriations
            Committee, which has five members.
          </p>
        </div>
      </section>
      <CommitteeStage isMobile={isMobile} />

      <section className="hbw-section">
        <div className="hbw-column">
          <p className="hbw-body">
            Committees play a crucial role in San Francisco's legislative process, and it can be
            an important place for the public's voice to be heard. Committees hold public
            hearings for legislation, where city departments, city staff, and private companies
            may testify on an issue. Once the hearing continues, San Francisco civilians are
            encouraged to testify. If legislation goes through a public hearing in committee,
            there will not be another public hearing opportunity with the full Board.
          </p>
          <p className="hbw-body">
            Take a deeper look at each committee and its members.
          </p>
        </div>
      </section>

      {/* ── One committee at a time ── */}
      <section className="hbw-section hbw-section--committees">
        <div className="hbw-column">
          {COMMITTEES.map((c) => (
            <article key={c.id} className="hbw-committee">
              <div className="hbw-committee-members">
                {c.members.map((lastName) => (
                  <Avatar key={lastName} sup={findSupervisor(lastName)} />
                ))}
              </div>
              <h3 className="hbw-subheading">{c.fullName}</h3>
              <div className="hbw-meta">Meets {c.meeting}</div>
              <p className="hbw-body">{c.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Back to the full Board for a vote ── */}
      <section className="hbw-section hbw-section--divided">
        <BoardGrid className="hbw-board-grid--leading" />
        <div className="hbw-column">
          <h2 className="hbw-heading">The Board introduces legislation into San Francisco</h2>
          <p className="hbw-body">
            After committee approval, legislation will move onto the full Board for a vote. In
            most cases, if at least 6 board members approve the legislation, it will pass, and
            move to the Mayor's desk. The Mayor has the opportunity to approve or veto the
            legislation. But, even a veto can be overridden by the Board of Supervisors if 7
            members vote to override the veto.
          </p>
          <p className="hbw-body">
            Supervisors directly impact legislation in San Francisco. Learn more about the board
            and the supervisor that represents your district at{" "}
            <a href="https://www.sf.gov/departments--board-supervisors" target="_blank" rel="noreferrer">
              https://www.sf.gov/departments--board-supervisors
            </a>, or in our{" "}
            <Link to="/post/monthly-roundup">monthly roundups</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HowBoardWorks;
