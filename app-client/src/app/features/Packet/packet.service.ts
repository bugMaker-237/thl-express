import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PacketService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) { 
    super(
      http,
      storage,
      'PACKET',
      toastService,
      config.apiEndpoints.only.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getPacketType(): Observable<string[]> {
    return this.get<any>(`/colis-type`);
  }
}
