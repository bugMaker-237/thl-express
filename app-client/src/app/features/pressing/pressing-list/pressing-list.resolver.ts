import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IPressingListItem } from '~/app/models/pressing';
import { PressingService } from '~/app/features/pressing/pressing.service';

@Injectable()
export class PressingListResolver implements Resolve<IPressingListItem[]> {
  constructor(private _pressingService: PressingService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ):
    | Observable<IPressingListItem[]>
    | Promise<IPressingListItem[]>
    | IPressingListItem[] {
    return this._pressingService.getPressings();
  }
}
