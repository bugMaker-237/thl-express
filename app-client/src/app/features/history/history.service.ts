import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
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
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getHistories(type: string, paging = 1): Observable<IHistory[]> {
    return this.get<any[]>(`/history?type=${type}&page=${paging}`).pipe(
      map(data => {
        return data.map(d => ({
          id: d.id,
          date: d.createdat,
          price: d.price,
          origin: d.from,
          destination: d.to,
          originPosition: {
            latitude: d.latfrom,
            longitude: d.lngfrom
          },
          destinationPosition: {
            latitude: d.latto,
            longitude: d.lngto
          },
          state: d.status,
          transportType: d.type,
          paimentMethod: null,
          driver: null
        }));
      })
    );
  }

  getHistoryDetails(id: any): Observable<IHistory> {
    return this.get<IHistory>(`/history/${id}`);
  }
}
