import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IHistoryListItem, IHistory } from '~/app/models/history';
import { HistoryService } from '~/app/features/history/history.service';
import { IMapRoute } from '@apps.common/models';
import { GoogleDirections, getStringResource } from '@apps.common/services';

@Injectable()
export class HistoryDetailsResolver
  implements Resolve<{ item: IHistory; mapRoute: IMapRoute[] }> {
  private gd: GoogleDirections;
  constructor(private _historyService: HistoryService) {
    const GAK = getStringResource('nativescript_google_maps_api_key');
    this.gd = new GoogleDirections(GAK);
  }
  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<{ item: IHistory; mapRoute: IMapRoute[] }> {
    const item = await this._historyService
      .getHistoryDetails(route.params.id)
      .toPromise();
    const mapRoute = await this.gd.getDirections(
      item.originPosition,
      item.destinationPosition,
      true,
      'DRIVING'
    );
    return { item, mapRoute };
  }
}
