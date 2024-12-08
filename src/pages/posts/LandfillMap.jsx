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
import headerPhoto from "/src/header.jpg"


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
  const [showPovertyLines, setShowPovertyLines] = useState(false);
  // Define the polygon's coordinates
  useEffect(() => {
    async function getData() {
      await fetch("/grouped_xy_with_info.csv")
        .then((response) => response.text())
        .then((csvText) => {
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
  }, [showPovertyLines]);
  const mapRef = useRef(null);

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

// Define a color and a string
const nonHazLabelColor = "#FFA500";
const nonHazLabelStr = "Non-Hazardous Waste ";

// Embed the color square using a styled span or div
const nonHazColorSquare = `<span style="
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${nonHazLabelColor};
    margin-left: 8px;
    vertical-align: middle;
"></span>`;

// Combine the text with the color square
const nonHazLabel = `${nonHazLabelStr} ${nonHazColorSquare}`;

// Define a color and a string
const hazLabelColor = "#05D5FA";
const hazLabelStr = "Hazardous Waste ";

// Embed the color square using a styled span or div
const hazColorSquare = `<span style="
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${hazLabelColor};
    margin-left: 8px;
    vertical-align: middle;
"></span>`;

// Combine the text with the color square
const hazLabel = `${hazLabelStr} ${hazColorSquare}`

// Define a color and a string
const unclassifiedLabelColor = "#8800C4";
const unclassifiedLabelStr = "Unclassified Waste ";

// Embed the color square using a styled span or div
const unclassifiedColorSquare = `<span style="
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${unclassifiedLabelColor};
    margin-left: 8px;
    vertical-align: middle;
"></span>`;

// Combine the text with the color square
const unclassifiedLabel = `${unclassifiedLabelStr} ${unclassifiedColorSquare}`;

  return (
    <div className="single">
      <div className="content">
        <img src={headerPhoto}></img>
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
        <AuthorFooter
          authorImageUrl={authors["nick"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["nick"]["name"]}
        />
        <AuthorFooter
          authorImageUrl={authors["maggie"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["maggie"]["name"]}
        />
        <p>content content content</p>
        <ClassBar />
        <div class="embed-container">
          <button onClick={() => {
            setCoordinatesPerLandfill([])
            setShowPovertyLines(true);
          }}>
            Show poverty lines
          </button>
          <button onClick={() => {
            setShowPovertyLines(false);
          }}>
            Hide poverty lines
          </button>
          <MapContainer
            ref={mapRef}
            center={[viewSettings.main.lat, viewSettings.main.lon]}
            zoom={viewSettings.main.zoom}
            style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {showPovertyLines && censusData &&
              censusData.map((row) => {
                const coords = row.the_geom
                    if (coords) {
                      const polygonCoords = JSON.parse(coords)
                      const povertyLevel = row.estimatedPercentBelowPovertyLevel

                      return (
                        <>
                          <Polygon
                            pathOptions={{
                              fillOpacity: 1.0,
                              fillColor: getHeatmapColor(povertyLevel),
                              weight: 0.5,
                              color: "#808080",
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
              })
            }
            <LayersControl position="topright" collapsed={false}>
              <LayersControl.Overlay name={nonHazLabel}>
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, dateStart, dateEnd, landfillName, landfillClass, lats, lons, convertedStatus} =
                        initializeLandfillVariables(polyCoordinatePerLandfill);

                      if (typeOfWaste === "Non-Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons);
                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                fillColor: "#FFA500",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#FFA500"
                              }}
                              positions={polygonCoords}
                            >
                              {renderPopups(
                                  typeOfWaste,
                                  dateStart,
                                  dateEnd,
                                  landfillClass,
                                  landfillName,
                                  convertedStatus
                                )}
                            </Polygon>
                          </>
                        );
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name={hazLabel}>
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, dateStart, dateEnd, landfillName, landfillClass, lats, lons, convertedStatus} =
                        initializeLandfillVariables(polyCoordinatePerLandfill);

                      if (typeOfWaste === "Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons);

                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                fillColor: "#05D5FA",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#05D5FA"
                              }}
                              positions={polygonCoords}
                            >
                              {renderPopups(
                                  typeOfWaste,
                                  dateStart,
                                  dateEnd,
                                  landfillClass,
                                  landfillName,
                                  convertedStatus
                                )}
                            </Polygon>
                          </>
                        );
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name={unclassifiedLabel}>
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, dateStart, dateEnd, landfillName, landfillClass, lats, lons, convertedStatus} =
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
                                fillColor: "#8800C4",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#8800C4"
                              }}
                              positions={polygonCoords}
                            >
                                {renderPopups(
                                  typeOfWaste,
                                  dateStart,
                                  dateEnd,
                                  landfillClass,
                                  landfillName,
                                  convertedStatus
                                )}
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


function renderPopups(typeOfWaste, dateStart, dateEnd, landfillClass, landfillName, convertedStatus) {

  let classAndWasteText = "";

  if (!landfillClass.includes("Class")) {
    landfillClass = "an unclassified";
  } else {
    landfillClass = "a " + landfillClass;
  }

  if (typeOfWaste.includes("nan")) {
    classAndWasteText = "This landfill is <strong>" + landfillClass + "</strong> landfill.";
  } else {
    classAndWasteText = "This landfill is <strong>" + landfillClass + "</strong> landfill and contains <strong>" + typeOfWaste+ "</strong>.";
  }

  let dateText = "";
  if (dateStart != "nan" && dateEnd != "nan") {
    dateText = `This landfill was opened in <strong>${dateStart}</strong> and closed <strong>${dateEnd}</strong>.`;
  } else if (dateEnd == "nan" && dateStart != "nan") {
    dateText = `This landfill opened in <strong>${dateStart}</strong>`;
  } else if (dateEnd != "nan" && dateStart == "nan") {
    dateText = `This landfill closed in <strong>${dateEnd}</strong> and is no longer in operation.`;
  } 

  let convertedStatusText = "";

  if (convertedStatus === "Converted" || convertedStatus === "Fully Converted") {
    convertedStatusText = "This landfill has been converted to a different use.";
  } else if (convertedStatus === "Not Converted") {
    convertedStatusText = "This landfill has not been converted to a different use.";
  }

  return (
    <Popup className="popup">
      <p className="popUpTitle"><strong>{landfillName}</strong></p>
      <p className="popUpText">
      <span dangerouslySetInnerHTML={{ __html: classAndWasteText }} /> <br/>
      <span dangerouslySetInnerHTML={{ __html: dateText }} />
      {convertedStatusText}
      </p>
      </Popup>
  );
}

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
  let landfillName = "";
  let lats = [];
  let lons = [];
  let dateStart = "";
  let dateEnd = "";
  let landfillClass = "";
  let typeOfWaste = "";
  let typeOfWaste2 = "";
  let convertedStatus = "";

  try {
    typeOfWaste = polyCoordinatePerLandfill.TypeOfWaste;
    typeOfWaste2 = polyCoordinatePerLandfill.TypeOfWaste2;
    landfillClass = polyCoordinatePerLandfill.Class;
    dateEnd = polyCoordinatePerLandfill.YearClosed;
    dateStart = polyCoordinatePerLandfill.YearOpened;
    landfillName = polyCoordinatePerLandfill.LandfillName;
    lats = JSON.parse(polyCoordinatePerLandfill.Latitude);
    lons = JSON.parse(polyCoordinatePerLandfill.Longitude);
    convertedStatus = polyCoordinatePerLandfill.Converted;
  } catch (e) {
    console.log("invalid row ", polyCoordinatePerLandfill);
  }

  return { typeOfWaste, typeOfWaste2, dateStart, dateEnd, landfillName, landfillClass,lats, lons , convertedStatus };
}