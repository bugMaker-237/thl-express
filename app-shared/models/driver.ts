import { IPosition } from '@apps.common/models';
import { IUser } from './user';

export interface IDriver {
  id: any;
  picture?: string;
  distance?: number;
  matricule?: string;
  immatriculation?: string;
  user?: IUser;
  location?: IPosition;
}
