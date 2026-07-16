import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SITES = [
  { project: "1411 Florida Street", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$299,000", units: "7", ami: "80% - 120%", lat: 37.74922, lng: -122.40954 },
  { project: "Potrero Terrace HOPE SF Development Planning", area: "HOPE SF", district: "10", supervisor: "Shamann Walton", contribution: "$732,670", units: "", ami: "", lat: 37.7538, lng: -122.39577 },
  { project: "Plaza East RAD Emergency Repairs", area: "Rental Assistance Demonstration", district: "5", supervisor: "Bilal Mahmood", contribution: "$1,822,203", units: "", ami: "", lat: 37.78153, lng: -122.42814 },
  { project: "1515 South Van Ness", area: "Construction", district: "5", supervisor: "Bilal Mahmood", contribution: "$880,091", units: "167", ami: "", lat: 37.7489, lng: -122.41545 },
  { project: "19-23 Precita", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$267,469", units: "3", ami: "80%", lat: 37.74688, lng: -122.41847 },
  { project: "1939 Market Street", area: "Construction", district: "8", supervisor: "Rafael Mandelman", contribution: "$1,644,542", units: "185", ami: "", lat: 37.76996, lng: -122.42532 },
  { project: "2060 Folsom Street", area: "Construction", district: "9", supervisor: "Jackie Fielder", contribution: "$499,999", units: "127", ami: "Up to 60%", lat: 37.76427, lng: -122.41548 },
  { project: "South Park Scattered Sites", area: "Preservation", district: "6", supervisor: "Matt Dorsey", contribution: "", units: "107", ami: "20% - 80%", lat: 37.78226, lng: -122.39364 },
  { project: "2698 California", area: "Rental Assistance Demonstration", district: "2", supervisor: "Stephen Sherrill", contribution: "$1,247,704", units: "39", ami: "50%", lat: 37.78852, lng: -122.43857 },
  { project: "289 9th Ave", area: "Preservation", district: "1", supervisor: "Connie Chan", contribution: "$800,027", units: "16", ami: "50% - 80%", lat: 37.78303, lng: -122.46786 },
  { project: "305 San Carlos", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$333,000", units: "12", ami: "80%", lat: 37.75842, lng: -122.41969 },
  { project: "3138 Kamille Street", area: "Rental Assistance Demonstration", district: "9", supervisor: "Jackie Fielder", contribution: "$1,906,376", units: "159", ami: "50%", lat: 37.749, lng: -122.41227 },
  { project: "3182-3198 24th", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$698,160", units: "8", ami: "80%", lat: 37.7525, lng: -122.416 },
  { project: "3280 17th Street", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$2,748,075", units: "11", ami: "80%", lat: 37.76368, lng: -122.4193 },
  { project: "4101 Noriega", area: "Preservation", district: "4", supervisor: "Alan Wong", contribution: "$2,498,926", units: "8", ami: "50%", lat: 37.75263, lng: -122.50776 },
  { project: "455 Fell Street", area: "Construction", district: "5", supervisor: "Bilal Mahmood", contribution: "$1,731,481", units: "108", ami: "Up to 60%", lat: 37.77548, lng: -122.42536 },
  { project: "4830 Mission Street", area: "Preservation", district: "11", supervisor: "Chyanne Chen", contribution: "$8,495,590", units: "21", ami: "80%", lat: 37.72085, lng: -122.43805 },
  { project: "520 Schrader", area: "Preservation", district: "5", supervisor: "Bilal Mahmood", contribution: "$1,067,113", units: "7", ami: "80%", lat: 37.76994, lng: -122.4517 },
  { project: "555 Larkin Street", area: "Construction", district: "5", supervisor: "Bilal Mahmood", contribution: "$3,699,641", units: "80", ami: "30% - 80%", lat: 37.78272, lng: -122.4176 },
  { project: "60 28th", area: "Preservation", district: "8", supervisor: "Rafael Mandelman", contribution: "$232,000", units: "6", ami: "80%", lat: 37.74569, lng: -122.42345 },
  { project: "654-658 Capp", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$800,000", units: "7", ami: "80%", lat: 37.75619, lng: -122.41797 },
  { project: "65-69 Woodward", area: "Preservation", district: "9", supervisor: "Jackie Fielder", contribution: "$307,000", units: "6", ami: "80%", lat: 37.76889, lng: -122.4207 },
  { project: "Plaza East RAD", area: "Rental Assistance Demonstration", district: "5", supervisor: "Bilal Mahmood", contribution: "$1,941,615", units: "100", ami: "50%", lat: 37.78143, lng: -122.42813 },
  { project: "Hayes Valley North RAD", area: "Rental Assistance Demonstration", district: "5", supervisor: "Bilal Mahmood", contribution: "$17,919,068", units: "83", ami: "50% - 60%", lat: 37.77571, lng: -122.42876 },
  { project: "772 Pacific Ave", area: "Construction", district: "3", supervisor: "Danny Sauter", contribution: "$118,692", units: "", ami: "", lat: 37.79701, lng: -122.40801 },
  { project: "777 Broadway", area: "Preservation", district: "3", supervisor: "Danny Sauter", contribution: "$800,000", units: "30", ami: "80%", lat: 37.7972, lng: -122.4091 },
  { project: "937 Clay", area: "Preservation", district: "3", supervisor: "Danny Sauter", contribution: "$2,587,684", units: "73", ami: "80%", lat: 37.79379, lng: -122.40853 },
  { project: "964 Oak Street", area: "Preservation", district: "5", supervisor: "Bilal Mahmood", contribution: "$110,902", units: "10", ami: "80%", lat: 37.77362, lng: -122.4352 },
  { project: "Sunnydale HOPE SF - Phase 1A-3-Infrastructure", area: "HOPE SF", district: "10", supervisor: "Shamann Walton", contribution: "$614,749", units: "", ami: "", lat: 37.71206, lng: -122.42025 },
];

const AREA_COLORS = {
  "Construction": "#4a9c6d",
  "Preservation": "#8ac4d4",
  "HOPE SF": "#e09a3b",
  "Rental Assistance Demonstration": "#9b7fd4",
};

const AREA_LABELS = {
  "Construction": "Construction",
  "Preservation": "Preservation",
  "HOPE SF": "HOPE SF",
  "Rental Assistance Demonstration": "RAD",
};

function makeIcon(color) {
  return L.divIcon({
    className: "htf-map-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
      <circle cx="8" cy="8" r="7" fill="${color}" stroke="#fff" stroke-width="2"/>
    </svg>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

const ICONS = Object.fromEntries(
  Object.entries(AREA_COLORS).map(([area, color]) => [area, makeIcon(color)])
);

function ZoomControls() {
  const map = useMap();
  return (
    <div className="landmark-zoom-controls">
      <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
      <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
    </div>
  );
}

const CENTER = [37.762, -122.432];

const HousingTrustFundMap = () => {
  return (
    <div className="landmark-map-wrapper">
      <MapContainer
        center={CENTER}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        className="landmark-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControls />
        {SITES.map((site, i) => (
          <Marker key={i} position={[site.lat, site.lng]} icon={ICONS[site.area] || ICONS["Preservation"]}>
            <Popup className="landmark-popup htf-popup">
              <strong>{site.project}</strong>
              <dl className="htf-popup-list">
                <div><dt>Program</dt><dd>{AREA_LABELS[site.area] || site.area}</dd></div>
                <div><dt>District</dt><dd>D{site.district} ({site.supervisor})</dd></div>
                {site.contribution && <div><dt>HTF Contribution</dt><dd>{site.contribution}</dd></div>}
                {site.units && <div><dt>Units</dt><dd>{site.units}</dd></div>}
                {site.ami && <div><dt>AMI Served</dt><dd>{site.ami}</dd></div>}
              </dl>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="htf-map-legend">
        {Object.entries(AREA_LABELS).map(([area, label]) => (
          <div key={area} className="htf-legend-item">
            <span className="htf-legend-swatch" style={{ background: AREA_COLORS[area] }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousingTrustFundMap;
