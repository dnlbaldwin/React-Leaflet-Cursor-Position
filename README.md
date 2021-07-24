# react-leaflet-cursor-position

This package provides a dumb leaflet control box at one of the corners of the map to indicate the current map centre, as well as the current cursor position. It can be styled with custom css as part of props. The following position formats are supported

- Lat/Lng (Decimal)
- Lat/Lng (DMS)
- MGRS
- GARS

See the live demo [HERE](https://dnlbaldwin.github.io/React-Leaflet-Cursor-Position/)

## Prerequistites

This package uses react-leaflet-v3. It is not tested with react-leaflet-v2

## Usage

```js
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
```
