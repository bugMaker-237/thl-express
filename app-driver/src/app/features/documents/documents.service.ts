import { Injectable, Inject } from '@angular/core';
import { BaseService, AuthService } from '@app.shared/services';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { map } from 'rxjs/operators';

@Injectable()
export class DocumentsService extends BaseService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    private _authService: AuthService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'DOCS',
      toastService,
      config.apiEndpoints.driver.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }
  public updateID(cni: { face: string; back: string }) {
    return this.post(`/driver_id`, {
      id_face: cni.face,
      id_back: cni.back,
    }).pipe(map((res) => this._authService.setUserInfos(res)));
  }
  public updateLicense(lic: { face: string; back: string }) {
    return this.post(`/driver_id`, {
      licence_face: lic.face,
      licence_back: lic.back,
    }).pipe(map((res) => this._authService.setUserInfos(res)));
  }
}
