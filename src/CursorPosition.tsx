// Ignore missing type definitions
// @ts-ignore
import { forward } from "mgrs";
import { CSSProperties, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const CursorPosition = function () {
  const map = useMap();
  let [cursorMgrs, setCursorMgrs] = useState("");

  let [centreMgrs, setCentreMgrs] = useState(
    forward([map.getCenter().lng, map.getCenter().lat], 4)
  );

  useMapEvents({
    mousemove: (e) => {
      const latLng = e.latlng;
      setCursorMgrs(forward([latLng.lng, latLng.lat], 4));
    },
    move: () => {
      const latLng = map.getCenter();
      setCentreMgrs(forward([latLng.lng, latLng.lat], 4));
    },
    mouseout: () => {
      setCursorMgrs("");
    },
  });

  let style: CSSProperties = {
    marginBottom: "20px",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    outline: "none",
    fontSize: "11px",
    boxShadow: "none",
    color: "#333",
    padding: "2px 2px",
    minHeight: "18px",
    cursor: "pointer",
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar" style={style}>
        Cursor: {cursorMgrs}
        <br />
        Centre: {centreMgrs}
      </div>
    </div>
  );
};

export default CursorPosition;
