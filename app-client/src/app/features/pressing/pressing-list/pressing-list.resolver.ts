import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IPressingListItem } from '~/app/models/pressing';
import { PressingService } from '~/app/features/pressing/pressing.service';
import { PaginatedData } from '@apps.common/models';

@Injectable()
export class PressingListResolver
  implements Resolve<PaginatedData<IPressingListItem>> {
  constructor(private _pressingService: PressingService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ):
    | Observable<PaginatedData<IPressingListItem>>
    | Promise<PaginatedData<IPressingListItem>>
    | PaginatedData<IPressingListItem> {
    return this._pressingService.getPressings();
  }
}
