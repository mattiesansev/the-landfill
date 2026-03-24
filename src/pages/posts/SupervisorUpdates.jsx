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
import VoteCard from "../../components/votes/VoteCard";

const MEETING_DATES = [
  { date: "2026-03-03", display: "March 3, 2026" },
  { date: "2026-02-24", display: "February 24, 2026" },
  { date: "2026-02-10", display: "February 10, 2026" },
  { date: "2026-02-03", display: "February 3, 2026" },
  { date: "2026-01-27", display: "January 27, 2026" },
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
  const [viewMode, setViewMode] = useState("date"); // "date" or "supervisor"
  const [allVoteData, setAllVoteData] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [loadingVotes, setLoadingVotes] = useState(false);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  // Load all vote data when switching to supervisor view
  useEffect(() => {
    if (viewMode === "supervisor" && allVoteData.length === 0) {
      loadAllVotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  async function loadAllVotes() {
    setLoadingVotes(true);
    try {
      const allData = [];
      for (const { date, display } of MEETING_DATES) {
        try {
          const response = await fetch(`/votes/${date}.json`);
          if (response.ok) {
            const data = await response.json();
            allData.push({ ...data, dateKey: date, displayDate: display });
          }
        } catch (err) {
          console.error(`Error loading votes for ${date}:`, err);
        }
      }
      setAllVoteData(allData);

      // Extract unique supervisor list from the first available data
      if (allData.length > 0 && allData[0].supervisors) {
        setSupervisorList(allData[0].supervisors);
      }
    } finally {
      setLoadingVotes(false);
    }
  }

  // Get votes for a specific supervisor across all meetings
  const getVotesForSupervisor = (supervisorLastName) => {
    const votes = [];
    for (const meetingData of allVoteData) {
      for (const vote of meetingData.importantVotes) {
        const voteInfo = vote.vote;
        let stance = null;
        if (voteInfo.ayes_names.includes(supervisorLastName)) {
          stance = "aye";
        } else if (voteInfo.noes_names.includes(supervisorLastName)) {
          stance = "no";
        } else if (voteInfo.excused.includes(supervisorLastName)) {
          stance = "excused";
        }
        if (stance) {
          votes.push({
            ...vote,
            stance,
            meetingDate: meetingData.displayDate,
            meetingDateKey: meetingData.dateKey,
            supervisors: meetingData.supervisors,
          });
        }
      }
    }
    return votes;
  };

  // Get vote statistics for a supervisor
  const getVoteStats = (supervisorLastName) => {
    const votes = getVotesForSupervisor(supervisorLastName);
    return {
      total: votes.length,
      ayes: votes.filter((v) => v.stance === "aye").length,
      noes: votes.filter((v) => v.stance === "no").length,
      excused: votes.filter((v) => v.stance === "excused").length,
    };
  };

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
          legislation that affects your neighborhood. Take a look at our weekly 
          recaps where we lay out some of the important votes that took place.
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

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === "date" ? "active" : ""}`}
            onClick={() => {
              setViewMode("date");
              setSelectedSupervisor(null);
            }}
          >
            By Date
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "supervisor" ? "active" : ""}`}
            onClick={() => setViewMode("supervisor")}
          >
            By Supervisor
          </button>
        </div>

        {viewMode === "date" && (
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
        )}

        {viewMode === "supervisor" && !selectedSupervisor && (
          <>
            {loadingVotes ? (
              <p>Loading supervisor data...</p>
            ) : (
              <div className="supervisor-cards">
                {supervisorList.map((supervisor) => {
                  const stats = getVoteStats(supervisor.lastName);
                  return (
                    <div
                      key={supervisor.district}
                      className="supervisor-card"
                      onClick={() => setSelectedSupervisor(supervisor)}
                    >
                      <img
                        src={supervisor.image}
                        alt={supervisor.fullName}
                        className="supervisor-card-img"
                      />
                      <div className="supervisor-card-info">
                        <div className="supervisor-card-name">
                          {supervisor.fullName}
                        </div>
                        <div className="supervisor-card-district">
                          District {supervisor.district}
                        </div>
                        <div className="supervisor-card-stats">
                          <span className="stat-ayes">{stats.ayes} Ayes</span>
                          <span className="stat-noes">{stats.noes} Noes</span>
                          {stats.excused > 0 && (
                            <span className="stat-excused">
                              {stats.excused} Excused
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {viewMode === "supervisor" && selectedSupervisor && (
          <div className="supervisor-detail">
            <button
              className="back-link"
              onClick={() => setSelectedSupervisor(null)}
            >
              &larr; All Supervisors
            </button>
            <div className="supervisor-detail-header">
              <img
                src={selectedSupervisor.image}
                alt={selectedSupervisor.fullName}
                className="supervisor-detail-img"
              />
              <div className="supervisor-detail-info">
                <h2>{selectedSupervisor.fullName}</h2>
                <p>District {selectedSupervisor.district}</p>
              </div>
            </div>
            <div className="votes-section">
              <h2>Voting Record</h2>
              {getVotesForSupervisor(selectedSupervisor.lastName).map(
                (vote, index) => (
                  <div key={`${vote.file_number}-${index}`} className="vote-with-stance">
                    <div className={`stance-indicator stance-${vote.stance}`}>
                      {vote.stance.toUpperCase()}
                    </div>
                    <div className="vote-meeting-date">{vote.meetingDate}</div>
                    <VoteCard vote={vote} supervisors={vote.supervisors} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorUpdates;
