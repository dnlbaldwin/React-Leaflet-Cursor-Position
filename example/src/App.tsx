import { CSSProperties } from 'react';
import { LayersControl, LayerGroup, MapContainer, TileLayer } from 'react-leaflet';
import CursorPosition from 'react-leaflet-cursor-position';
// Ignore missing type definitions
// @ts-ignore
import { MgrsGraticule } from 'react-leaflet-mgrs-graticule';
import { GarsGraticule } from 'react-leaflet-gars-graticule';
import LatLngGraticule from 'react-leaflet-lat-lng-graticule';

import './App.css';

const mgrsGraticuleName = 'MGRS';
const garsGraticuleName = 'GARS';
const latLngGraticuleName = 'LAT/LNG';
const overlayEnabled = true;

const uiStyle: CSSProperties = {
  marginBottom: '20px',
  border: '1px solid rgba(0,0,0,0.2)',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
  outline: 'none',
  fontSize: '14px',
  boxShadow: 'none',
  color: '#333',
  padding: '2px 2px',
  minHeight: '18px',
  cursor: 'pointer',
};

function App() {
  return (
    <MapContainer
      center={[45.4, -75.7]}
      zoom={11}
      minZoom={3}
      maxZoom={16}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="ESRI Satellite">
          <TileLayer
            url="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://wiki.openstreetmap.org/wiki/Esri"></a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ESRI Clarity">
          <TileLayer
            url="https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://wiki.openstreetmap.org/wiki/Esri"></a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM Topo">
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="OSM" />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked={overlayEnabled} name={mgrsGraticuleName}>
          <LayerGroup>
            <MgrsGraticule name={mgrsGraticuleName} checked={overlayEnabled} />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name={garsGraticuleName}>
          <LayerGroup>
            <GarsGraticule name={garsGraticuleName} checked={!overlayEnabled} />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name={latLngGraticuleName}>
          <LayerGroup>
            <LatLngGraticule name={latLngGraticuleName} checked={!overlayEnabled} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <CursorPosition position={'leaflet-top lsft'} style={uiStyle} />
    </MapContainer>
  );
}

export default App;
