import {
    MapContainer,
    TileLayer,
    TileGroup,
    Polygon,
    Popup,
    useMap,
    LayersControl
  } from "react-leaflet";


  const viewSettings = {
    main: {
      lat: 37.871558, 
      lon: -122.366000,
      zoom: 11,
    },
  };

const ParcelMap = () => {
  
    return (
      <div className="single">
        <br/>
        <MapContainer 
        center={[viewSettings.main.lat, viewSettings.main.lon]}
        zoom={viewSettings.main.zoom}
        style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
        >
            <LayersControl>
              <LayersControl.Overlay>
                <LayerGroup>
                {() => {
                        // let polygonCoords = ;
                        return (
                          <>
                            <Polygon
                              pathOptions={{
                                fillColor: "#8800C4",
                                fillOpacity: 1,
                                weight: 1,
                                color: "#8800C4"
                              }}
                              positions={[
                                [-122.49345526799993, 37.78351817100008],
                                [-122.49372649999992, 37.78724665100009],
                                [-122.49358666699993, 37.78731259500006]
                              ]}
                            >
                            </Polygon>
                          </>
                    )}}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
        {/* <p>Hello</p> */}
      </div>
    );
  };
export default ParcelMap;