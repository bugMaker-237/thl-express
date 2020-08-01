import { Component, OnInit } from '@angular/core';
import { IPosition, IMapRoute } from '@apps.common/models';
import {
  MapView,
  Marker,
  Position,
  Polyline,
} from 'nativescript-google-maps-sdk';
import { IHistory } from '~/app/models/history';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'tns-core-modules/color/color';
import { Loader } from '@apps.common/services';
import { drawRoute, drawMarker, doZoom } from '~/app/utils/map';
import { GlobalStoreService } from '@apps.common/services';
import { default as mapStyle } from '../../map/map-style.json';

@Component({
  selector: 'history-details',
  templateUrl: 'history-details.component.html',
  styleUrls: ['history-details.component.scss'],
})
export class HistoryDetailsComponent implements OnInit {
  history: IHistory = {
    driver: {
      user: {},
    },
    packet: {},
    pressing: {},
    originPosition: {
      latitude: 4.049862,
      longitude: 9.695213,
    },
  } as any;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    Loader.default.show();
  }

  onMapReady(event) {
    const mapView = event.object as MapView;
    mapView.setStyle(mapStyle as any);
    this._activatedRoute.data.subscribe({
      next: async (data: {
        itemAndMapRoute: { item: IHistory; mapRoute: IMapRoute[] };
      }) => {
        const { item, mapRoute } = data.itemAndMapRoute;
        item.packet = item.packet || ({} as any);
        item.pressing = item.pressing || ({} as any);
        this.history = item;
        // // console.log(item);
        await Promise.all([
          drawMarker(mapView, item.originPosition, 0, '', null, true),
          drawMarker(mapView, item.destinationPosition, 1, '', null, true),
        ]).then((_) => {
          drawRoute(mapView, mapRoute);
          doZoom(mapView, 20);
          Loader.default.hide();
        });
      },
    });
  }
}
