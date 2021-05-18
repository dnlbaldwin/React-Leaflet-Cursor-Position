import { GarsPrecision, llToGars } from 'gars-utils';
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
  gars,
}
let currentGeoStandard: GeoStandards = GeoStandards.mgrs;

/**
 * MGRS's forward function returns the MGRS string without any whitespace
 * separating the component values.  This function splits them up.
 *
 * @param lat - Decimal Latitude value
 * @param lng - Decimal Longitude value
 * @returns MGRS String in format: (NNL LL NNNN NNNN)
 */
function llToFormattedMgrs(lat: number, lng: number) {
  let temp = forward([lng, lat], 4);
  const gzd = temp.slice(0, 3);
  const hk = temp.slice(3, 5);
  const easting = temp.slice(5, 9);
  const northing = temp.slice(9, 13);
  return gzd + ' ' + hk + ' ' + easting + ' ' + northing;
}

/**
 * Takes a lat/lng and converts it to a specific standard, then formats
 * and returns it as a string.
 *
 * @param lat - Decimal Latitude value
 * @param lng - Decimal Longitude value
 * @returns
 */
function getPosition(lat: number, lng: number) {
  let result: string = '';
  if (currentGeoStandard === GeoStandards.latLng) {
    const latCardinal = lat >= 0 ? 'N' : 'S';
    const lngCardinal = lng >= 0 ? 'E' : 'W';

    let formattedLat = Math.abs(lat).toFixed(4).toString();

    if (Math.abs(lat) < 10) {
      formattedLat = '0' + formattedLat;
    }

    let formattedLng = Math.abs(lng).toFixed(4).toString();

    if (Math.abs(lng) < 10) {
      formattedLng = '00' + formattedLng;
    } else if (Math.abs(lng) < 100) {
      formattedLng = '0' + formattedLng;
    }

    result = formattedLat + ' ' + latCardinal + ' ' + formattedLng + ' ' + lngCardinal;
  } else if (currentGeoStandard === GeoStandards.dms) {
    result = convertDMS(lat, lng);
  } else if (currentGeoStandard === GeoStandards.mgrs) {
    result = llToFormattedMgrs(lat, lng);
  } else if (currentGeoStandard === GeoStandards.gars) {
    result = llToGars({ lat: lat, lng: lng }, GarsPrecision.FiveMinutes);
  } else {
    console.error('Unknown GeoStandard selected');
  }
  return result;
}

function toDegreesMinutesAndSeconds(coordinate: number, isLat: boolean) {
  let absolute = Math.abs(coordinate);
  let degrees = Math.floor(absolute).toString();
  let minutesNotTruncated = (absolute - Math.floor(absolute)) * 60;
  let minutes = Math.floor(minutesNotTruncated).toString();
  let seconds = ((minutesNotTruncated - Math.floor(minutesNotTruncated)) * 60).toFixed(0).toString();

  if (isLat) {
    if (Math.abs(coordinate) < 10) {
      degrees = '0' + degrees;
    }
  } else {
    if (Math.abs(coordinate) < 10) {
      degrees = '00' + degrees;
    } else if (Math.abs(coordinate) < 100) {
      degrees = '0' + degrees;
    }
  }

  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }

  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }

  return degrees + '° ' + minutes + "' " + seconds + '"';
}

function convertDMS(lat: number, lng: number) {
  const latitude = toDegreesMinutesAndSeconds(lat, true);
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = toDegreesMinutesAndSeconds(lng, false);
  const longitudeCardinal = lng >= 0 ? 'E' : 'W';

  return latitude + ' ' + latitudeCardinal + ' ' + longitude + ' ' + longitudeCardinal;
}

// Allowed positions the UI can occupy from the leaflet API
const allowedPositions = [
  'leaflet-bottom leaflet-right',
  'leaflet-bottom leaflet-left',
  'leaflet-top leaflet-right',
  'leaflet-top leaflet-left',
];

interface propsType {
  position: string;
  style: CSSProperties;
}

/**
 * CursorPosition - Functional component which displays the cursor and map position
 * @returns
 */
const CursorPosition = (props: propsType) => {
  const map: Map = useMap();

  const uiPosition = allowedPositions.includes(props.position) ? props.position : 'leaflet-bottom leaflet-right';

  const defaultStyle: CSSProperties = {
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

  const style = props.style || defaultStyle;

  // Storing the proper lat/lng in state becase we need to be able to convert the position
  // when the geo standard is changed
  const [currentCursorLatLng, setCurrentCursorLatLng] = useState({ lat: 0, lng: 0 });
  const [currentCentreLatLng, setCurrentCentreLatLng] = useState({ lat: 0, lng: 0 });

  // The exact values being displayed in the component.  It's needed to have a second set of variables
  // to track this as it won't account for events where the cursor is off map.
  const [cursorPosition, setCursorPosition] = useState('');
  const [centrePosition, setCentrePosition] = useState(llToFormattedMgrs(map.getCenter().lat, map.getCenter().lng));

  function changeGeoStandard() {
    if (currentGeoStandard === GeoStandards.mgrs) {
      currentGeoStandard = GeoStandards.gars;
    } else if (currentGeoStandard === GeoStandards.gars) {
      currentGeoStandard = GeoStandards.latLng;
    } else if (currentGeoStandard === GeoStandards.latLng) {
      currentGeoStandard = GeoStandards.dms;
    } else if (currentGeoStandard === GeoStandards.dms) {
      currentGeoStandard = GeoStandards.mgrs;
    }
    setCentrePosition(getPosition(currentCentreLatLng.lat, currentCentreLatLng.lng));
    setCursorPosition(getPosition(currentCursorLatLng.lat, currentCursorLatLng.lng));
  }

  // Specific map events which will result in an update to the component
  useMapEvents({
    mousemove: (e: LeafletMouseEvent) => {
      let latLng = e.latlng;
      setCurrentCursorLatLng(latLng);
      setCursorPosition(getPosition(latLng.lat, latLng.lng));

      setCurrentCentreLatLng(map.getCenter());
      setCentrePosition(getPosition(map.getCenter().lat, map.getCenter().lng));
    },
    move: (e: any) => {
      const latLng = map.getCenter();
      setCentrePosition(getPosition(latLng.lat, latLng.lng));
    },
    mouseout: () => {
      setCursorPosition('Off Map');
    },
  });

  return (
    <div className={uiPosition}>
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
