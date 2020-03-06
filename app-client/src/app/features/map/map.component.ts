import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Page, View } from 'tns-core-modules/ui/page/page';
import { Color } from 'tns-core-modules/color';
import { alert } from 'tns-core-modules/ui/dialogs';
import {
  Button,
  StackLayout,
  AnimationDefinition,
  AbsoluteLayout
} from 'tns-core-modules/ui';
import {
  MapView,
  Marker,
  Position,
  Polyline
} from 'nativescript-google-maps-sdk';
import { getNativeApplication } from 'tns-core-modules/application/application';
import { ad } from 'tns-core-modules/utils/utils';
import { GooglePlaces, GoogleDirections } from '@apps.common/services';
import {
  IPlacePredilection,
  IPlace,
  IRoute,
  IPosition,
  ViewState
} from '@apps.common/models';

import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { default as mapStyle } from './map-style.json';
import { getViewStates } from './view-states';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from 'tns-core-modules/image-source';
import { screen } from 'tns-core-modules/platform';
import { DriverService } from '@app.shared/services/driver.service';
import { IDriver } from '@app.shared/models/driver';
import { RouterExtensions } from 'nativescript-angular/router';

interface TAnimation {
  definition: AnimationDefinition;
  view: View;
}

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('autocomplete1', { static: true })
  autocomplete1: RadAutoCompleteTextViewComponent;
  @ViewChild('autocomplete2', { static: true })
  autocomplete2: RadAutoCompleteTextViewComponent;
  @ViewChild('state1', { static: true })
  state1: ElementRef<Button>;
  @ViewChild('state2', { static: true })
  state2: ElementRef<StackLayout>;
  @ViewChild('state3', { static: true })
  state3: ElementRef<StackLayout>;
  @ViewChild('state4', { static: true })
  state4: ElementRef<StackLayout>;
  @ViewChild('state5', { static: true })
  state5: ElementRef<StackLayout>;
  @ViewChild('absoluteLayout', { static: true })
  absoluteLayout: ElementRef<AbsoluteLayout>;

  public latitude = 4.0832;
  public longitude = 9.7803;
  public zoom = 15;
  public minZoom = 0;
  public maxZoom = 100;
  public bearing = 0;
  public tilt = 0;
  public padding = [10, 10, 10, 10];
  public currentRouteDistance: string;
  public selectedDriver: IDriver = { firstName: '' };

  private driverMarkers: Marker[] = [];
  private placesFieldWereDirty = false;
  private currentViewState: ViewState<TAnimation>;
  private viewStates: ViewState<TAnimation>[] = [];
  private mapView: MapView;
  private startPoint: IPlace;
  private endPoint: IPlace;
  private lastCamera: String;
  private gp: GooglePlaces;
  private gd: GoogleDirections;
  private curRt: IRoute = {
    distance: {},
    bounds: {},
    duration: {}
  } as any;
  private kmPrice = 5;

  set currentRoute(value: IRoute) {
    this.curRt = value;
    this.currentRouteDistance = this.curRt ? this.curRt.distance.text : '';
  }
  get currentRoute() {
    return this.curRt;
  }

  constructor(
    private _driverService: DriverService,
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {
    // using pixels and screen scale top align element at the bottom of absoluteLayout
    this.state3.nativeElement.top = screen.mainScreen.heightDIPs - 56 - 100;

    this.registerViewStates();

    const GAK = getNativeApplication()
      .getApplicationContext()
      .getString(ad.resources.getStringId('nativescript_google_maps_api_key'));

    this.gp = new GooglePlaces(GAK);
    this.gd = new GoogleDirections(GAK);
    this.autocomplete1.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
    this.autocomplete2.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
  }
  registerViewStates() {
    // It seems as if due to HRM webpack only loads viewStates.json once at
    // the start of debuging during hot reloading
    // for production this is not an issue but for dev purpose we use this if:

    this.viewStates = getViewStates().map(vs => {
      vs.animations.forEach(a => {
        a.view = this[a.view].nativeElement;
      });
      return vs as any;
    });
  }

  private getPlacesPromise() {
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
    // have to check if the 2 textView fields have been dirtied before clearing
    // or else when ever user will be initially typing the origin and destination
    // it will try to clean the map
    if (
      (this.autocomplete1.nativeElement.text === '' ||
        this.autocomplete2.nativeElement.text === '') &&
      this.placesFieldWereDirty
    ) {
      this.toggleState(0);
      this.clearMap();
      this.placesFieldWereDirty = false;
    } else {
      this.placesFieldWereDirty =
        this.autocomplete1.nativeElement.text !== '' &&
        this.autocomplete2.nativeElement.text !== '';
    }
  }
  setCarPositions() {
    this._driverService
      .getAvailableDrivers(this.startPoint, this.endPoint)
      .subscribe(res => {
        this.mapView.removeMarker(...this.driverMarkers);
        const driverMarkersPromises = [];
        res.forEach(d => {
          driverMarkersPromises.push(
            this.drawMaker(this.mapView, d.location, 3, 'Transporteur', {
              isDriver: true,
              driver: d
            })
          );
        });
        Promise.all(driverMarkersPromises).then(markers => {
          this.driverMarkers.push(...markers);
          console.log(markers);
          this.toggleState(3);
        });
      });
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
        this.doZoom(this.mapView);
        this.currentRoute = dirs[0];
        // closes keyboard
        ad.dismissSoftInput();

        this.toggleState(1);
      }
    } catch (e) {
      alert(e.message);
    }
  }
  toggleState(stateOrder: number) {
    this.currentViewState = this.viewStates.find(x => x.order === stateOrder);
    console.log(this.viewStates.map(v => v.order));
    if (!!this.currentViewState && this.currentViewState.animations) {
      this.currentViewState.animations.forEach(a =>
        a.view.animate(a.definition)
      );
    }
  }
  payTrip() {
    this._router.navigate(['/app-shell/pay-service'], {
      transition: {
        name: 'slide'
      }
    });
  }
  private clearMap() {
    this.mapView.removeAllMarkers();
    this.mapView.removeAllShapes();
  }
  private drawRoute(mapView: MapView, dirs: IRoute[]) {
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
  private async drawMaker(
    mapView: MapView,
    place: IPosition,
    index: number,
    title = '',
    userData = null
  ): Promise<Marker> {
    try {
      const marker = new Marker();
      marker.position = Position.positionFromLatLng(
        place.latitude,
        place.longitude
      );
      marker.title = title || (index === 0 ? 'Départ' : 'Arrivé');
      marker.snippet = place.name;

      const image: Image = new Image();
      let imgSrc: ImageSource;
      if (index === 1) {
        imgSrc = await ImageSource.fromFile('~/assets/finish.png');
      } else if (index === 0) {
        imgSrc = await ImageSource.fromFile('~/assets/arrived.png');
      } else {
        imgSrc = await ImageSource.fromFile('~/assets/bike.png');
      }
      image.imageSource = imgSrc;
      marker.icon = image;
      marker.userData = userData;
      mapView.addMarker(marker);
      marker.showInfoWindow();
      return marker;
    } catch (e) {
      alert(e.message);
      return;
    }
    // this.mapView.
  }

  private doZoom(mapView: MapView) {
    const builder = new (com.google
      .android as any).gms.maps.model.LatLngBounds.Builder();
    mapView.findMarker(marker => {
      builder.include(marker.android.getPosition());
      return false;
    });

    const bounds = builder.build();
    const padding = 200;
    const cu = (com.google
      .android as any).gms.maps.CameraUpdateFactory.newLatLngBounds(
      bounds,
      padding
    );
    this.mapView.gMap.animateCamera(cu);
  }
  getRoutePrice() {
    return this.kmPrice * this.currentRoute.distance.value;
  }
  onMapReady(event) {
    this.mapView = event.object as MapView;
    this.mapView.setStyle(mapStyle as any);
  }

  onMarkerEvent(args) {
    const marker = args.marker as Marker;
    console.log(marker.userData);
    if (marker.userData && marker.userData.isDriver) {
      this.selectedDriver = marker.userData.driver;
      this.toggleState(4);
    }
  }
}
