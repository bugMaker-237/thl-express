import { Component, OnInit } from '@angular/core';
import { IHistoryListItem, IHistory } from '~/app/models/history';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '~/app/features/history/history.service';
import { PaginatedData } from '@apps.common/models';
import { RouterExtensions } from 'nativescript-angular/router';
import { GlobalStoreService } from '@apps.common/services';

@Component({
  selector: 'history-list',
  styleUrls: ['history-list.component.scss'],
  templateUrl: 'history-list.component.html'
})
export class HistoryListComponent implements OnInit {
  histories: IHistoryListItem[] = [];
  type: string;
  pagination: {};
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: RouterExtensions,
    private _historyService: HistoryService,
    private _store: GlobalStoreService
  ) {}

  ngOnInit() {
    this._activatedRoute.data.subscribe({
      next: (data: { histories: PaginatedData<IHistory> }) => {
        this.histories = data.histories.data;
      }
    });
    this._activatedRoute.parent.params.subscribe({
      next: params => {
        this.type = params.type;
      }
    });
  }
  loadHistories(paging = 1) {
    this._historyService.getHistories(this.type, paging).subscribe({
      next: res => {
        this.histories = res.data;
        this.pagination = res.pagination;
      }
    });
  }
  openDetails(item: IHistory) {
    this._store.set('current-history-item', item);
    this._router.navigate(
      [`app-shell/history/${this.type}/details/${item.id}`],
      {
        transition: {
          name: 'slide'
        }
      }
    );
  }
}
1