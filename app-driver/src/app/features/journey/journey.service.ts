import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FromAPIEntity } from '~/app/models/history';

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
      config.apiEndpoints.driver.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  getCurrentDrives(): Observable<any> {
    return this.get('/journey').pipe(
      map((data: any) =>
        data.map((d) =>
          FromAPIEntity(d, this.config.apiEndpoints.driver.serviceHost)
        )
      )
    );
  }

  closeJourney(id: any) {
    return this.get(`/journey/${id}/close`);
  }
}
