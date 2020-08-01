export interface IPosition {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface ISnappedPoint {
  position: IPosition;
  originalIndex: number;
  placeId: string;
}

export function stringifyCoordinates(coordinate: {
  longitude: number;
  latitude: number;
}) {
  return `${coordinate.latitude},${coordinate.longitude}`.trim();
}
