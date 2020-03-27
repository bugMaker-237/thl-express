import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Inject
} from '@angular/core';
import { Page, View } from 'tns-core-modules/ui/page/page';
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
import {
  GooglePlaces,
  GoogleDirections,
  getStringResource,
  GlobalStoreService,
  DialogService,
  MailService,
  PlatformService,
  Loader
} from '@apps.common/services';
import {
  IPlacePredilection,
  IPlace,
  IMapRoute,
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
import { clearMap, drawMarker, drawRoute, doZoom } from '~/app/utils/map';
import { ActivatedRoute } from '@angular/router';
import { IPacket } from '~/app/models/packet';
import { Settings } from '@app.shared/models';
import { SettingsService } from '@app.shared/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { IJourneyRequest } from './journey';
import { JourneyService } from './journey.service';

interface TAnimation {
  definition: AnimationDefinition;
  view: View;
}

@Component({
  selector: 'map',
  moduleId: module.id,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [JourneyService]
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
  public selectedDriver: IDriver = { id: null, user: { name: '' } as any };
  public wishes: string;
  public type: string;

  private placesFieldWereDirty = false;
  private currentViewState: ViewState<TAnimation>;
  private viewStates: ViewState<TAnimation>[] = [];
  private mapView: MapView;
  private origin: IPlace;
  private destination: IPlace;
  private lastCamera: String;
  private gp: GooglePlaces;
  private gd: GoogleDirections;
  private curRt: IMapRoute = {
    distance: {},
    bounds: {},
    duration: {}
  } as any;
  private kmPrice = 0;
  private isPacketTransportation: boolean;
  private packet: IPacket;

  set currentMapRoute(value: IMapRoute) {
    this.curRt = value;
    this.currentRouteDistance = this.curRt ? this.curRt.distance.text : '';
  }
  get currentMapRoute() {
    return this.curRt;
  }

  constructor(
    @Inject(APP_CONFIG) private _appConfig: IAppConfig,
    private _driverService: DriverService,
    private _router: RouterExtensions,
    private _activatedRoute: ActivatedRoute,
    private _store: GlobalStoreService,
    private _settingsService: SettingsService,
    private _dialogService: DialogService,
    private _platformService: PlatformService,
    private _mailService: MailService,
    private _journeyService: JourneyService
  ) {}

  ngOnInit(): void {
    Loader.default.show();
    // using pixels and screen scale top align element at the bottom of absoluteLayout
    this.state3.nativeElement.top = screen.mainScreen.heightDIPs - 56 - 100;
    this.registerViewStates();
    const GAK = getStringResource('nativescript_google_maps_api_key');
    this.gp = new GooglePlaces(GAK);
    this.gd = new GoogleDirections(GAK);
    this.autocomplete1.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
    this.autocomplete2.autoCompleteTextView.loadSuggestionsAsync = this.getPlacesPromise();
    this.initialise();
  }
  initialise() {
    this._activatedRoute.params.subscribe({
      next: params => {
        this.type = params.type;
        this.toggleState(0);
        clearMap(this.mapView);
        this.autocomplete1.nativeElement.text = '';
        this.autocomplete2.nativeElement.text = '';
        this.autocomplete1.nativeElement.focus();
        this.origin = null;
        this.destination = null;
      }
    });
    this._activatedRoute.queryParams.subscribe({
      next: queryParams => {
        this.isPacketTransportation = queryParams.isPacketTransportation;
        this.packet = this._store.get('current-packet-packet');
        const settings = this._settingsService.settings;
        if (this.isPacketTransportation) {
          if (this.packet.nature === 'PLIS') {
            this.kmPrice = settings.plisfermeprice;
          } else {
            this.kmPrice = settings.autrecolisprice;
          }
        } else {
          this.kmPrice = settings.kmprice;
        }
      }
    });
  }

  registerViewStates() {
    // It seems as if due to HRM webpack only loads viewStates.json once at
    // the start of debuging during hot reloading
    // so we instead use a fonction that returns the list of view-states

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
          .catch(err => this._dialogService.alert(err ? err.message : err));
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
      clearMap(this.mapView);
      this.placesFieldWereDirty = false;
    } else {
      this.placesFieldWereDirty =
        this.autocomplete1.nativeElement.text !== '' &&
        this.autocomplete2.nativeElement.text !== '';
    }
  }
  setBikePositions() {
    this._driverService
      .getAvailableDrivers(this.type, this.origin)
      .subscribe(res => {
        if (res.length === 0) {
          this._dialogService.alert(
            "Aucun transporteur disponible dans cette zone pour l'instant, patientez, puis réessayé"
          );
        } else {
          const driverMarkersPromises = [];
          res.forEach(d => {
            driverMarkersPromises.push(
              drawMarker(this.mapView, d.location, 3, 'Transporteur', {
                isDriver: true,
                driver: d
              })
            );
          });
          Promise.all(driverMarkersPromises).then(markers => {
            this.toggleState(3);
          });
        }
      });
  }
  async onDidAutoComplete(
    event: { token: { data: IPlacePredilection } },
    position: number
  ) {
    try {
      if (position === 0) {
        this.origin = await this.gp.getPlaceById(event.token.data.placeId);
      } else {
        this.destination = await this.gp.getPlaceById(event.token.data.placeId);
      }
      if (this.destination && this.origin) {
        clearMap(this.mapView);
        drawMarker(this.mapView, this.origin, 0);
        drawMarker(this.mapView, this.destination, 1);
        const dirs = await this.gd.getDirections(
          this.origin,
          this.destination,
          true,
          'DRIVING'
        );
        drawRoute(this.mapView, dirs);
        doZoom(this.mapView);
        this.currentMapRoute = dirs[0];

        // closes keyboard
        ad.dismissSoftInput();

        this.toggleState(1);
      }
    } catch (e) {
      this._dialogService.confirm(e.message, 'REPORT', 'CONTINUE').then(res => {
        if (res) {
          let error = this._platformService.getAllDeviceInfo();
          error += e.stack || '';
          this._mailService.compose({
            subjectSuffix: 'MAP - ISSUE',
            attachments: [
              {
                fileName: 'Platform & error details',
                mimeType: 'text/plain',
                path: 'base64://' + error
              }
            ],
            body: e.message,
            to: this._appConfig.contacts.issue
          });
        }
      });
    }
  }
  toggleState(stateOrder: number) {
    this.currentViewState = this.viewStates.find(x => x.order === stateOrder);
    if (!!this.currentViewState && this.currentViewState.animations) {
      this.currentViewState.animations.forEach(a =>
        a.view.animate(a.definition)
      );
    }
  }
  payTrip() {
    this._journeyService
      .saveJourney(
        this.currentMapRoute,
        this.selectedDriver,
        this.origin,
        this.destination,
        this.wishes,
        this.isPacketTransportation,
        this.packet
      )
      .subscribe({
        next: res => {
          this._store.set('ONGOING_PAYMENT', {
            type: 'journey',
            journeyId: res.id,
            origin: this.origin,
            destination: this.destination,
            price: this.getRoutePrice(),
            redirectUrl: '../history/JOURNEY'
          });
          this._router.navigate(['../../pay-service'], {
            transition: {
              name: 'slide'
            },
            relativeTo: this._activatedRoute
          });
        }
      });
  }

  getRoutePrice() {
    return Math.ceil(
      this.kmPrice * (this.currentMapRoute.distance.value / 1000)
    );
  }
  onMapReady(event) {
    this.mapView = event.object as MapView;
    this.mapView.setStyle(mapStyle as any);
    Loader.default.hide();
  }

  onMarkerEvent(args) {
    const marker = args.marker as Marker;
    if (marker.userData && marker.userData.isDriver) {
      this.selectedDriver = marker.userData.driver;
      this.toggleState(4);
    }
  }
}
