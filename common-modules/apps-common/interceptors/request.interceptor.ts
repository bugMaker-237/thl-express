import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {
  JwtHelperService,
  GenericSubjects,
  PendingRequestService,
  OnlineService,
} from '@root/services';
import { APP_CONFIG, IAppConfig } from '@root/config/app.config';
import { Observable, from, EMPTY } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { parse } from 'url';
import { ICacheStorageService } from '@root/services/storage/interfaces';
import { stringWithVersion, isOnline } from '@root/utils';
import { CacheStorageProvider } from '@root/modules/providers.common';
import { BaseInterceptor } from './base.interceptor';

@Injectable()
export class RequestInterceptor extends BaseInterceptor
  implements HttpInterceptor {
  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    @Inject(CacheStorageProvider) private cacheStorage: ICacheStorageService,
    private pendingRequestService: PendingRequestService,
    private _onlineService: OnlineService,
    protected genericSubjects: GenericSubjects,
    private location: Location
  ) {
    super();
    this.unCachableRoutes = config.cacheConfig.unCachableRoutes;
  }

  async handleInterception(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    const value = this._onlineService.isOnline();
    console.log(value);
    if (value) {
      return next
        .handle(request)
        .pipe(
          tap(
            (event) => this.handleResponse(request, event),
            (error) => this.handleResponse(request, error)
          )
        )
        .toPromise();
    } else {
      return Promise.resolve(
        new HttpErrorResponse({
          error: `Vous n'etes pas connecté`,
          status: 0,
        }) as any
      );
      // if (request.method.toLowerCase() === 'get') {
      //   return this.handleGetRequest(request);
      // } else {
      //   // TODO
      //   return this.handleGetRequest(request);
      //   // return this.handleOtherRequest(request);
      // }
    }
  }
  async handleOtherRequest(request: HttpRequest<any>) {
    const requestUrl = parse(request.url, false, true);
  }
  async handleGetRequest(request: HttpRequest<any>) {
    const requestUrl = parse(request.url, false, true);
    const cache = await this.cacheStorage.open(
      stringWithVersion(this.config.version, this.location.path(true))
    );
    const response = await cache.match(request);
    if (response) {
      return response;
    } else {
      const resp = new HttpResponse({
        status: 404,
        statusText: 'Aucune sauvegarde local trouvée',
        url: 'local-cache://' + requestUrl.path,
      });
      this.genericSubjects
        .get<HttpResponse<any>>('noDataFoundStatus$')
        .next(resp);
      return resp;
    }
  }

  async handleResponse(request: HttpRequest<any>, httpEvent: HttpEvent<any>) {
    const cacheName = stringWithVersion(
      this.config.version,
      this.location.path(true)
    );
    console.log(httpEvent);
    if (httpEvent instanceof HttpResponse) {
      // if (request.method.toLowerCase() === 'get') {
      //   const cache = await this.cacheStorage.open(cacheName);
      //   return cache.put(request, httpEvent);
      // }
      if (httpEvent instanceof HttpErrorResponse) {
        console.log(httpEvent);
        if (httpEvent.status === 401) {
          this.genericSubjects
            .get<boolean>('authenticationStatus$')
            .next(false);
        } else if (httpEvent.status === 0) {
          this.genericSubjects.get<boolean>('randomError$').next(true);
        } else {
          this.genericSubjects.get<boolean>('onlineStatus$').next(false);
        }
      }
    }
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isUnCachableRoutes(request)) {
      return next.handle(request);
    }

    return from(this.handleInterception(request, next));
  }
}
