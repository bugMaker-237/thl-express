import { HttpService, Loader } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { IPosition, stringifyCoordinates } from '@apps.common/models';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
import { IDriver } from '../models/driver';
import { BaseService } from './base.service';
@Injectable()
export class DriverService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected genericSubjects: GenericSubjects,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'DRIVER',
      null,
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getAvailableDrivers(
    type: string,
    point: IPosition
  ): Observable<IDriver[]> {
    return this.get<any[]>(
      `/drivers?lat=${point.latitude}&lng=${point.longitude}&driver_type=${type}`
    ).pipe(
      map(drivers => {
        return drivers.map(d => ({
          id: d.id,
          distance: d.distance,
          picture: this.config.apiEndpoints.client.serviceHost + d.picture,
          matricule: d.matricule,
          immatriculation: d.immatriculation,
          user: d.user,
          location: {
            latitude: d.lat,
            longitude: d.lng
          }
        }));
      })
    );
  }
}
