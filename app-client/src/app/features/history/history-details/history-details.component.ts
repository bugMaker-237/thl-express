import { Component, OnInit } from '@angular/core';
import { IPosition, IMapRoute } from '@apps.common/models';
import {
  MapView,
  Marker,
  Position,
  Polyline
} from 'nativescript-google-maps-sdk';
import { IHistory } from '~/app/models/history';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'tns-core-modules/color/color';
import { Loader } from '@apps.common/services';
import { drawRoute, drawMarker, doZoom } from '~/app/utils/map';

@Component({
  selector: 'history-details',
  templateUrl: 'history-details.component.html',
  styleUrls: ['history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  history: IHistory = {
    driver: {}
  } as any;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    Loader.default.show();
  }

  onMapReady(event) {
    const mapView = event.object as MapView;
    this._activatedRoute.data.subscribe({
      next: (data: {
        itemAndMapRoute: { item: IHistory; mapRoute: IMapRoute[] };
      }) => {
        const { item, mapRoute } = data.itemAndMapRoute;
        this.history = item;
        drawMarker(mapView, item.originPosition, 0);
        drawMarker(mapView, item.destinationPosition, 0);
        drawRoute(mapView, mapRoute);

        doZoom(mapView);

        Loader.default.hide();
      }
    });
  }
}
