import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    useMap,
    LayersControl,
    LayerGroup
  } from "react-leaflet";
import { useState, useEffect } from 'react';
import * as d3 from 'd3';


const isMobile = window.innerWidth < 768;

const viewSettings = {
  main: {
    lat: 37.77, 
    lon: -122.445,
    zoom: isMobile ? 11 : 12,
  },
};

// Function to parse WKT coordinates
const parseWKT = (wkt) => {
  try {
    
    
    // Extract all polygon coordinates from WKT format
    let matches = wkt.match(/\(\((.*?)\)\)/g);
    

    console.log('clean wkt type: ', matches)
    
    if (!matches) {
      console.error('No coordinates found in WKT string');
      return [];
    }
    
    // Process each polygon
    const polygons = matches.map(match => {
      const coordsStr = match.match(/\(\((.*)\)\)/)[1].slice(1);
      console.log('Extracted coordinates string:', coordsStr);
      // const cleanCoordsStr = coordsStr.slice(1);
      const coords = coordsStr.split(', ').map(coord => {
        console.log('Processing coordinate:', coord);
        const [lon, lat] = coord.split(' ').map(Number);
        console.log('Parsed lat/lon:', lat, lon);
        return [lat, lon];
      });
      
      return coords;
    });
    
    console.log('Final coordinates array:', polygons);
    return polygons;
  } catch (error) {
    console.error('Error parsing WKT:', error);
    console.error('Problematic WKT string:', wkt);
    return [];
  }
};

// Function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  // Keep generating colors until we get a non-orange one
  let isOrange = true;
  while (isOrange) {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    
    // Convert to RGB to check if it's orange
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Check if the color is orange-like (high red and green, low blue)
    isOrange = (r > 200 && g > 80 && b < 100);
  }

  // Convert to d3 color and desaturate
  const d3FillColor = d3.color(color);
  const d3LineColor = d3.color(color);
  d3FillColor.darker(10);
  d3LineColor.darker(8);
  d3FillColor.opacity = 1.0;
  d3LineColor.opacity = 1.0;
  return {
    fill: d3FillColor.toString(),
    line: d3LineColor.toString()
  };
};

const ParcelMap = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState({
    name: "Financial District",
    paragraph: "This is the paragraph for the selected neighborhood."
  });
  const [neighborhoodColors, setNeighborhoodColors] = useState({});

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/SF_Find_Neighborhood_Boundaries.csv');
        const csvText = await response.text();
        
        const rows = csvText.split('\n');

        const data = rows.slice(1).map(row => {
          // Find the first and last quote to extract the_geom
          const firstQuote = row.indexOf('"');
          const lastQuote = row.lastIndexOf('"');
          const the_geom = row.substring(firstQuote, lastQuote + 1);
          
          const remaining = row.substring(lastQuote + 1).split(',');
          return {
            the_geom: the_geom,
            name: remaining[1]?.trim() || ''
          };
        });
        
        const processedNeighborhoods = data
          .filter(row => row.the_geom) // Filter out empty rows
          .map(row => {
            console.log('Processing row:', row);
            const coordinates = parseWKT(row.the_geom);
            return {
              coordinates,
              name: row.name
            };
          });
        
        // Generate initial colors for each neighborhood
        const initialColors = {};
        processedNeighborhoods.forEach(neighborhood => {
          initialColors[neighborhood.name] = getRandomColor();
        });
        
        setNeighborhoodColors(initialColors);
        setNeighborhoods(processedNeighborhoods);
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCSVData();
  }, []);

  const getNeighborhoodColor = (neighborhoodName) => {
    if (selectedNeighborhood.name === neighborhoodName) {
      return {
        fill: '#ff795d',
        line: '#ff795d',
        fillOpacity: 0.9,
        weight: 2
      };
    }
    
    return neighborhoodColors[neighborhoodName];
  };

  return (
    <div className="rent-control-map-container" style={{ display: 'flex', gap: '20px', position: 'relative' }}>
      <div className="rent-map-container">
        <MapContainer 
          center={[viewSettings.main.lat, viewSettings.main.lon]}
          zoom={viewSettings.main.zoom}
          className="map"
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="grayscale-tiles"/>
              <LayerGroup>
                {neighborhoods.map((neighborhood, index) => (
                  neighborhood.coordinates.map((polygon, polygonIndex) => {
                    const colors = getNeighborhoodColor(neighborhood.name);
                    return (
                      <Polygon
                        key={`${index}-${polygonIndex}`}
                        pathOptions={{
                          fillColor: colors.fill,
                          fillOpacity: colors.fillOpacity || 0.4,
                          weight: colors.weight || 1,
                          color: colors.line
                        }}
                        positions={polygon}
                        eventHandlers={{
                          click: (e) => {
                            console.log("selected Neighborhood ", neighborhood);
                            setSelectedNeighborhood({
                              name: neighborhood.name,
                              paragraph: "This is the paragraph for " + neighborhood.name
                            });
                          }
                        }}
                      />
                    );
                  })
                ))}
              </LayerGroup>
        </MapContainer>
      </div>
      <div className="rent-control-map-blurb">
        {selectedNeighborhood && (
          <div style={{ textAlign: 'center' }}>
<<<<<<< HEAD
            <h3>{selectedNeighborhood}</h3>
            <span className="blurb-text">Lorems ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..</span>
=======
            <h3>{selectedNeighborhood.name}</h3>
            <span className="blurb-text">{selectedNeighborhood.paragraph}</span>
>>>>>>> f2f9cff8616375e690cd076be6cd5da019bac5b6
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelMap;