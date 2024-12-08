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
import headerPhoto from "/src/header.jpg";
import { useLocation } from 'react-router-dom'; 
import ReactGA from 'react-ga4';

ReactGA.initialize('G-NR2T70PVBG'); 


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
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([]);
  const [censusData, setCensusData] = useState([]);

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

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
    getData();
  }, []);
  const mapRef = useRef(null);

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
          <MapContainer
            ref={mapRef}
            center={[viewSettings.main.lat, viewSettings.main.lon]}
            zoom={viewSettings.main.zoom}
            style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LayersControl position="topright" collapsed={false}>
              <LayersControl.Overlay name={nonHazLabel}>
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
                                fillColor: "#FFA500",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#FFA500"
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

              <LayersControl.Overlay name={hazLabel}>
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
                                fillColor: "#05D5FA",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#05D5FA"
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

              <LayersControl.Overlay name={unclassifiedLabel}>
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
                                fillColor: "#8800C4",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#8800C4"
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