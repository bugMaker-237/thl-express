import { IPosition } from '@apps.common/models';
import { IDriver } from '@app.shared/models/driver';
import { IPressingListItem } from './pressing';
import { IPacket } from './packet';

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
  packet: IPacket;
  pressing: IPressingListItem;
  transportType: string; // type de course
}

function getFullUrl(part: string, host) {
  if (!part.startsWith('/')) {
    part = '/' + part;
  }
  return host + part;
}
export const FromAPIEntity = (d, endpoint: string): IHistory => ({
  id: d.id,
  date: d.created_at,
  price: d.price,
  origin: d.from,
  destination: d.to,
  originPosition: {
    latitude: d.latfrom,
    longitude: d.lngfrom,
  },
  destinationPosition: {
    latitude: d.latto,
    longitude: d.lngto,
  },
  state: d.status,
  transportType: d.type,
  paimentMethod: null,
  packet: d.packet || {},
  pressing: d.pressing || {},
  driver: {
    id: d.driver.id,
    picture: getFullUrl(d.driver.driver.picture, endpoint),
    user: {
      id: d.driver.driver.id,
      name: d.driver.name,
    } as any,
  },
});
