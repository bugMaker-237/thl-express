import { IPlace } from '@root/models/google';

export interface IJourneyRequest {
  driver: any;
  lngfrom: number;
  latfrom: number;
  lngto: number;
  latto: number;
  distance: number;
  placefrom: string;
  placeto: string;
  wishes?: string;
  type: 'COLIS' | 'PERSONNE';
  nature?: string | 'PLIS' | 'AUTRE';
  valeur?: number;
  name?: string;
  phone?: number;
  weight?: number;
}
