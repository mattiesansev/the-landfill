import { React, useEffect, useState, useRef, useCallback } from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ClassBar from "./charts/ClassBar";
import headerPhoto from "/src/header.jpg";
import { useLocation } from 'react-router-dom'; 
import ReactGA from 'react-ga4';
import ParcelScroll from "./RentControlTimeline";
import ScrollyTimeline from "./RentControlTimeline2";
import ParcelMap from "./ParcelsMap";

ReactGA.initialize('G-NR2T70PVBG'); 

const Parcels = () => {
  const [propInfo, setPropInfo] = useState([]);

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <div className="single">
    <div className="complexContentContainer">
      <div className="content">
        <img src={headerPhoto}></img>
        <div className="title">
          A deep dive into rent control in San Francisco
        </div>
        <div >
          <p>This is the introcution to the article it's about rent control in San Francisco.</p>
        </div>
    </div>
    <div className="content" style={{ width: "90%"}}> 
    <ParcelMap />
    <ScrollyTimeline />
    </div>
    <div className="content">
    <div>
          <p>Maybe we insert some new info here.</p>
        </div>
        <img src={headerPhoto}></img>
        <div >
          <p>This is the introcution to the article it's about rent control in San Francisco.</p>
        </div>
    </div>
    <div className="content" style={{ width: "90%"}}> 
    <ScrollyTimeline />
    </div>
    <ParcelScroll />
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

function getHeatmapColor(yesVoteLevel, noVoteLevel) {
    if (!yesVoteLevel || yesVoteLevel.length === 0) {
        console.log("[mattie] missing percent")
        return "#FFA500"
    }
    const percentageString = yesVoteLevel.replace('%', '');
    const numberValue = parseFloat(percentageString) / 100;
    if (numberValue < 50) {
        // Less than half voted yes

    }
    // Clamp the value between 0 and 1
    const value = Math.max(0, Math.min(1, numberValue));

    // Lightness decreases as value increases (from 80% to 50%)
    const lightness = (1 - value) * 30 + 70; // Lightness from 70% to 50%

    const hue = 240; // Blue hue
    const saturation = 100; // Full saturation

    // Convert HSL to RGB
    const rgb = hslToRgb(hue, saturation, lightness);

    // Convert RGB to hex
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

    // if (voteLevel == "13.94%" || voteLevel == "49.80%" || voteLevel == "50.00%" || voteLevel == "69.70%") {
    //     console.log("color is ", voteLevel, hexColor)
    // }
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