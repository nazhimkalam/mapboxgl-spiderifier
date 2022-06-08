import React, { useState } from "react";
import MapGL, { Marker } from "react-map-gl";
import { Editor, DrawPolygonMode } from "react-map-gl-draw";
import inside from "point-in-polygon";
import 'mapbox-gl/dist/mapbox-gl.css';
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import "./styles.css";

const TOKEN = 'pk.eyJ1Ijoia2Vpbm8iLCJhIjoiOE5oc094SSJ9.DHxjhFy2Ef33iP8yqIm5cA'; // Set your mapbox token here
const PolygonClusterFormation = () => {

  const DEFAULT_VIEWPORT = {
    width: 800,
    height: 600,
    longitude: 23,
    latitude: 23,
    zoom: 3,
  };

  const INIT_MAKERS = [
    { id: "lsadf;rk", longitude: 23.3, latitude: 21.3, toggle: false },
    { id: "lredf;k", longitude: 14, latitude: 20, toggle: false },
    { id: "lsadf;k", longitude: 13, latitude: 23, toggle: false },
  ];

  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [markers, setMarkers] = useState(INIT_MAKERS);
  const [mode, setMode] = useState(null);
  const [features, setFeatures] = useState([]);

  const updateViewport = (viewport) => {
    setViewport(viewport);
  };

  const handleUpdate = (val) => {
    setFeatures(val.data);

    if (val.editType === "addFeature") {
      const polygon = val.data[0].geometry.coordinates[0];
      const newMarkers = markers.map((marker, i) => {
        const { longitude, latitude } = marker;
        const isInsidePolygon = inside([longitude, latitude], polygon);

        return { ...marker, toggle: isInsidePolygon };
      });

      setMarkers(newMarkers);
      setFeatures([]);
      setMode(null);
    }
  };

  const handleModeChange = () => {
    setMode(new DrawPolygonMode());
  };

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken={TOKEN}
      mapStyle={"mapbox://styles/mapbox/light-v9"}
      onViewportChange={updateViewport}
    >
      <Editor
        clickRadius={12}
        mode={mode}
        onUpdate={handleUpdate}
        features={features}
      />

      {/* markers */}
      {markers.map(({ longitude, latitude, toggle, id }) => (
        <Marker key={id} latitude={latitude} longitude={longitude}>
          <span
            style={{
              backgroundColor: toggle ? "red" : "black",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              display: "block",
            }}
          />
        </Marker>
      ))}

      {/* toolbar */}
      <div className="toolbar-wrapper">
        <div
          className={`tool-wrapper ${mode ? "active" : ""}`}
          onClick={handleModeChange}
        >
          <CenterFocusStrongIcon />
        </div>
      </div>
    </MapGL>
  );
};

export default PolygonClusterFormation;
