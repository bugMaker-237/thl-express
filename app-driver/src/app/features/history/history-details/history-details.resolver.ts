import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { IHistoryListItem, IHistory } from '~/app/models/history';
import { HistoryService } from '~/app/features/history/history.service';
import { IMapRoute } from '@apps.common/models';
import { GoogleDirections, getStringResource } from '@apps.common/services';
import { GlobalStoreService, Loader } from '@apps.common/services';
import { map } from 'rxjs/operators';

@Injectable()
export class HistoryDetailsResolver
  implements Resolve<{ item: IHistory; mapRoute: IMapRoute[] }> {
  private gd: GoogleDirections;
  constructor(
    private _historyService: HistoryService,
    private _store: GlobalStoreService
  ) {
    const GAK = getStringResource('nativescript_google_maps_api_key');
    this.gd = new GoogleDirections(GAK);
  }
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{ item: IHistory; mapRoute: IMapRoute[] }> {
    Loader.default.show();
    const item = this._store.get('current-history-item');
    return from(
      this.gd.getDirections(
        item.originPosition,
        item.destinationPosition,
        true,
        'DRIVING'
      )
    ).pipe(
      map(mapRoute => {
        Loader.default.hide();
        return { item, mapRoute };
      })
    );
  }
}
