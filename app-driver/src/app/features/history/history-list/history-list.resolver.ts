import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IHistoryListItem, IHistory } from '~/app/models/history';
import { HistoryService } from '~/app/features/history/history.service';
import { PaginatedData } from '@apps.common/models';

@Injectable()
export class HistoryListResolver implements Resolve<PaginatedData<IHistory>> {
  constructor(private _historyService: HistoryService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ):
    | Observable<PaginatedData<IHistory>>
    | Promise<PaginatedData<IHistory>>
    | PaginatedData<IHistory> {
    return this._historyService.getHistories(route.parent.params.type);
  }
}
