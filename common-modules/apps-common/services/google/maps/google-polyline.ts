/**
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 */
export class Polyline {
  constructor() {}
  /**
   * Decodes to a [latitude, longitude] coordinates array.
   *
   * This is adapted from the implementation in Project-OSRM.
   *
   * @param {String} str
   * @param {Number} precision
   * @returns {Array}
   *
   * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
   */
  static decode(str: string, precision: number = 5): Array<number[]> {
    let index = 0,
      lat = 0,
      lng = 0,
      shift = 0,
      result = 0,
      byte = null,
      latitude_change: number,
      longitude_change: number;
    const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5),
      coordinates = [];
    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 0;
      result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        // tslint:disable-next-line: no-bitwise
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      // tslint:disable-next-line: no-bitwise
      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
      shift = result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        // tslint:disable-next-line: no-bitwise
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      // tslint:disable-next-line: no-bitwise
      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;
      lat += latitude_change;
      lng += longitude_change;
      coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates;
  }
  /**
   * Encodes the given [latitude, longitude] coordinates array.
   *
   * @param {Array.<Array.<Number>>} coordinates
   * @param {Number} precision
   * @returns {String}
   */
  static encode(coordinates: Array<Array<number>>, precision: number): string {
    if (!coordinates.length) {
      return '';
    }
    const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
    let output =
      Polyline.encodeInner(coordinates[0][0], 0, factor) +
      Polyline.encodeInner(coordinates[0][1], 0, factor);
    for (let i = 1; i < coordinates.length; i++) {
      const a = coordinates[i],
        b = coordinates[i - 1];
      output += Polyline.encodeInner(a[0], b[0], factor);
      output += Polyline.encodeInner(a[1], b[1], factor);
    }
    return output;
  }
  /**
   * Encodes a GeoJSON LineString feature/geometry.
   *
   * @param {Object} geojson
   * @param {Number} precision
   * @returns {String}
   */
  static fromGeoJSON(geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
      geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
      throw new Error('Input must be a GeoJSON LineString');
    }
    return Polyline.encode(Polyline.flipped(geojson.coordinates), precision);
  }
  /**
   * Decodes to a GeoJSON LineString geometry.
   *
   * @param {String} str
   * @param {Number} precision
   * @returns {Object}
   */
  static toGeoJSON(str, precision) {
    const coords = Polyline.decode(str, precision);
    return {
      type: 'LineString',
      coordinates: Polyline.flipped(coords)
    };
  }

  private static py2_round(value) {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
  }

  private static encodeInner(current, previous, factor) {
    current = Polyline.py2_round(current * factor);
    previous = Polyline.py2_round(previous * factor);
    let coordinate = current - previous;
    // tslint:disable-next-line: no-bitwise
    coordinate <<= 1;
    if (current - previous < 0) {
      // tslint:disable-next-line: no-bitwise
      coordinate = ~coordinate;
    }
    let output = '';
    while (coordinate >= 0x20) {
      // tslint:disable-next-line: no-bitwise
      output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
      // tslint:disable-next-line: no-bitwise
      coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
  }

  private static flipped(coords) {
    const flipped = [];
    for (let i = 0; i < coords.length; i++) {
      flipped.push(coords[i].slice().reverse());
    }
    return flipped;
  }
}
