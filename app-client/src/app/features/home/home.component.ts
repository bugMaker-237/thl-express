import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { Color } from 'tns-core-modules/color';
import { alert } from 'tns-core-modules/ui/dialogs';
import { Button, StackLayout } from 'tns-core-modules/ui';
import {
  MapView,
  Marker,
  Position,
  Polyline
} from 'nativescript-google-maps-sdk';
import { getNativeApplication } from 'tns-core-modules/application/application';
import { ad } from 'tns-core-modules/utils/utils';
import { GooglePlaces, GoogleDirections } from '@apps.common/services';
import { IPlacePredilection, IPlace, IRoute } from '@apps.common/models';

import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { default as mapStyle } from './map-style.json';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from 'tns-core-modules/image-source';
type ViewState = 0 | 1 | 2;
@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('autocomplete1', { static: true })
  autocomplete1: RadAutoCompleteTextViewComponent;
  @ViewChild('autocomplete2', { static: true })
  autocomplete2: RadAutoCompleteTextViewComponent;
  @ViewChild('orderTrip', { static: true })
  orderTrip: ElementRef<Button>;
  state: ViewState = 0;
  mapView: MapView;
  startPoint: IPlace;
  endPoint: IPlace;
  latitude = 4.0832;
  longitude = 9.7803;
  zoom = 15;
  minZoom = 0;
  maxZoom = 100;
  bearing = 0;
  tilt = 0;
  padding = [10, 10, 10, 10];
  lastCamera: String;
  gp: GooglePlaces;
  gd: GoogleDirections;

  constructor(private page: Page) {}

  ngOnInit(): void {
    const GAK = getNativeApplication()
      .getApplicationContext()
      .getString(ad.resources.getStringId('nativescript_google_maps_api_key'));
    console.log(GAK);
    this.gp = new GooglePlaces(GAK);
    this.gd = new GoogleDirections(GAK);
    this.autocomplete1.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
    this.autocomplete2.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
  }
  ngAfterViewInit() {}
  getPlacesPromise() {
    return async (text: string) => {
      if (text.length > 3) {
        return await this.gp
          .search(text, 'CM')
          .then(res =>
            res.map(p => {
              const t = new TokenModel(p.description, undefined);
              t['data'] = p;
              return t;
            })
          )
          .catch(err => alert(err ? err.message : err));
      } else {
        return Promise.resolve([]);
      }
    };
  }
  onTextChanged(event) {
    if (
      this.autocomplete1.autoCompleteTextView.text === '' ||
      this.autocomplete2.autoCompleteTextView.text === ''
    ) {
      this.toggleOrderButton(false);
    }
  }
  async onDidAutoComplete(
    event: { token: { data: IPlacePredilection } },
    position: number
  ) {
    try {
      if (position === 0) {
        this.startPoint = await this.gp.getPlaceById(event.token.data.placeId);
      } else {
        this.endPoint = await this.gp.getPlaceById(event.token.data.placeId);
      }
      if (this.endPoint && this.startPoint) {
        this.clearMap();
        this.drawMaker(this.mapView, this.startPoint, 0);
        this.drawMaker(this.mapView, this.endPoint, 1);
        console.log('drawing route');
        const dirs = await this.gd.getDirections(
          this.startPoint,
          this.endPoint,
          true,
          'DRIVING'
        );
        this.drawRoute(this.mapView, dirs);
        this.doZoom();
        // closes keyboard
        ad.dismissSoftInput();

        this.toggleOrderButton();
      }
    } catch (e) {
      alert(e.message);
    }
  }
  toggleOrderButton(show = true) {
    this.state = +show as ViewState;
    this.orderTrip.nativeElement.animate({
      height: show ? 64 : 0,
      duration: 700
    });
  }
  clearMap() {
    this.mapView.removeAllMarkers();
    this.mapView.removeAllShapes();
  }
  drawRoute(mapView: MapView, dirs: IRoute[]) {
    const lines: Polyline[] = [];
    dirs.forEach(r => {
      const polyline = new Polyline();
      // const point = Position.positionFromLatLng(startPlace.latitude, startPlace.longitude);
      polyline.addPoints(
        r.polyline.map(p =>
          Position.positionFromLatLng(p.latitude, p.longitude)
        )
      );
      polyline.visible = true;
      polyline.width = 20;
      polyline.color = new Color('#FFD300');
      polyline.geodesic = true;
      lines.push(polyline);
    });
    lines.forEach(l => mapView.addPolyline(l));
  }
  async drawMaker(mapView: MapView, place: IPlace, index: number) {
    try {
      const marker = new Marker();
      marker.position = Position.positionFromLatLng(
        place.latitude,
        place.longitude
      );
      marker.title = index === 0 ? 'Départ' : 'Arrivé';
      marker.snippet = place.name;

      const image: Image = new Image();
      let imgSrc: ImageSource;
      if (index === 1) {
        imgSrc = await ImageSource.fromFile('~/assets/finish.png');
      } else {
        imgSrc = await ImageSource.fromFile('~/assets/arrived.png');
      }
      image.imageSource = imgSrc;
      marker.icon = image;
      marker.showInfoWindow();
      marker.userData = place;
      mapView.addMarker(marker);
    } catch (e) {
      alert(e.message);
    }
    // this.mapView.
  }

  doZoom() {
    const builder = new (com.google
      .android as any).gms.maps.model.LatLngBounds.Builder();
    this.mapView.findMarker(marker => {
      builder.include(marker.android.getPosition());
      return false;
    });

    const bounds = builder.build();
    const padding = 400;
    const cu = (com.google
      .android as any).gms.maps.CameraUpdateFactory.newLatLngBounds(
      bounds,
      padding
    );
    this.mapView.gMap.animateCamera(cu);
    console.log(this.mapView.zoom);
  }
  onMapReady(event) {
    this.mapView = event.object as MapView;
    this.mapView.setStyle(mapStyle as any);
  }

  onCoordinateTapped(args) {
    // console.log(
    //   'Coordinate Tapped, Lat: ' +
    //     args.position.latitude +
    //     ', Lon: ' +
    //     args.position.longitude,
    //   args
    // );
  }

  onMarkerEvent(args) {
    // console.log(
    //   `Marker Event:${args.eventName} triggered on: ${args.marker.title},
    // Lat: ${args.marker.position.latitude}, Lon: ${args.marker.position.longitude}`,
    //   args
    // );
  }

  onCameraChanged(args) {
    // console.log(
    //   'Camera changed: ' + JSON.stringify(args.camera),
    //   JSON.stringify(args.camera) === this.lastCamera
    // );
    // this.lastCamera = JSON.stringify(args.camera);
  }

  onCameraMove(args) {
    // console.log('Camera moving: ' + JSON.stringify(args.camera));
  }
}
