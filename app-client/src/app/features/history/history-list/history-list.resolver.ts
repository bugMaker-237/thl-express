import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { IHistoryListItem } from '~/app/models/history';
import { HistoryService } from '~/app/features/history/history.service';

@Injectable()
export class HistoryListResolver implements Resolve<IHistoryListItem[]> {
  constructor(private _historyService: HistoryService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ):
    | Observable<IHistoryListItem[]>
    | Promise<IHistoryListItem[]>
    | IHistoryListItem[] {
    return this._historyService.getHistories(route.parent.params.type);
  }
}
