import { IPosition } from './position';

export interface IPlacePredilection {
  description: string;
  placeId: string;
  data: string;
}

export interface IPlace extends IPosition {
  name?: string;
  phoneNumber: string;
  formattedAddress: string;
  data: string;
  photoReference?: string;
}
