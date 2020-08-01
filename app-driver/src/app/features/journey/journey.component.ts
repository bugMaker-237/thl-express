import { Component, OnInit } from '@angular/core';
import { JourneyService } from './journey.service';
import { DialogService } from '@apps.common/services';

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
  providers: [JourneyService],
})
export class JourneyComponent implements OnInit {
  journeys: [];
  constructor(
    private _journeyService: JourneyService,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.refresh();
  }
  refresh() {
    this._journeyService.getCurrentDrives().subscribe({
      next: (journeys) => {
        this.journeys = journeys;
        // console.log(journeys);
      },
    });
  }
  async closeJourney(item) {
    const res = await this._dialogService.confirm(
      `Cette action est irréversible.`,
      'OK',
      'ANNULER'
    );
    if (res) {
      this._journeyService.closeJourney(item.id).subscribe((_) => ({
        next: () => {
          this.refresh();
        },
      }));
    }
  }
}
