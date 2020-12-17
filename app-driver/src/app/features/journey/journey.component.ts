import { Component, OnInit } from '@angular/core';
import { JourneyService } from './journey.service';
import {
  DialogService,
  GenericSubjects,
  GlobalStoreService,
} from '@apps.common/services';
import { IHistory } from '~/app/models/history';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
  providers: [JourneyService],
})
export class JourneyComponent implements OnInit {
  journeys: IHistory[];
  constructor(
    private _journeyService: JourneyService,
    private _router: RouterExtensions,
    private genSub: GenericSubjects,
    private _store: GlobalStoreService
  ) {}

  ngOnInit() {
    this.refresh();
    this.genSub.get('$current-journey', true).subscribe(() => this.refresh());
  }
  refresh() {
    this._journeyService.getCurrentDrives().subscribe({
      next: (journeys) => {
        this.journeys = journeys;
      },
    });
  }

  openDetails(item: IHistory) {
    this._store.set('current-history-item', item);
    this._router.navigate(
      [`app-shell/history/${item.transportType}/details/${item.id}`],
      {
        transition: {
          name: 'slide',
        },
      }
    );
  }
}
