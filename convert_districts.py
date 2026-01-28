#!/usr/bin/env python3
"""Convert Supervisor Districts CSV (with WKT polygons) to GeoJSON."""

import csv
import json
import re
import os

def parse_multipolygon(wkt_str):
    """Parse WKT MULTIPOLYGON string and return list of polygon coordinates."""
    # Extract coordinates from MULTIPOLYGON (((...)))
    # Format: MULTIPOLYGON (((lon lat, lon lat, ...)))

    polygons = []

    # Remove the MULTIPOLYGON wrapper
    inner = wkt_str.replace("MULTIPOLYGON ", "").strip()

    # Split into individual polygons - each polygon is wrapped in ((...))
    # Find all coordinate rings
    pattern = r'\(\(([^)]+(?:\)[^)]+)*)\)\)'
    polygon_matches = re.findall(r'\(\(([^\(\)]*(?:\([^\)]*\)[^\(\)]*)*)\)\)', inner)

    if not polygon_matches:
        # Try simpler pattern for single polygon
        coords_str = inner.strip("() ")
        polygon_matches = [coords_str]

    for poly_str in polygon_matches:
        rings = []
        # Split into rings (outer boundary and holes)
        ring_strs = poly_str.split("), (")

        for ring_str in ring_strs:
            ring_str = ring_str.strip("() ")
            coords = []

            # Split by comma and parse each coordinate pair
            for coord_pair in ring_str.split(", "):
                parts = coord_pair.strip().split()
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        coords.append([lon, lat])
                    except ValueError:
                        continue

            if coords:
                rings.append(coords)

        if rings:
            polygons.append(rings)

    return polygons


def csv_to_geojson(csv_path, output_path):
    """Convert the supervisor districts CSV to GeoJSON."""
    features = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Parse the polygon
            polygon_wkt = row.get('polygon', '')
            if not polygon_wkt:
                continue

            polygons = parse_multipolygon(polygon_wkt)

            if not polygons:
                print(f"Warning: Could not parse polygon for district {row.get('sup_dist', 'unknown')}")
                continue

            # Create GeoJSON feature
            feature = {
                "type": "Feature",
                "properties": {
                    "sup_name": row.get('sup_name', ''),
                    "sup_dist": row.get('sup_dist', ''),
                    "sup_dist_name": row.get('sup_dist_name', ''),
                    "sup_dist_num": row.get('sup_dist_num', ''),
                },
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": polygons
                }
            }

            features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f)

    print(f"Created GeoJSON with {len(features)} features at {output_path}")
    return geojson


if __name__ == "__main__":
    csv_path = os.path.expanduser("~/Downloads/Supervisor_Districts_(2022)_20260113.csv")
    output_path = os.path.join(os.path.dirname(__file__), "public", "supervisor_districts.geojson")

    csv_to_geojson(csv_path, output_path)
