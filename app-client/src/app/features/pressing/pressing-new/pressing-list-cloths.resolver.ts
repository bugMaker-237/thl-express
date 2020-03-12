import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IPressingListItem, ICloth } from '~/app/models/pressing';
import { PressingService } from '~/app/features/pressing/pressing.service';

@Injectable()
export class PressingListClothsResolver implements Resolve<ICloth[]> {
  constructor(private _pressingService: PressingService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ):
    | Observable<ICloth[]>
    | Promise<ICloth[]>
    | ICloth[] {
    return this._pressingService.getClothTypes();
  }
}
