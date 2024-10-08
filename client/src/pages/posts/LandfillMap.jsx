import { React, useEffect, useState } from "react"
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
//import 'react-pap'
//import csvFile from './grouped_xy.csv'

const LandfillMap = () => {
  const headerImageUrl = "https://picsum.photos/300/200"
  //let coordinatesPerLandfill = []
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([])
  // Define the polygon's coordinates
  useEffect(() => {
    async function getData() {
      await fetch("/grouped_xy_with_info.csv")
        .then((response) => response.text())
        .then((csvText) => {
          console.log("[mattie] data", csvText)
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setCoordinatesPerLandfill(results.data)
              console.log(coordinatesPerLandfill) // Parsed CSV data as an array of objects
            },
            error: function (error) {
              console.error(error.message) // Error handling
            },
          })
        })
    }
    getData()
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
        <div class="embed-container">
          <MapContainer
            center={[37.77498, -122.434574]}
            zoom={12}
            style={{ height: "100vh", width: "100%" }}
            zoomControl={false}
          >
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
                                color: "#f2f075",
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
