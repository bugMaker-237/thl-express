import { IPosition } from './position';

export interface IMapRoute {
  summary: string;
  bounds: IBounds;
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  polyline: IPosition[];
}

interface IBounds {
  northeast: Northeast;
  southwest: Southwest;
}
interface Southwest {
  lat: number;
  lng: number;
}
interface Northeast {
  lat: number;
  lng: number;
}
