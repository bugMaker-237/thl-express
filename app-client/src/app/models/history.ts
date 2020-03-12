import { IPosition } from '@apps.common/models';
import { IDriver } from '@app.shared/models/driver';

export interface IHistoryListItem {
  id: any;
  date: Date;
  price: number;
  origin: string; // nom du point de départ
  destination: string; // nom du point de d'arrivé
}

export interface IHistory extends IHistoryListItem {
  originPosition: IPosition; // (lat, long) de départ
  destinationPosition: IPosition; // (lat, long) d'arrivé
  state: string; // etat de la course (Annuler, encours, terminé, etc...)
  paimentMethod: string;
  driver: IDriver;
  transportType: string; // type de course
}
