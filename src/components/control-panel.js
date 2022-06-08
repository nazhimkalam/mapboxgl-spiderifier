import area from '@turf/area';
import { useEffect } from 'react';
import React from "react";

const ControlPanel = (props) => {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  useEffect(() => {
    console.log("polygons changed", props.polygons);
  }, [props.polygons]);
  
  return (
    <div className="control-panel">
      <h3>Draw Polygon</h3>
      {polygonArea > 0 && (
        <p>
          {Math.round(polygonArea * 100) / 100} <br />
          square meters
        </p>
      )}
    </div>
  );
}

export default ControlPanel