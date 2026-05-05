import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LANDMARKS = [
  { name: "Bob Ross House", address: "4200 20th Street", description: "Significant as the home of Bay Area Reporter and Tavern Guild co-founder Bob Ross.", lat: 37.75508, lng: -122.42981 },
  { name: "Sha'ar Zahav (Historic Location)", address: "220 Danvers Street", description: "Significant as the first gay synagogue in San Francisco.", lat: 37.7581, lng: -122.44018 },
  { name: "American Indian Historical Society / Chautauqua House", address: "1451 Masonic Avenue", description: "Significant for its association with the 1960s Red Power movement, as well as the Costo family who played prominent roles in American Indian Civil Rights advocacy.", lat: 37.76668, lng: -122.44482 },
  { name: "Bank of Italy Branch Building", address: "400–410 Castro Street", description: "Significant for its association with commercial development of the Eureka Valley neighborhood, now commonly known as the Castro, and as a good example of Beaux Arts architecture.", lat: 37.76006, lng: -122.4317 },
  { name: "Castro Rock Steam Baths", address: "578–582 Castro Street", description: "Significant for its early association with the Castro as an LGBTQ enclave and as an important social center for gay men in the 1970s.", lat: 37.75721, lng: -122.43058 },
  { name: "Engine Company No. 13", address: "1458 Valencia Street", description: "Significant as the oldest standing firehouse in San Francisco, for its association with streetcar suburbanization of the Mission District, and as an intact example of Italianate architecture.", lat: 37.74359, lng: -122.40944 },
  { name: "Firehouse: Hose Company #30", address: "1757 Waller Street", description: "Significant as one of San Francisco's earliest extant firehouses, for its association with Haight Ashbury's early history, as well as an intact example of Italianate architecture.", lat: 37.7694, lng: -122.4547 },
  { name: "Full Moon Coffeehouse", address: "4416 18th Street", description: "Significant for its early association with the Castro as an LGBTQ enclave, as an early lesbian social space, and as San Francisco's first explicitly women-only establishment.", lat: 37.7591, lng: -122.4353 },
  { name: "Geilfuss on Guerrero", address: "102 Guerrero Street", description: "Significant as a front-line survivor of the Great 1906 Earthquake and Fire, an intact example of a Stick/Eastlake home, and an early example of the work of architect Henry Geilfuss.", lat: 37.76658, lng: -122.42117 },
  { name: "Maud's", address: "925–941 Cole Street", description: "Significant for its early association with San Francisco's lesbian community, including prominent LGBTQ businesswoman and activist Rikki Streicher.", lat: 37.76593, lng: -122.45073 },
  { name: "Mission Folk Victorian Home", address: "361 San Jose Avenue", description: "Significant for its association with early settlement of San Francisco's Mission District, as well as being an early and intact example of Folk Victorian architecture.", lat: 37.74355, lng: -122.40992 },
  { name: "SF AIDS Foundation", address: "514–520 Castro Street", description: "Significant as the original location of the Kaposi's Sarcoma Research and Education Foundation, one of the nation's first AIDS organizations.", lat: 37.75818, lng: -122.43106 },
  { name: "St. Matthew's Church", address: "3281 16th Street", description: "Significant for its exuberant architectural expression as a Gothic Revival church.", lat: 37.76106, lng: -122.42071 },
  { name: "St. Nicholas Cathedral", address: "2005 15th Street", description: "Significant as an exemplary example of Gothic Revival architecture.", lat: 37.76325, lng: -122.42521 },
  { name: "University Club", address: "800 Powell Street", description: null, lat: 37.7895, lng: -122.4094 },
  { name: "St. Peter & Paul Church", address: "600–660 Filbert Street", description: null, lat: 37.79979, lng: -122.41395 },
  { name: "California Masonic Temple", address: "1111–1171 California Street", description: null, lat: 37.78868, lng: -122.41448 },
  { name: "Great China Theater", address: "626 Jackson Street", description: null, lat: 37.79336, lng: -122.40672 },
  { name: "Sing Chong Building", address: "610 Grant Avenue", description: null, lat: 37.7895, lng: -122.40555 },
  { name: "TransAmerica Pyramid", address: "600 Montgomery Street", description: null, lat: 37.79164, lng: -122.40267 },
  { name: "Chinese Telephone Exchange", address: "743 Washington Street", description: null, lat: 37.79206, lng: -122.40689 },
  { name: "Central Chinese High School", address: "827 Stockton Street", description: null, lat: 37.7906, lng: -122.409 },
  { name: "Telegraph Neighborhood Association", address: "1736 Stockton Street", description: null, lat: 37.80016, lng: -122.41292 },
  { name: "Chinese Consolidated Benevolent Association", address: "843 Stockton Street", description: null, lat: 37.79085, lng: -122.40867 },
  { name: "Bimbo's 365 Club", address: "1001 Columbus Avenue", description: null, lat: 37.80321, lng: -122.42111 },
  { name: "George Perine House", address: "535 Powell Street", description: null, lat: 37.78647, lng: -122.40834 },
  { name: "Nam Kue School", address: "755 Sacramento Street", description: null, lat: 37.78991, lng: -122.40533 },
  { name: "Old First Presbyterian Church", address: "1751 Sacramento Street", description: null, lat: 37.79021, lng: -122.42495 },
  { name: "Mona's Candlelight Lounge", address: "463–473 Broadway", description: null, lat: 37.79501, lng: -122.40618 },
  { name: "Finocchio's", address: "500–508 Broadway", description: null, lat: 37.79542, lng: -122.40723 },
  { name: "A. Cavalli Bookstore / Vesuvio Cafe", address: "255 Columbus Avenue", description: null, lat: 37.79451, lng: -122.40753 },
  { name: "Fugazi Building", address: "678 Green Street", description: null, lat: 37.79769, lng: -122.41329 },
  { name: "Italian Athletic Club", address: "1630 Stockton Street", description: null, lat: 37.79895, lng: -122.41224 },
];

const starIcon = L.divIcon({
  className: "landmark-star-icon",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill="#c8a951" stroke="#7a6020" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

function ZoomControls() {
  const map = useMap();
  return (
    <div className="landmark-zoom-controls">
      <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
      <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
    </div>
  );
}

const CENTER = [37.775, -122.42];

const LandmarkMap = () => {
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
        {LANDMARKS.map((landmark, i) => (
          <Marker key={i} position={[landmark.lat, landmark.lng]} icon={starIcon}>
            <Popup className="landmark-popup">
              <strong>{landmark.name}</strong>
              <span className="landmark-popup-address">{landmark.address}</span>
              {landmark.description && (
                <p className="landmark-popup-desc">{landmark.description}</p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LandmarkMap;
