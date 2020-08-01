import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { IPressingListItem, ICloth } from '../../models/pressing';
import { Observable } from 'rxjs';
import { AuthService } from '@app.shared/services';
import { map } from 'rxjs/operators';
import { PaginatedData } from '@apps.common/models';

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
      'PRESSING',
      toastService,
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getPressings(page = 1): Observable<PaginatedData<IPressingListItem>> {
    return this.get<any>(`/pressing?page=${page}`).pipe(
      map((data) => {
        // // console.log(data);
        return {
          data: data.history.map((h) => ({
            id: h.id,
            price: h.price,
            status: h.status,
            date: h.createdat,
            cloths: h.pressings.map((p) => ({
              id: p.clothe.id,
              type: p.clothe.type,
              price: p.clothe.price,
              commandId: p.command,
              quantity: p.quantity,
              details: p.observation,
              isValidated: p.is_validated,
            })),
          })),
          pagination: data.pagination,
        };
      })
    );
  }

  public getClothTypes(): Observable<ICloth[]> {
    return this.get<any[]>(`/pressing/clothes-type`).pipe(
      map((data) =>
        data.map((d) => ({
          name: d.type,
          id: d.id,
          price: d.price,
        }))
      )
    );
  }

  public savePressing(addedCloths: ICloth[]) {
    return this.post(`/pressing`, addedCloths);
  }
}
