import {
    MapContainer,
    TileLayer,
    Polygon,
    Popup,
    useMap,
    LayersControl,
    LayerGroup,
    CircleMarker
  } from "react-leaflet";
import { useState, useEffect, useMemo } from 'react';
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
    console.log('Parsing WKT:', wkt.substring(0, 100) + '...');
    
    // Extract all polygon coordinates from WKT format
    let matches = wkt.match(/\(\((.*?)\)\)/g);
    
    console.log('Found polygon matches:', matches ? matches.length : 0);
    
    if (!matches) {
      console.error('No coordinates found in WKT string');
      return [];
    }
    
    // Process each polygon
    const polygons = matches.map((match, matchIndex) => {
      // Extract coordinates string from the match
      const coordsStr = match.match(/\(\((.*)\)\)/)[1];
      console.log(`Polygon ${matchIndex} coordinates string:`, coordsStr.substring(0, 100) + '...');
      
      // Split by comma and space to get individual coordinate pairs
      const coords = coordsStr.split(', ').map((coord, coordIndex) => {
        const parts = coord.trim().split(' ');
        if (parts.length !== 2) {
          console.error(`Invalid coordinate format: ${coord}`);
          return null;
        }
        
        const lon = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        
        if (isNaN(lon) || isNaN(lat)) {
          console.error(`Invalid coordinate values: lon=${parts[0]}, lat=${parts[1]}`);
          return null;
        }
        
        console.log(`Coordinate ${coordIndex}: lon=${lon}, lat=${lat}`);
        return [lat, lon]; // Return as [lat, lon] for Leaflet
      }).filter(coord => coord !== null);
      
      console.log(`Polygon ${matchIndex} processed ${coords.length} coordinates`);
      return coords;
    });
    
    console.log('Final polygons array:', polygons.length, 'polygons');
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
  const [rentControl, setRentControl] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState({
    name: "Financial District",
    paragraph: "This is the paragraph for the selected neighborhood."
  });
  const [neighborhoodColors, setNeighborhoodColors] = useState({});

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/sf_realtor_boundaries_and_blurbs_and_stats.csv');
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        
        // Helper function to parse CSV row properly handling quoted fields
        const parseCSVRow = (row) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          // Add the last field
          result.push(current.trim());
          return result;
        };
        
        // Find the header row to get column indices
        const headerRow = rows[0];
        const headers = parseCSVRow(headerRow);
        
        // Find the index of the Blurbs and the_geom columns
        const blurbsIndex = headers.findIndex(header => header === 'Blurbs');
        const geomIndex = headers.findIndex(header => header === 'the_geom');
        console.log('Headers:', headers);
        console.log('Blurbs column index:', blurbsIndex);
        console.log('Geometry column index:', geomIndex);
        
        if (blurbsIndex === -1) {
          console.error('Blurbs column not found in CSV');
          return;
        }
        
        if (geomIndex === -1) {
          console.error('the_geom column not found in CSV');
          return;
        }
        
        // Extract neighborhood data from each data row
        const extractedNeighborhoods = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (row) {
            const columns = parseCSVRow(row);
            if (columns[blurbsIndex] && columns[geomIndex]) {
              extractedNeighborhoods.push({
                neighborhood: columns[2], // nbrhood column
                blurb: columns[blurbsIndex],
                geometry: columns[geomIndex]
              });
            }
          }
        }
        
        console.log('Extracted neighborhoods:', extractedNeighborhoods);
        
        // Process the extracted data and parse geometry
        const processedNeighborhoods = extractedNeighborhoods.map(item => {
          const coordinates = parseWKT(item.geometry);
          return {
            name: item.neighborhood,
            neighborhood: item.neighborhood, 
            blurb: item.blurb,
            geometry: coordinates, // Parsed coordinates for map rendering
            rawGeometry: item.geometry // Keep original for reference
          };
        });
        
        console.log('Processed neighborhoods:', processedNeighborhoods);
        
        // Generate colors for neighborhoods
        const colors = {};
        processedNeighborhoods.forEach(neighborhood => {
          if (!neighborhoodColors[neighborhood.neighborhood]) {
            colors[neighborhood.neighborhood] = getRandomColor();
          }
        });
        setNeighborhoodColors(prev => ({ ...prev, ...colors }));
        
        // Set the neighborhoods state
        setNeighborhoods(processedNeighborhoods);
        
        // For now, just log the first few neighborhoods to test
        console.log('First 3 neighborhoods:');
        processedNeighborhoods.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.neighborhood}:`);
          console.log(`   Blurb: ${item.blurb}`);
          console.log(`   Coordinates:`, item.geometry);
        });
        
      } 
      catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadCSVData();
  }, []);

  // Process rent control data
  const rentControlData = useMemo(() => {
    if (!rentControl || !neighborhoods) return [];
    
    return rentControl.map(d => {
      const neighborhood = neighborhoods.find(n => n.name === d.neighborhood);
      return {
        ...d,
        neighborhoodInfo: neighborhood || null
      };
    });
  }, [rentControl, neighborhoods]);

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
                  neighborhood.geometry && neighborhood.geometry.length > 0 ? 
                  neighborhood.geometry.map((polygon, polygonIndex) => {
                    const colors = getNeighborhoodColor(neighborhood.neighborhood);
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
                            
                            let paragraph = neighborhood.blurb || "No description available.";
                            
                            setSelectedNeighborhood({
                              name: neighborhood.neighborhood,
                              paragraph: paragraph
                            });
                          }
                        }}
                      />
                    );
                  }) : null
                ))}
              </LayerGroup>
        </MapContainer>
      </div>
      <div className="rent-control-map-blurb" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%'
      }}>
        {selectedNeighborhood && (
          <div style={{ 
            paddingTop: '120px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <h3 style={{ 
              fontSize: '2.25rem', // 50% increase from default 1.5rem
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              {selectedNeighborhood.name}
            </h3>
            <span className="blurb-text" style={{ 
              fontSize: '1.5rem', // 50% increase from default 1rem
              lineHeight: '1.6',
              maxWidth: '90%'
            }}>
              {selectedNeighborhood.paragraph}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelMap;