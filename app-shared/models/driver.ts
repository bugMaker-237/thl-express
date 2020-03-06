import { IPosition } from '@apps.common/models';

export interface IDriver {
  firstName: string;
  lastName?: string;
  picture?: string;
  matricule?: string;
  phoneNumber?: string;
  location?: IPosition;
}
