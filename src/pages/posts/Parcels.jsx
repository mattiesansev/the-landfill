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


const Parcels = () => {
  const [propInfo, setPropInfo] = useState([]);

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  // Define the polygon's coordinates
  useEffect(() => {
    async function getData() {
      await fetch("/prop_33_results.csv")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setPropInfo(results.data);
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


  return (
    <div className="single">
      <div className="content">
        <img src={headerPhoto}></img>
        
        <div class="embed-container">
          <br></br>
          <div className="chartTitle">WIP map of people who voted no on 33</div>
          <MapContainer
            ref={mapRef}
            center={[viewSettings.main.lat, viewSettings.main.lon]}
            zoom={viewSettings.main.zoom}
            style={{ height: "80vh", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {propInfo &&
                propInfo.map((precinct_row) => {
                const { precinct, yes, no, coords} =
                    initializePrecinctVariables(precinct_row);
                    return (
                    <>
                        <Polygon
                        pathOptions={{
                            fillColor: getHeatmapColor(no),
                            fillOpacity: 1,
                            weight: 1,
                            color: "#FFA500"
                        }}
                        positions={coords}
                        >
                        {renderPopups(
                            precinct
                            )}
                        </Polygon>
                    </>
                    );
                })}
            </MapContainer>
        </div>
    </div>
</div>
  );
};
export default Parcels;


function renderPopups(precinct) {
  return (
    <Popup className="popup">
      {precinct}
      </Popup>
  );
}

function initializePrecinctVariables(precinct_row) {

   let yes = ""
   let no = ""
   let coords = []
   let precinct = ""

  try {
    precinct = precinct_row.Precinct
    yes = precinct_row.Yes
    no = precinct_row.No 
    const coords_raw = precinct_row.the_geom 

    coords = []
    const split_coords = coords_raw.split(',')
    // Now it should look like [123 345,125 456]
    split_coords.forEach((coord_pair) => {
        const lat_lon = coord_pair.split(' ')
        coords.push(lat_lon.reverse())
    })
  } catch (e) {
    console.log("invalid row ", precinct_row);
  }

  return { precinct, yes, no, coords };
}

function getHeatmapColor(voteLevel) {
    if (!voteLevel || voteLevel.length === 0) {
        console.log("[mattie] missing percent")
        return "#FFA500"
    }
    const percentageString = voteLevel.replace('%', '');
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