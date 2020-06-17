import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
  HttpService,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { HttpOptions } from '@apps.common/models';

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
    picture?: Blob;
  }) {
    this.httpOptions = new HttpOptions().setHeader({
      key: 'Content-Type',
      value: 'multipart/form-data',
    });
    const res = this.post<any>('/profile', userData);
    this.httpOptions = HttpService.defaultHttpOptions();
    return res;
  }
}
