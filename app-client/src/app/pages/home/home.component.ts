import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { IUser } from '@app.shared/models';
@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('MapView', { static: false }) mapView: ElementRef;
  constructor(private page: Page) {}

  ngOnInit(): void {}

  onMapReady(event) {
    console.log('Map Ready');
  }
}
