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
  main: {
    lat: 37.871558, 
    lon: -122.366000,
    zoom: 11,
  },
};

const LandfillMap = () => {
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([]);

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
        
        
        <div class="embed-container">
          <br></br>
          <div className="chartTitle">Interactive Map of Closed Landfills</div>
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
        <p>
        From San Jose to parts of downtown San Francisco, many of the homes, businesses, and communities familiar to Bay Area residents would not exist if not for our long, less-than-glamorous, history with trash.
        </p>   
        <p>
        The development of the Bay Area’s landmass dates back to the state’s founding. An 1850 act of Congress allowed undesirable swamp and overflow lands to be filled, ultimately shrinking the bay estuary and wetlands from 600 to only 200 square miles. These lands, once estuaries and wetlands, now house millions of people and support critical infrastructure like the San Francisco International Airport and Oakland International Airport. This now-abundant land allowed the Bay Area to boom through the 20th century, accommodating the expanding population, burgeoning industries, and the considerable amount of associated waste. 
        </p>        
        <p>Initially, the primary way to dispose of this waste was to dump it directly into the bay. Other disposal options included transporting and dumping the trash into the ocean or burning the trash via incinerators, though these were more expensive and thus less commonly used. Cities like Berkeley would transport their trash to unincorporated areas like Albany. Similarly, San Francisco used the shoreline in Burlingame as its dumping grounds. This was the time of uncontrolled “city dumps” and “burn dumps”, before the modern sanitary landfill was created and landfills moved away from the edges of the bay shoreline. There were no barriers, protections, or regulations to protect the Bay’s ecosystem. </p>
        <p>Dumping waste into the Bay eventually ended with the enactment of the Resource and Recovery Act (RCRA) in 1976. The RCRA created standardized requirements for the disposal of non-hazardous and hazardous waste<span className="footnoteNumber">1</span>. While prior regulation created some requirements for the disposal and handling of waste, the RCRA further clarified and enforced standards for landfill operation and design, location restrictions, cleanup actions, and closure requirements. Additionally, the RCRA created a class system to identify what kind of waste a landfill can accept; class I landfills can accept hazardous waste, class II landfills can accept hazardous waste if it meets threshold requirements, and class III landfills accept non-hazardous waste. A ‘cradle to grave’ approach was implemented for the disposal of hazardous waste, allowing the state and federal government to have full oversight over hazardous materials’ creation, use, and disposal. </p>
        <ClassBar />
        <p>Since the enactment of the RCRA, landfills must meet clean closure requirements, which include creating detailed post-closure plans that provide information on the site's background, geologic and hydrogeologic information, final cover, and other important information. All closed landfills, even the ones closed before the RCRA, are inspected by CalRecycle to check methane emissions, environmental violations, and areas of concern. To date, 67 landfills have been closed since RCRA’s creation.</p>
        <p>Closed landfills have been repurposed into golf courses, businesses, marinas, homes, and, most commonly, parks. Of the 53 closed landfills that have been converted, almost half have been turned into parks, which must be monitored for methane and leachate due to the landfill gasses building up underneath. The majority of the parks sit along the San Francisco Bay, giving Bay Area residents unfettered access to the Bay’s shoreline. One such park, the 750-acre Shoreline Park in Mountain View, hosts ample recreation space, a popular outdoor amphitheater, and acts as a key wildlife refuge for native shore birds, such as burrowing owls. Other parks host a variety of well-loved public amenities, such as biking and walking trails, picnic areas, public art installations, athletic fields, sandy bay beaches, and even a fishing pier. Many parks built on landfills, such as Berkeley’s Cesar Chavez Park, are also characterized by their grassy hills which cover the piles of waste underneath. In fact, as the shore around the bay is naturally bay-level, every small grassy hill along the bay is manmade - a byproduct of landfills of the past.</p>
        <p>The history of the San Francisco Bay is deeply intertwined with the history of waste and waste management. While many Bay Area residents take their trash for granted, they might consider the key role that waste has played in the development of the bay’s shoreline. From undeveloped swaths of land to beloved leisure locations along the shore to critical infrastructure, repurposed landfills show how the Bay Area has been able to transform to accommodate rapid urbanization and human needs. </p>
        <p className="footnote">1. Federal facilities were given sovereign immunity and thus not impacted by the regulations of the RCRA. Federal facilities were not subjected to regulation until 1992, when The Federal Facilities Compliance Act was enacted. </p>
        <div className="chartTitle">About the data</div>
        <p>All data featured on the map was sourced from <a href="https://www2.calrecycle.ca.gov/SolidWaste/Site/Search">Cal Recycles Solid Waste Facility System.</a></p>
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