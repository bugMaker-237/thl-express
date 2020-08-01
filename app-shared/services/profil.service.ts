import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
  HttpService,
  GenericSubjects,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { HttpOptions } from '@apps.common/models';
import { IUser } from '../models';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterExtensions } from 'nativescript-angular/router';
@Injectable()
export class ProfilService extends BaseService {
  profilUpdated$: Subject<IUser>;
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    protected router: RouterExtensions,
    private _genSubject: GenericSubjects,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'PAYMENT',
      toastService,
      config.apiEndpoints.only.servicePath
    );
    this.profilUpdated$ = _genSubject.add<IUser>('profilUpdated$');
    this.redirectUnauthorised = () => {
      this.router.navigate(['auth/sign-in']);
    };
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public getProfil(type: 'client' | 'driver' | string) {
    return this.get<IUser>(`/${type}/profile`);
  }

  public updateClientProfil(userData: {
    name: string;
    email?: string;
    phone?: string;
    picture?: Blob;
  }) {
    return this.post<any>('/client/profile', userData).pipe(
      map((res) => {
        this.profilUpdated$.next(res);
        return res;
      })
    );
  }

  public updateDriverProfil(userData: any) {
    return this.post<any>('/driver/profile', userData).pipe(
      map((res) => {
        this.profilUpdated$.next(res);
        return res;
      })
    );
  }
}
