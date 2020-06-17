import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { PaginatedData } from '@apps.common/models';
import { IHistoryListItem, IHistory } from '../../models/history';
import { Observable } from 'rxjs';
import { AuthService } from '@app.shared/services';
import { map } from 'rxjs/operators';

@Injectable()
export class HistoryService extends BaseService {
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
      'HISTORY',
      toastService,
      config.apiEndpoints.driver.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getHistories(
    type: string,
    paging = 1
  ): Observable<PaginatedData<IHistory>> {
    return this.get<any>(`/history?type=${type}&page=${paging}`).pipe(
      map((data) => {
        // console.log(data);
        return {
          data: data.history.map((d) => ({
            id: d.id,
            date: d.createdat,
            price: d.price,
            origin: d.from,
            destination: d.to,
            originPosition: {
              latitude: d.latfrom,
              longitude: d.lngfrom,
            },
            destinationPosition: {
              latitude: d.latto,
              longitude: d.lngto,
            },
            state: d.status,
            transportType: d.type,
            paimentMethod: null,
            packet: d.packet || {},
            pressing: d.pressing || {},
            driver: {
              id: d.driver.id,
              picture:
                this.config.apiEndpoints.client.serviceHost +
                d.driver.driver.picture,
              user: {
                id: d.driver.driver.id,
                name: d.driver.name,
              },
            },
          })),
          pagination: data.pagination,
        };
      })
    );
  }

  getHistoryDetails(id: any): Observable<IHistory> {
    return this.get<IHistory>(`/history/${id}`);
  }
}
