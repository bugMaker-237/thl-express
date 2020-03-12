import { Component, OnInit } from '@angular/core';
import { IHistoryListItem } from '~/app/models/history';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '~/app/features/history/history.service';

@Component({
  selector: 'history-list',
  styleUrls: ['history-list.component.scss'],
  templateUrl: 'history-list.component.html'
})
export class HistoryListComponent implements OnInit {
  histories: IHistoryListItem[] = [];
  type: string;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _historyService: HistoryService
  ) {}

  ngOnInit() {
    this._activatedRoute.data.subscribe({
      next: (data: { histories: IHistoryListItem[] }) => {
        console.log(data.histories);
        this.histories = data.histories;
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
      next: res => (this.histories = res)
    });
  }
}
