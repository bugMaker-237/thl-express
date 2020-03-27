import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { IJourneyRequest } from './journey';
import { IPlace, IMapRoute } from '@apps.common/models';
import { IDriver } from '@app.shared/models';
import { IPacket } from '~/app/models/packet';

@Injectable()
export class JourneyService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'JOURNEY',
      toastService,
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  saveJourney(
    currentMapRoute: IMapRoute,
    selectedDriver: IDriver,
    origin: IPlace,
    destination: IPlace,
    wishes: string,
    isPacketTransportation: boolean,
    packet: IPacket
  ) {
    const journey: IJourneyRequest = {
      distance: currentMapRoute.distance.value / 1000,
      driver: selectedDriver.id,
      latfrom: origin.latitude,
      lngfrom: origin.longitude,
      latto: destination.latitude,
      lngto: destination.longitude,
      placeto: destination.name,
      placefrom: origin.name,
      type: isPacketTransportation ? 'COLIS' : 'PERSONNE',
      wishes: wishes
    };
    if (isPacketTransportation) {
      journey.valeur = packet.value;
      journey.weight = packet.weight;
      journey.nature = packet.nature;
      journey.name = packet.receiver_name;
      journey.phone = Number.parseInt(packet.receiver_phone, 12);
    }
    return this.post<any>('/journey', journey);
  }
}
