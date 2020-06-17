import { Component, OnInit } from '@angular/core';
import { JourneyService } from './journey.service';

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
  providers: [JourneyService],
})
export class JourneyComponent implements OnInit {
  constructor(private _journeyService: JourneyService) {}

  ngOnInit() {
    this.refresh();
  }
  refresh() {
    this._journeyService.getCurrentDrives().subscribe({
      next: (journeys) => {
        console.log(journeys);
      },
    });
  }
}
