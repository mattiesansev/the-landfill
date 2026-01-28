import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MEETING_DATES = [
  { date: "2026-01-13", display: "January 13, 2026" },
  { date: "2026-01-06", display: "January 6, 2026" },
  { date: "2025-12-16", display: "December 16, 2025" },
];

const DISTRICT_COLORS = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
  "#aec7e8", // light blue
];

const viewSettings = {
  center: {
    lat: 37.7749,
    lon: -122.4194,
    zoom: 12,
  },
};

const SupervisorUpdates = () => {
  const location = useLocation();
  const [districts, setDistricts] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const response = await fetch("/supervisor_districts.geojson");
        const data = await response.json();
        setDistricts(data.features);
      } catch (error) {
        console.error("Error loading district data:", error);
      }
    }
    loadDistricts();
  }, []);

  const convertGeoJSONToLeaflet = (coordinates) => {
    // GeoJSON MultiPolygon: [polygon][ring][point][lon, lat]
    // Leaflet expects: [lat, lng]
    const allPolygons = [];

    for (const polygon of coordinates) {
      const rings = [];
      for (const ring of polygon) {
        const leafletRing = ring.map(([lon, lat]) => [lat, lon]);
        rings.push(leafletRing);
      }
      allPolygons.push(rings);
    }

    return allPolygons;
  };

  return (
    <div className="single">
      <div className="content">
        <div className="title">What is my district supervisor up to?</div>
        <p>
          Every week, the San Francisco Board of Supervisors meets to vote on
          legislation that affects your neighborhood. Here you'll find recaps
          of each meeting - the votes, debates, and decisions that shape our
          city.
        </p>

        <div className="embed-container">
          <br />
          <div className="chartTitle">San Francisco Supervisor Districts</div>
          <MapContainer
            ref={mapRef}
            center={[viewSettings.center.lat, viewSettings.center.lon]}
            zoom={viewSettings.center.zoom}
            style={{ height: "60vh", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="grayscale-tiles"
            />
            {districts.map((feature, index) => {
              const { sup_name, sup_dist, sup_dist_name } = feature.properties;
              const color = DISTRICT_COLORS[parseInt(sup_dist) - 1] || DISTRICT_COLORS[0];
              const polygons = convertGeoJSONToLeaflet(feature.geometry.coordinates);

              return polygons.map((rings, polyIndex) => (
                <Polygon
                  key={`${sup_dist}-${polyIndex}`}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.6,
                    weight: 2,
                    color: color,
                  }}
                  positions={rings[0]}
                >
                  <Popup className="popup">
                    <div className="popUpTitle">
                      <strong>{sup_dist_name}</strong>
                    </div>
                    <br />
                    <div className="popUpText">
                      <strong>Supervisor:</strong> {sup_name}
                      <br />
                      <strong>District:</strong> {sup_dist}
                    </div>
                  </Popup>
                </Polygon>
              ));
            })}
          </MapContainer>
        </div>

        <div className="week-cards">
          {MEETING_DATES.map(({ date, display }) => (
            <Link
              key={date}
              to={`/post/supervisor-updates/${date}`}
              className="week-card"
            >
              <span className="week-date">{display}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupervisorUpdates;
