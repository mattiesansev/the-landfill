import { React, useEffect, useState, useRef, useCallback } from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  Polygon,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ClassBar from "./charts/ClassBar";
import OwnershipBar from "./charts/OwnershipBar";
//import 'react-pap'
//import csvFile from './grouped_xy.csv'

const handleViewChange = (map, center, zoom) => {
  map.setView(center, zoom);
};

const viewSettings = {
  sanFrancisco: {
    lat: 37.77498,
    lon: -122.434574,
    zoom: 12,
  },
  eastBay: {
    lat: 37.7429,
    lon: -122.18045,
    zoom: 11.3,
  },
  main: {
    lat: 37.7429,
    lon: -122.25045,
    zoom: 10,
  },
};

const LandfillMap = () => {
  const headerImageUrl = "https://picsum.photos/300/200";
  //let coordinatesPerLandfill = []
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([]);
  const [censusData, setCensusData] = useState([]);
  // Define the polygon's coordinates
  useEffect(() => {
    async function getData() {
      await fetch("/grouped_xy_with_info.csv")
        .then((response) => response.text())
        .then((csvText) => {
          console.log("[mattie] data", csvText);
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setCoordinatesPerLandfill(results.data);
              console.log(coordinatesPerLandfill); // Parsed CSV data as an array of objects
            },
            error: function (error) {
              console.error(error.message); // Error handling
            },
          });
        });
    }
    async function getCensusData() {
      await fetch("/poverty_data_full.csv")
        .then((response) => response.text())
        .then((csvText) => {
          console.log("[mattie] getting poverty data")
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setCensusData(results.data);
            },
            error: function (error) {
              console.error(error.message); // Error handling
            },
          });
        });
    }
    getData();
    getCensusData();
  }, []);
  const mapRef = useRef(null);

  const handleExternalViewChange = useCallback((location) => {
    if (mapRef.current) {
      handleViewChange(
        mapRef.current,
        [location.lat, location.lon],
        location.zoom
      );
    }
  }, []);

  function getHeatmapColor(povertyLevel) {
    const percentageString = povertyLevel;
    const numberValue = parseFloat(percentageString) / 100;
    // Clamp the value between 0 and 1
    const value = Math.max(0, Math.min(1, numberValue));

    // Lightness decreases as value increases (from 80% to 50%)
    const lightness = (1 - value) * 30 + 70; // Lightness from 70% to 50%

    const hue = 0; // Red hue
    const saturation = 100; // Full saturation

    // Convert HSL to RGB
    const rgb = hslToRgb(hue, saturation, lightness);

    // Convert RGB to hex
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

    return hexColor;
}

function hslToRgb(h, s, l) {
    let r, g, b;

    s /= 100;
    l /= 100;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

  return (
    <div className="single">
      <div className="content">
        <img src={headerImageUrl}></img>
        <div className="title">
          Infrastructure across the Bay Area was built on top of landfills. What
          does that mean for you?
        </div>
        <AuthorFooter
          authorImageUrl={authors["mattie"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["mattie"]["name"]}
        />
        <AuthorFooter
          authorImageUrl={authors["destiny"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["destiny"]["name"]}
        />
        <p>content content content</p>
        <ClassBar />
        <OwnershipBar />
        <div class="embed-container">
          <button onClick={() => handleExternalViewChange(viewSettings.main)}>
            Main
          </button>
          <button
            onClick={() => handleExternalViewChange(viewSettings.sanFrancisco)}
          >
            San Francisco
          </button>
          <button
            onClick={() => handleExternalViewChange(viewSettings.eastBay)}
          >
            East Bay
          </button>
          <MapContainer
            ref={mapRef}
            center={[viewSettings.main.lat, viewSettings.main.lon]}
            zoom={viewSettings.main.zoom}
            style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LayersControl position="topright" collapsed={false}>
              <LayersControl.Overlay name="Non-Hazardous Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill);

                      if (typeOfWaste === "Non-Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons);
                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                color: "#bbf217",
                                fillOpacity: 0.8,
                              }}
                              positions={polygonCoords}
                            >
                              <Popup className="non-hazardous-popup">
                                <p className="popUpTitle">{landfillName}</p>
                                <p className="popUpText">
                                  This is a Non-Hazardous Waste landfill!
                                </p>
                              </Popup>
                            </Polygon>
                          </>
                        );
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Hazardous Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill);

                      if (typeOfWaste === "Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons);

                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                color: "#F5BD1E",
                                fillOpacity: 0.8,
                              }}
                              positions={polygonCoords}
                            >
                              <Popup className="hazardous-popup">
                                <p className="popUpTitle">{landfillName}</p>
                                <p className="popUpText">
                                  This is a Hazardous Waste landfill!
                                </p>
                              </Popup>
                            </Polygon>
                          </>
                        );
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Unclassified Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill);

                      if (
                        typeOfWaste !== "Hazardous Waste" &&
                        typeOfWaste !== "Non-Hazardous Waste"
                      ) {
                        let polygonCoords = generatePolyCoords(lats, lons);

                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                color: "#FFE134",
                                fillOpacity: 0.8,
                              }}
                              positions={polygonCoords}
                            >
                              <Popup className="unclassified-popup">
                                <p className="popUpTitle">{landfillName}</p>
                                <p className="popUpText">
                                  This is an unclassified waste landfill!
                                </p>
                              </Popup>
                            </Polygon>
                          </>
                        );
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Show poverty lines">
                <LayerGroup>
                  {censusData &&
                    censusData.map((row) => {
                      const coords = row.the_geom
                          if (coords) {
                            const polygonCoords = JSON.parse(coords)
                            const povertyLevel = row.estimatedPercentBelowPovertyLevel
              

                            return (
                              <>
                                <Polygon
                                  pathOptions={{
                                    color: getHeatmapColor(povertyLevel),
                                    fillOpacity: 1.0,
                                  }}
                                  positions={polygonCoords}
                                >
                                  <Popup className="unclassified-popup">
                                    <p className="popUpText">
                                      {povertyLevel} below the poverty level
                                    </p>
                                  </Popup>
                                </Polygon>
                              </>
                           );
                          }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
export default LandfillMap;

function generatePolyCoords(lats, lons) {
  let polygonCoords = [];

  for (let i = 0; i < lats.length; i++) {
    const lat = lats[i];
    const lon = 0 - lons[i];
    polygonCoords.push([lat, lon]);
  }
  return polygonCoords;
}

function initializeLandfillVariables(polyCoordinatePerLandfill) {
  let typeOfWaste = "";
  let landfillName = "";
  let lats = [];
  let lons = [];

  try {
    typeOfWaste = polyCoordinatePerLandfill.TypeOfWaste;
    landfillName = polyCoordinatePerLandfill.LandfillName;
    lats = JSON.parse(polyCoordinatePerLandfill.Latitude);
    lons = JSON.parse(polyCoordinatePerLandfill.Longitude);
  } catch (e) {
    console.log("invalid row ", polyCoordinatePerLandfill);
  }

  return { typeOfWaste, landfillName, lats, lons };
}