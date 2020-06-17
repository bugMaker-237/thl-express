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
    return this.get('/journey');
  }
}
