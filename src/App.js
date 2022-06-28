import { clusterLayer, clusterCountLayer, unclusteredPointLayer, selectedCoordinatesLayer } from "./components/layers";
import React, { useState, useEffect, useRef } from "react";
import MapGL, { Marker, Source, Layer } from "react-map-gl";
import { Editor, DrawPolygonMode } from "react-map-gl-draw";
import inside from "point-in-polygon";
import { ImLocation } from "react-icons/im";
import "./style.css";
import _ from "lodash";

const MAPBOX_TOKEN = "pk.eyJ1Ijoia2Vpbm8iLCJhIjoiOE5oc094SSJ9.DHxjhFy2Ef33iP8yqIm5cA";

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: 23,
  latitude: 23,
  zoom: 3,
};

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [23.3, 21.3] },
      properties: { id: "lsadf;k", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;rk", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;re", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;te", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;rk", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;re", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;te", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;rk", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;re", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [14, 20] },
      properties: { id: "lsadf;te", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [10, 30] },
      properties: { id: "lsadf;rr", toggle: false },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [10, 30] },
      properties: { id: "lsadf;xr", toggle: false },
    },
  ],
};

export default function App() {
  const [spiderifierMarkers, setSpiderifierMarkers] = useState([]);
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [features, setFeatures] = useState([]);
  const [markers, setMarkers] = useState({});
  const [mode, setMode] = useState(null);
  const mapRef = useRef(null);

  const updateViewport = (viewport) => {
    setViewport(viewport);
  };

  useEffect(() => {
    if (geojson.features) {
      setMarkers(geojson);
    }
  }, [geojson]);

  const handleUpdate = (val) => {
    setFeatures(val.data);

    if (val.editType === "addFeature") {
      const polygon = val.data[0].geometry.coordinates[0];
      const newMarkers = markers.features.map((marker, i) => {
        const { geometry } = marker;
        const { coordinates } = geometry;
        
        let longitude = coordinates[0];
        let latitude = coordinates[1];

        const isInsidePolygon = inside([longitude, latitude], polygon);

        return { ...marker, properties: { ...marker.properties, toggle: isInsidePolygon } };
      });

      const updatedMarker = { ...markers, features: newMarkers };
      setMarkers(updatedMarker);
      setFeatures([]);
      setMode(null);
    }
  };

  const handleModeChange = () => {
    setMode(new DrawPolygonMode());
  };

  const onClick = (event) => {
    const isClusterArea = event.features[0].properties.cluster;

    if (isClusterArea) {
      const number_of_coordinates = event.features[0].properties.point_count;
      const cluster_coordinates = event.features[0].geometry.coordinates;

      var target_lat = cluster_coordinates[0];
      var target_lng = cluster_coordinates[1];

      var min_difference_lat = 999;
      var min_difference_lng = 999;
      var closest_marker_coordinates = [];

      markers.features.forEach((marker) => {
        const { geometry } = marker;
        const { coordinates } = geometry;
        
        const marker_lat = coordinates[0];
        const lat_calc_difference = Math.abs(marker_lat - target_lat);

        if (lat_calc_difference < min_difference_lat || min_difference_lat === 0) {
          min_difference_lat = lat_calc_difference;
          
          var closestMarker = findClosestLng( marker_lat, min_difference_lng, target_lng).geometry;
          var closestMarkerCoordinates = closestMarker.coordinates;

          closest_marker_coordinates = [closestMarkerCoordinates[0], closestMarkerCoordinates[1]];
        }
      });

      var count = 0;
      markers.features.forEach((marker) => {
        const { geometry } = marker;
        const { coordinates } = geometry;

        const marker_lat = coordinates[0];
        const marker_lng = coordinates[1];
        if (marker_lat === closest_marker_coordinates[0] && marker_lng === closest_marker_coordinates[1]) {
          count++;
        }
      });

      if (count === number_of_coordinates) {
        var listOfMarkers = createNewMarkers(closest_marker_coordinates, number_of_coordinates);
        setSpiderifierMarkers(listOfMarkers);
      } else {
        setSpiderifierMarkers([]);
      }
    } else {
      setSpiderifierMarkers([]);
    }
  };

  const createNewMarkers = (closest_marker_coordinates, number_of_coordinates) => {
    var spiderifier_markers = [];

    for (var index = 1; index < number_of_coordinates + 1; index++) {
      let spiral_lat = closest_marker_coordinates[1] + index * 1 * Math.sin(index * 0.25);
      let spiral_lng = closest_marker_coordinates[0] + index * 2 * Math.cos(index * 0.2);

      let marker = (
        <Marker longitude={spiral_lng} latitude={spiral_lat} anchor="bottom">
          <ImLocation style={{ color: "red", fontSize: "2rem" }} />
        </Marker>
      );

      spiderifier_markers.push(marker);
    }

    return spiderifier_markers;
  };

  const findClosestLng = (targetLat, min_difference_lng, target_lng) => {
    const markersWithTargetLat = markers.features.filter((marker) => marker.geometry.coordinates[0] === targetLat);
    var closestMarker = undefined;

    markersWithTargetLat.forEach((marker) => {
      const { geometry } = marker;
      const { coordinates } = geometry;

      const marker_lng = coordinates[1];
      const lng_calc_difference = Math.abs(marker_lng - target_lng);

      if (lng_calc_difference < min_difference_lng || min_difference_lng === 0) {
        min_difference_lng = lng_calc_difference;
        closestMarker = marker;
      }
    });

    return closestMarker;
  };

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={updateViewport}
      onClick={onClick}
      ref={mapRef}
    >
      <Editor clickRadius={12} mode={mode} onUpdate={handleUpdate} features={features} />

      <Source id="earthquakes" type="geojson" data={markers} cluster={true} clusterMaxZoom={14} clusterRadius={50} >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
        <Layer {...selectedCoordinatesLayer} />
      </Source>

      {spiderifierMarkers}

      <div className="toolbar-wrapper">
        <div className={`tool-wrapper ${mode ? "active" : ""}`} onClick={handleModeChange}>
          XX
        </div>
      </div>
    </MapGL>
  );
}
