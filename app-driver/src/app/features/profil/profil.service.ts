import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';

@Injectable()
export class ProfilService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'PAYMENT',
      toastService,
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public updateProfil(userData: {
    name: string;
    email?: string;
    phone?: string;
  }) {
    return this.post<any>('/profile', userData);
  }
}
