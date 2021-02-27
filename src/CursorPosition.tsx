import { LeafletMouseEvent, Map } from 'leaflet';
// Ignore missing type definitions
// @ts-ignore
import { forward } from 'mgrs';
import { CSSProperties, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

enum GeoStandards {
  latLng,
  dms,
  mgrs,
}
// TODO - GARS
let currentGeoStandard: GeoStandards = GeoStandards.mgrs;

function getPosition(lat: number, lng: number) {
  let result: string = '';
  if (currentGeoStandard === GeoStandards.latLng) {
    const latCardinal = lat >= 0 ? 'N' : 'S';
    const lngCardinal = lng >= 0 ? 'E' : 'W';
    result =
      Math.abs(lng).toFixed(4).toString() + ' ' + lngCardinal + ' ' + lat.toFixed(4).toString() + ' ' + latCardinal;
  } else if (currentGeoStandard === GeoStandards.dms) {
    result = convertDMS(lat, lng);
  } else if (currentGeoStandard === GeoStandards.mgrs) {
    let temp = forward([lng, lat], 4);
    const gzd = temp.slice(0, 3);
    const hk = temp.slice(3, 5);
    const easting = temp.slice(5, 9);
    const northing = temp.slice(9, 13);

    return gzd + ' ' + hk + ' ' + easting + ' ' + northing;
  } else {
    console.error('Unknown GeoStandard selected');
  }
  return result;
}

function toDegreesMinutesAndSeconds(coordinate: number) {
  let absolute = Math.abs(coordinate);
  let degrees = Math.floor(absolute);
  let minutesNotTruncated = (absolute - degrees) * 60;
  let minutes = Math.floor(minutesNotTruncated);
  let seconds = ((minutesNotTruncated - minutes) * 60).toFixed(0);
  return degrees + '° ' + minutes + "' " + seconds + '"';
}

function convertDMS(lat: number, lng: number) {
  const latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = toDegreesMinutesAndSeconds(lng);
  const longitudeCardinal = lng >= 0 ? 'E' : 'W';

  return latitude + ' ' + latitudeCardinal + ' ' + longitude + ' ' + longitudeCardinal;
}

const CursorPosition = () => {
  let map: Map = useMap();

  const [currentCursorLatLng, setCurrentCursorLatLng] = useState({ lat: 0, lng: 0 });

  const [currentCentreLatLng, setCurrentCentreLatLng] = useState({ lat: 0, lng: 0 });

  const [cursorPosition, setCursorPosition] = useState('');

  const [centrePosition, setCentrePosition] = useState(forward([map.getCenter().lng, map.getCenter().lat], 4));

  function changeGeoStandard() {
    if (currentGeoStandard === GeoStandards.mgrs) {
      currentGeoStandard = GeoStandards.latLng;
    } else if (currentGeoStandard === GeoStandards.latLng) {
      currentGeoStandard = GeoStandards.dms;
    } else if (currentGeoStandard === GeoStandards.dms) {
      currentGeoStandard = GeoStandards.mgrs;
    }
    setCentrePosition(getPosition(currentCursorLatLng.lat, currentCursorLatLng.lng));
    setCursorPosition(getPosition(currentCentreLatLng.lat, currentCentreLatLng.lng));
  }

  useMapEvents({
    mousemove: (e: LeafletMouseEvent) => {
      let latLng = e.latlng;
      setCurrentCursorLatLng(latLng);
      setCursorPosition(getPosition(latLng.lat, latLng.lng));

      latLng = map.getCenter();
      setCurrentCentreLatLng(latLng);
      setCentrePosition(getPosition(latLng.lat, latLng.lng));
    },
    move: () => {
      const latLng = map.getCenter();
      setCentrePosition(getPosition(latLng.lat, latLng.lng));
    },
    mouseout: () => {
      setCursorPosition('Off Map');
    },
  });

  let style: CSSProperties = {
    marginBottom: '20px',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    outline: 'none',
    fontSize: '14px',
    boxShadow: 'none',
    color: '#333',
    padding: '2px 2px',
    minHeight: '18px',
    cursor: 'pointer',
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar" style={style}>
        <table>
          <tbody>
            <tr>
              <td rowSpan={2} onClick={changeGeoStandard}>
                ⟳
              </td>
              <td>Cursor: </td>
              <td>{cursorPosition}</td>
            </tr>
            <tr>
              <td>Centre: </td>
              <td>{centrePosition}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CursorPosition;
