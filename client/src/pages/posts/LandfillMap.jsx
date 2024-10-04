import {React, useEffect, useState} from 'react'
import AuthorFooter from '../../components/AuthorFooter'
import { authors } from '../../authors/authors'
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//import 'react-pap'
//import csvFile from './grouped_xy.csv' 

const LandfillMap = () => {
    const headerImageUrl = 'https://picsum.photos/300/200'
    //let coordinatesPerLandfill = []
    const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([]);
    // Define the polygon's coordinates
    useEffect(() => {
        async function getData() {
            await fetch('/grouped_xy_with_info.csv')
                .then(response=>response.text())
                .then(csvText => {
                  console.log("[mattie] data", csvText)
                    Papa.parse(csvText, {
                        header: true,
                        dynamicTyping: true,
                        complete: function(results) {
                            setCoordinatesPerLandfill(results.data)
                            console.log(coordinatesPerLandfill);  // Parsed CSV data as an array of objects
                        },
                        error: function(error) {
                            console.error(error.message);  // Error handling
                        }
                    })
            })
        }
        getData()
    }, [])
    // var baseLayers = {
    //     "Mapbox": mapbox,
    //     "OpenStreetMap": osm
    // };
    
    // var overlays = {
    //     "Marker": marker,
    //     "Roads": roadsLayer
    // };

    return (
        <div className='single'>
            <div className='content'>
                <img src={headerImageUrl}></img>
                <div className='title'>
                    Infrastructure across the Bay Area was built on top of landfills. What does that mean for you?
                </div>
                <AuthorFooter authorImageUrl={authors["mattie"]["photo"]} postDate='July 15, 2024' authorName={authors["mattie"]["name"]} />
                <AuthorFooter authorImageUrl={authors["destiny"]["photo"]} postDate='July 15, 2024' authorName={authors["destiny"]["name"]} />
                <p>content content content</p>
                <div class="embed-container">
                <MapContainer center={[37.774980, -122.434574]} zoom={12} style={{ height: "100vh", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    { coordinatesPerLandfill &&
                    coordinatesPerLandfill.map(polyCoordinatePerLandfill => {
                      //console.log("coords per landfill, ", coordinatesPerLandfill)
                      let lats = []
                      let lons = []
                      try {
                        lats = JSON.parse(polyCoordinatePerLandfill.Latitude)
                        lons = JSON.parse(polyCoordinatePerLandfill.Longitude)
                      } catch(e) {
                        console.log("invalid row ", polyCoordinatePerLandfill)
                      }
                        //console.log("lats and longs ", lats, lons)
                        let polygonCoords = []
                        let text = polyCoordinatePerLandfill.LandfillName
                        for (let i = 0; i < lats.length; i++) {
                            const lat = lats[i]
                            const lon = 0 - lons[i]
                            polygonCoords.push([lat, lon])
                            // const id = coordinatePerLandfill.SWIS
                            console.log("polygonCoords" ,polygonCoords)
                        } 
                        return <><Polygon pathOptions={{ color: 'red' }} positions={polygonCoords}>
                            <Popup className='popup'>
                                A pretty CSS3 popup. <br /> {text}
                            </Popup>
                        </Polygon> 
                        </>
                    })
                    }
                </MapContainer>
                </div>
            </div>
        </div>
        
  );
};
export default LandfillMap;
