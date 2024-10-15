import { React, useEffect, useState, useRef, useCallback } from "react"
import AuthorFooter from "../../components/AuthorFooter"
import { authors } from "../../authors/authors"
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  Polygon,
  Popup,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import csvFile from "../../../assets/grouped_xy_with_info.csv"

const handleViewChange = (map, center, zoom) => {
  map.setView(center, zoom)
}

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
}

const LandfillMap = () => {
  const headerImageUrl = "https://picsum.photos/300/200"
  //let coordinatesPerLandfill = []
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([])
  // Define the polygon's coordinates
  useEffect(() => {
    function getData() {
      console.log(csvFile)
      setCoordinatesPerLandfill(csvFile)
    }
    getData()
  }, [])
  const mapRef = useRef(null)

  const handleExternalViewChange = useCallback((location) => {
    if (mapRef.current) {
      handleViewChange(
        mapRef.current,
        [location.lat, location.lon],
        location.zoom
      )
    }
  }, [])

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
        <button onClick={() => handleExternalViewChange(viewSettings.main)}>
          Main
        </button>
        <button
          onClick={() => handleExternalViewChange(viewSettings.sanFrancisco)}
        >
          San Francisco
        </button>
        <button onClick={() => handleExternalViewChange(viewSettings.eastBay)}>
          East Bay
        </button>
        <div class="embed-container">
          <MapContainer
            ref={mapRef}
            center={[viewSettings.main.lat, viewSettings.main.lon]}
            zoom={viewSettings.main.zoom}
            style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
          >
            {/* <button onClick={() => handleExternalViewChange(viewSettings.main)}>
              Main
            </button>
            <button
              onClick={() =>
                handleExternalViewChange(viewSettings.sanFrancisco)
              }
            >
              San Francisco
            </button>
            <button
              onClick={() => handleExternalViewChange(viewSettings.eastBay)}
            >
              East Bay
            </button> */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LayersControl position="topright" collapsed={false}>
              <LayersControl.Overlay name="Non-Hazardous Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill)

                      if (typeOfWaste === "Non-Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons)
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
                        )
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Hazardous Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill)

                      if (typeOfWaste === "Hazardous Waste") {
                        let polygonCoords = generatePolyCoords(lats, lons)

                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                color: "#ff845b",
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
                        )
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Unclassified Waste">
                <LayerGroup>
                  {coordinatesPerLandfill &&
                    coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
                      const { typeOfWaste, landfillName, lats, lons } =
                        initializeLandfillVariables(polyCoordinatePerLandfill)

                      if (
                        typeOfWaste !== "Hazardous Waste" &&
                        typeOfWaste !== "Non-Hazardous Waste"
                      ) {
                        let polygonCoords = generatePolyCoords(lats, lons)

                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                color: "#4b90ff",
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
                        )
                      }
                    })}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
export default LandfillMap

function generatePolyCoords(lats, lons) {
  let polygonCoords = []

  for (let i = 0; i < lats.length; i++) {
    const lat = lats[i]
    const lon = 0 - lons[i]
    polygonCoords.push([lat, lon])
  }
  return polygonCoords
}

function initializeLandfillVariables(polyCoordinatePerLandfill) {
  let typeOfWaste = ""
  let landfillName = ""
  let lats = []
  let lons = []

  try {
    typeOfWaste = polyCoordinatePerLandfill.TypeOfWaste
    landfillName = polyCoordinatePerLandfill.LandfillName
    lats = JSON.parse(polyCoordinatePerLandfill.Latitude)
    lons = JSON.parse(polyCoordinatePerLandfill.Longitude)
  } catch (e) {
    console.log("invalid row ", polyCoordinatePerLandfill)
  }

  return { typeOfWaste, landfillName, lats, lons }
}
