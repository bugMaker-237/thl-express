import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { IPressingListItem, ICloth } from '../../models/pressing';
import { Observable } from 'rxjs';
import { AuthService } from '@app.shared/services';

@Injectable()
export class PressingService extends BaseService {
  constructor(
    private _authService: AuthService,
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'AUTH',
      toastService,
      config.apiEndpoints.only.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getPressings(paging = 1): Observable<IPressingListItem[]> {
    return this.get<IPressingListItem[]>(`/pressing?paging=${paging}`);
  }

  public getClothTypes(): Observable<ICloth[]> {
    return this.get<ICloth[]>(`/pressing/cloth-types`);
  }

  public savePressing(addedCloths: ICloth[]) {
    return this.post(`/pressing`, addedCloths);
  }
  // getPressingDetails(id: any): Observable<IPressing> {
  //   return this.get<IPressing>(
  //     `/pressing/${this._authService.connectedUser.id}/${id}`
  //   );
  // }
}
