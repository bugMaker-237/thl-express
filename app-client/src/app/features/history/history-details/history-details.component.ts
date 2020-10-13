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
import { DialogService, Loader, ToastService } from '@apps.common/services';
import { drawRoute, drawMarker, doZoom } from '~/app/utils/map';
import { GlobalStoreService } from '@apps.common/services';
import { default as mapStyle } from '../../map/map-style.json';
import { HistoryService } from '../history.service';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs-compat/operator/merge';

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
    journey: {},
  } as any;
  note: number;
  showNote = false;
  comment: string;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _histService: HistoryService,
    private _toastService: ToastService,
    private _translateService: TranslateService
  ) {}

  ngOnInit() {
    Loader.default.show();
  }

  validateNote() {
    if (!this.showNote) {
      this.showNote = true;
    } else {
      this._histService
        .note(this.note, this.comment, this.history.driver.id, this.history.id)
        .subscribe({
          next: () => {
            this._translateService.get('Messages.Common.Saved').subscribe({
              next: (msg) => {
                this._toastService.push({
                  text: msg,
                  data: {
                    backgroundColor: 'primary',
                  },
                });
                this.showNote = false;
              },
            });
          },
        });
    }
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
