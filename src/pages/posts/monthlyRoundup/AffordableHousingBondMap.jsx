import { useEffect, useMemo, useState } from "react";
import { useMap, MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BOND_PROJECTS } from "./affordableHousingBondData";

// No basemap tiles: the map is drawn entirely from local GeoJSON over a water-blue
// background, so there are no third-party tile requests, API keys, or usage limits.

// Colors follow the "Mapping Design" concept doc legend.
export const PROGRAM_COLORS = {
  "2016 PASS Bond": "#6f8f3a",
  "2019 Affordable Housing Bond": "#2f1f8f",
  "2024 Affordable Housing Bond": "#8a2347",
  "2024 Affordable Housing Opportunity Fund": "#2f88b5",
};

// Shorter on-map labels for long realtor-neighborhood names.
const LABEL_OVERRIDES = {
  "Financial District/Barbary Coast": "Financial District",
  "Van Ness/Civic Center": "Civic Center",
};

// Nudge labels (px) so they don't sit on top of the stars. Default: just below center.
const LABEL_OFFSETS = {
  "Western Addition": [-34, -14],
  "Van Ness/Civic Center": [34, -16],
  "Treasure Island": [0, 24],
  "Mission Dolores": [0, 20],
};
const DEFAULT_LABEL_OFFSET = [0, 16];

const NEIGHBORHOODS_URL = "/maps/sf_neighborhoods.geojson";
const STAR_SIZE = 20;

// Four-point star, 20px, dark outline with a thin white inner edge.
function makeStarIcon(color, offsetX = 0) {
  const s = STAR_SIZE;
  const c = s / 2;
  const pts = `${c},0 ${c + 3.2},${c - 3.2} ${s},${c} ${c + 3.2},${c + 3.2} ${c},${s} ${c - 3.2},${c + 3.2} 0,${c} ${c - 3.2},${c - 3.2}`;
  return L.divIcon({
    className: "ahb-star-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -1.5 ${s + 3} ${s + 3}" width="${s + 3}" height="${s + 3}">
      <polygon points="${pts}" fill="${color}" stroke="#1a1a1a" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="${pts}" fill="none" stroke="#fff" stroke-width="0.8" stroke-linejoin="round" transform="translate(${c} ${c}) scale(0.8) translate(${-c} ${-c})"/>
    </svg>`,
    iconSize: [s + 3, s + 3],
    iconAnchor: [(s + 3) / 2 - offsetX, (s + 3) / 2],
    popupAnchor: [offsetX, -(s / 2 + 2)],
  });
}

// Projects at (nearly) the same spot — e.g. 1939 Market, funded by two bonds —
// get spread horizontally so every star stays visible and clickable.
function withOffsets(projects) {
  const groups = {};
  projects.forEach((p) => {
    const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    (groups[key] = groups[key] || []).push(p);
  });
  const out = [];
  Object.values(groups).forEach((g) => {
    g.forEach((p, i) => out.push({ ...p, offsetX: (i - (g.length - 1) / 2) * (STAR_SIZE * 0.7) }));
  });
  return out;
}

// Bold the project name and highlight dollar amounts / unit counts, like the
// popup reference in the concept doc.
function renderBlurb(blurb, project) {
  const pattern = new RegExp(
    `(${project.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|\\$[\\d.,]+ million|\\d+ (?:affordable )?units)`,
    "g"
  );
  return blurb.split(pattern).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part === project) return <strong key={i} className="ahb-hl-name">{part}</strong>;
    return <strong key={i} className="ahb-hl-num">{part}</strong>;
  });
}

function ZoomControls() {
  const map = useMap();
  return (
    <div className="ahb-zoom-controls">
      <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
      <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
    </div>
  );
}

// Citywide framing matches the concept mockup (Mission → Treasure Island at zoom 13).
const CITYWIDE_CENTER = [37.788, -122.402];
const CITYWIDE_ZOOM = 13;

function FitToProjects({ projects, district }) {
  const map = useMap();
  useEffect(() => {
    if (!district) {
      map.setView(CITYWIDE_CENTER, CITYWIDE_ZOOM);
      return;
    }
    if (!projects.length) return;
    const bounds = L.latLngBounds(projects.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, projects, district]);
  return null;
}

/**
 * Affordable housing projects funded by SF's recent bond sales.
 *
 * Props:
 *  - district (number, optional): only show projects in this supervisor district
 *    and zoom to them. Use this on a supervisor's page.
 *  - height (number|string, optional): map height, default 460.
 *  - showLegend (bool, optional): default true.
 */
const AffordableHousingBondMap = ({ district = null, height = 520, showLegend = true }) => {
  const [neighborhoods, setNeighborhoods] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(NEIGHBORHOODS_URL)
      .then((r) => r.json())
      .then((data) => !cancelled && setNeighborhoods(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const projects = useMemo(
    () => withOffsets(district ? BOND_PROJECTS.filter((p) => p.district === Number(district)) : BOND_PROJECTS),
    [district]
  );

  const highlighted = useMemo(() => new Set(projects.map((p) => p.neighborhood)), [projects]);

  const programsShown = useMemo(
    () => Object.keys(PROGRAM_COLORS).filter((prog) => projects.some((p) => p.program === prog)),
    [projects]
  );

  const icons = useMemo(() => {
    const cache = {};
    projects.forEach((p) => {
      const key = `${p.program}|${p.offsetX}`;
      if (!cache[key]) cache[key] = makeStarIcon(PROGRAM_COLORS[p.program] || "#555", p.offsetX);
    });
    return cache;
  }, [projects]);

  const styleNeighborhood = (feature) =>
    highlighted.has(feature.properties.name)
      ? { color: "#7a5646", weight: 1.2, fillColor: "#d9b8a8", fillOpacity: 0.95 }
      : { color: "#9aa1a8", weight: 0.7, fillColor: "#e9ebed", fillOpacity: 0.9 };

  const onEachNeighborhood = (feature, layer) => {
    const name = feature.properties.name;
    if (highlighted.has(name)) {
      layer.bindTooltip(LABEL_OVERRIDES[name] || name, {
        permanent: true,
        direction: "center",
        offset: LABEL_OFFSETS[name] || DEFAULT_LABEL_OFFSET,
        className: "ahb-nbhd-label",
      });
    }
  };

  return (
    <div className="ahb-map-wrapper">
      <MapContainer
        center={CITYWIDE_CENTER}
        zoom={CITYWIDE_ZOOM}
        scrollWheelZoom={false}
        zoomControl={false}
        className="ahb-map"
        style={{ height }}
      >
        <ZoomControls />
        <FitToProjects projects={projects} district={district} />
        {neighborhoods && (
          <GeoJSON
            // re-mount when the highlighted set changes so styles + labels refresh
            key={[...highlighted].sort().join("|")}
            data={neighborhoods}
            style={styleNeighborhood}
            onEachFeature={onEachNeighborhood}
            interactive={false}
            attribution="Boundaries: SF realtor neighborhoods &amp; supervisor districts"
          />
        )}
        {projects.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icons[`${p.program}|${p.offsetX}`]}>
            <Popup className="ahb-popup" maxWidth={300}>
              <div className="ahb-popup-header">
                <span className="ahb-popup-swatch" style={{ background: PROGRAM_COLORS[p.program] }} />
                <span>{p.program}</span>
              </div>
              <div className="ahb-popup-title">{p.project}</div>
              <p className="ahb-popup-blurb">{renderBlurb(p.blurb, p.project)}</p>
              <div className="ahb-popup-meta">
                District {p.district} · {p.supervisor} · {p.neighborhood}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {showLegend && (
        <div className="ahb-legend">
          <div className="ahb-legend-title">Bond program</div>
          {programsShown.map((prog) => (
            <div key={prog} className="ahb-legend-item">
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <polygon
                  points="10,0 13.2,6.8 20,10 13.2,13.2 10,20 6.8,13.2 0,10 6.8,6.8"
                  fill={PROGRAM_COLORS[prog]}
                  stroke="#1a1a1a"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              {prog}
            </div>
          ))}
          <div className="ahb-legend-item">
            <span className="ahb-legend-nbhd" />
            Neighborhood with a bond-funded project
          </div>
        </div>
      )}
    </div>
  );
};

export default AffordableHousingBondMap;
