import { HttpService, Loader } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { IPosition } from '@apps.common/models';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
import { IDriver } from '../models/driver';
@Injectable()
export class DriverService extends HttpService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected genericSubjects: GenericSubjects,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(http, storage, 'DRIVER', null, config.apiEndpoints.only.servicePath);
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getAvailableDrivers(...points: IPosition[]): Observable<IDriver[]> {
    return of<IDriver[]>([
      {
        firstName: 'Etienne',
        lastName: 'Yamsi',
        matricule: 'IU343OI',
        picture: '~/assets/bike.png',
        phoneNumber: '+237 697825762',
        location: {
          latitude: points[0].latitude - 0.003,
          longitude: points[0].longitude - 0.0001
        }
      },
      {
        firstName: 'Bug',
        lastName: 'Maker',
        matricule: 'IU349OI',
        picture: '~/assets/bike.png',
        phoneNumber: '+237 697825762',
        location: {
          latitude: points[1].latitude - 0.003,
          longitude: points[1].longitude - 0.0001
        }
      }
    ]);
  }
}
