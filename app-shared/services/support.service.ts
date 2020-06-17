import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { Observable } from 'rxjs';

@Injectable()
export class SupportService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'SUPPORT',
      toastService,
      config.apiEndpoints.only.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  complain(complain: { number: number; message: string }): Observable<any> {
    return this.post('/support', complain);
  }
}
